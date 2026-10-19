// Restore pinned source caches without relying on another checkout's Git data.
// Repair is opt-in and keeps the old directory beside the replacement:
//   bun run sources:restore --repair --module example --local-source example=../donor
import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, realpathSync, renameSync, rmSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

type Module = { name: string; local?: string; subpath?: string; git?: { remote: string; ref: string } };
export type RestoreOptions = { repair?: boolean; localSources?: Record<string, string>; modules?: string[] };
type Inspection = { problems: string[]; clean: boolean | null; linked?: boolean };

function stat(path: string) {
  try { return lstatSync(path); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function git(directory: string, args: string[], allowFailure = false) {
  const env = { ...process.env, GIT_OPTIONAL_LOCKS: "0" };
  for (const key of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES"]) delete env[key as keyof typeof env];
  const result = Bun.spawnSync(["git", "-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null", "-C", directory, ...args], {
    env, stdout: "pipe", stderr: "pipe",
  });
  if (result.exitCode !== 0 && !allowFailure) {
    // Git stderr may contain credential-bearing remote URLs. Keep failures terse.
    throw new Error(`git ${args[0]} failed (exit ${result.exitCode ?? "unknown"}); the original cache is unchanged`);
  }
  return { ok: result.exitCode === 0, output: result.stdout.toString().trim() };
}

function cachePath(workspace: string, module: Module) {
  const local = module.local!;
  if (isAbsolute(local) || local.split(/[\\/]/).includes("..") || !local.startsWith(".tmp/")) {
    throw new Error(`${module.name}: source caches must use a relative path below .tmp/`);
  }
  const target = resolve(workspace, local);
  if (target === join(workspace, ".tmp")) throw new Error(`${module.name}: a cache needs its own directory`);
  let path = workspace;
  for (const part of relative(workspace, target).split(sep)) {
    if (part === ".git") throw new Error(`${module.name}: .git is not a cache path`);
    path = join(path, part);
    const item = stat(path);
    if (item?.isSymbolicLink() || (item && !item.isDirectory())) throw new Error(`${module.name}: cache path must contain only real directories`);
  }
  if (module.subpath && (isAbsolute(module.subpath) || module.subpath.split(/[\\/]/).some(part => part === ".." || part === ".git"))) {
    throw new Error(`${module.name}: subpath must stay within its repository`);
  }
  if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/i.test(module.git!.ref)) throw new Error(`${module.name}: git.ref must be a full commit ID`);
  if (!module.git!.remote || module.git!.remote.startsWith("-")) throw new Error(`${module.name}: invalid Git remote`);
  return target;
}

function hasSymlink(path: string): boolean {
  return readdirSync(path, { withFileTypes: true }).some(entry => entry.isSymbolicLink() || (entry.isDirectory() && hasSymlink(join(path, entry.name))));
}

function inspect(directory: string, module: Module): Inspection {
  const problems: string[] = [];
  const dotgit = join(directory, ".git");
  const metadata = stat(dotgit);
  if (!metadata?.isDirectory() || metadata.isSymbolicLink()) problems.push(".git is not a self-contained directory (possibly a worktree pointer)");
  const top = git(directory, ["rev-parse", "--show-toplevel"], true);
  if (!top.ok || realpathSync(top.output) !== realpathSync(directory)) return { problems: [...problems, "Git metadata is missing or invalid"], clean: null };
  const status = git(directory, ["status", "--porcelain=v1", "--untracked-files=all", "--ignored=matching"], true);
  if (!status.ok) return { problems: [...problems, "Git cannot verify the working tree"], clean: null };
  if (status.output) return { problems: [...problems, "cache contains modified, untracked or ignored files"], clean: false };
  const common = git(directory, ["rev-parse", "--git-common-dir"], true);
  if (!common.ok || resolve(directory, common.output) !== dotgit) problems.push("Git metadata is shared with another checkout");
  if (metadata?.isDirectory() && !metadata.isSymbolicLink()) {
    if (hasSymlink(dotgit)) problems.push("Git metadata contains symlinks");
    for (const name of ["alternates", "http-alternates"]) {
      const path = join(dotgit, "objects", "info", name);
      if (stat(path) && readFileSync(path, "utf8").trim()) problems.push("Git objects depend on an alternate object store");
    }
    if (git(directory, ["config", "--local", "--get-regexp", "^include"], true).ok) problems.push("Git configuration includes another file");
  }
  if (git(directory, ["config", "--get", "core.worktree"], true).ok) problems.push("Git configuration has an external worktree override");
  const head = git(directory, ["rev-parse", "--verify", "HEAD"], true);
  if (!head.ok || head.output.toLowerCase() !== module.git!.ref.toLowerCase()) problems.push("HEAD does not match the pinned commit");
  const origin = git(directory, ["remote", "get-url", "origin"], true);
  if (!origin.ok || origin.output !== module.git!.remote) problems.push("origin does not match the registered remote");
  const sparse = git(directory, ["config", "--bool", "core.sparseCheckout"], true).output === "true";
  if (!module.subpath && sparse) problems.push("a full source is configured with sparse checkout");
  if (module.subpath) {
    const tree = git(directory, ["cat-file", "-t", `${module.git!.ref}:${module.subpath}`], true);
    if (!tree.ok || tree.output !== "tree") problems.push("the pinned subpath is not a Git tree");
    else {
      const files = git(directory, ["ls-tree", "-rz", "--name-only", module.git!.ref, "--", module.subpath]);
      if (files.output.split("\0").filter(Boolean).some(path => !stat(join(directory, path)))) problems.push("the pinned subpath is not fully checked out");
    }
  }
  return { problems, clean: true, linked: !metadata?.isDirectory() || metadata.isSymbolicLink() || !common.ok || resolve(directory, common.output) !== dotgit };
}

// Include ignored/untracked files and modes, but never follow source symlinks.
// This also proves a broken pointer's remaining files are exactly the pinned tree.
function snapshot(directory: string): string {
  const hash = createHash("sha256");
  function walk(path: string, prefix: string) {
    for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (!prefix && entry.name === ".git") continue;
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = join(path, entry.name);
      if (entry.isDirectory()) { walk(full, name); continue; }
      hash.update(`${name}\0`);
      if (entry.isSymbolicLink()) hash.update(`link\0${readlinkSync(full)}\0`);
      else if (entry.isFile()) {
        hash.update(`${lstatSync(full).mode & 0o111 ? "executable" : "file"}\0`);
        hash.update(createHash("sha256").update(readFileSync(full)).digest());
      } else throw new Error("Cache contains a special file; refusing to replace it");
    }
  }
  walk(directory, "");
  return hash.digest("hex");
}

export function restoreModule(workspacePath: string, module: Module, options: RestoreOptions = {}): { state: "present" | "restored" | "repaired"; backup?: string } {
  const workspace = realpathSync(workspacePath);
  const target = cachePath(workspace, module);
  const exists = !!stat(target);
  const before = exists ? inspect(target, module) : null;
  if (before?.linked) throw new Error(`${module.name}: live linked worktree; migrate it with the workspace manager first so its registration cannot delete the replacement`);
  if (before?.clean === false) throw new Error(`${module.name}: dirty cache; preserve its changes before restoring`);
  if (before && before.problems.length === 0) return { state: "present" as const };
  if (before && !options.repair) throw new Error(`${module.name}: ${before.problems.join("; ")}. Use --repair to rebuild it with a backup`);
  const originalSnapshot = exists ? snapshot(target) : null;
  const donor = options.localSources?.[module.name];
  const source = donor ? resolve(workspace, donor) : "origin";
  if (donor && !git(source, ["cat-file", "-e", `${module.git!.ref}^{commit}`], true).ok) throw new Error(`${module.name}: local source does not contain the pinned commit`);
  mkdirSync(dirname(target), { recursive: true });
  const staging = mkdtempSync(join(dirname(target), `.${basename(target)}.restore-`));
  let backup: string | undefined;
  try {
    git(staging, ["init", "--template=", "-q"]);
    git(staging, ["remote", "add", "origin", module.git!.remote]);
    // Fetch copies objects; it creates neither hardlinks nor alternates. Avoid a
    // FETCH_HEAD entry containing the donor's machine-specific local path.
    git(staging, ["fetch", "-q", "--no-write-fetch-head", "--depth", "1", "--no-tags", source, module.git!.ref]);
    if (module.subpath) git(staging, ["sparse-checkout", "set", "--cone", module.subpath]);
    git(staging, ["checkout", "-q", "--detach", module.git!.ref]);
    const after = inspect(staging, module);
    if (after.clean !== true || after.problems.length) throw new Error(`${module.name}: replacement validation failed: ${after.problems.join("; ")}`);
    git(staging, ["fsck", "--connectivity-only", "--no-reflogs"]);
    if (exists) {
      if (snapshot(target) !== originalSnapshot) throw new Error(`${module.name}: cache changed during restoration; refusing to replace it`);
      if (before?.clean === null && snapshot(staging) !== originalSnapshot) throw new Error(`${module.name}: invalid Git metadata and files differ from the pinned checkout; refusing to replace possible local changes`);
      backup = `${target}.backup-${basename(staging).split(".restore-")[1]}`;
      renameSync(target, backup);
    }
    try { renameSync(staging, target); } catch (error) {
      if (backup) renameSync(backup, target);
      throw error;
    }
    return { state: exists ? "repaired" as const : "restored" as const, ...(backup ? { backup: relative(workspace, backup) } : {}) };
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

export function parseOptions(args: string[]): RestoreOptions {
  const options: RestoreOptions = { localSources: {}, modules: [] };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--repair") options.repair = true;
    else if (arg === "--module") {
      const name = args[++index];
      if (!name || name.startsWith("--")) throw new Error("--module requires a module name");
      options.modules!.push(name);
    } else if (arg === "--local-source") {
      const value = args[++index] ?? "";
      const split = value.indexOf("=");
      if (split < 1 || split === value.length - 1) throw new Error("--local-source requires module=path");
      options.localSources![value.slice(0, split)] = value.slice(split + 1);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

if (import.meta.main) {
  try {
    const options = parseOptions(process.argv.slice(2));
    const index = Bun.YAML.parse(await Bun.file("sources/repo/index.yaml").text()) as { sources: { modules: Module[] }[] };
    const modules = index.sources.flatMap(source => source.modules).filter(module => module.local && module.git);
    for (const name of [...options.modules!, ...Object.keys(options.localSources!)]) {
      if (!modules.some(module => module.name === name)) throw new Error(`Unknown source module: ${name}`);
    }
    for (const module of modules) {
      if (options.modules!.length && !options.modules!.includes(module.name)) continue;
      const result = restoreModule(process.cwd(), module, options);
      console.log(`${module.name}: ${module.git!.ref.slice(0, 12)} ${result.state}${result.backup ? `; backup: ${result.backup}` : ""}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Source restoration failed");
    process.exitCode = 1;
  }
}
