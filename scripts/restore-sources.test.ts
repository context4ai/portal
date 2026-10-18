import { afterEach, describe, expect, test } from "bun:test";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseOptions, restoreModule } from "./restore-sources";

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function git(path: string, ...args: string[]) {
  const result = Bun.spawnSync(["git", "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "core.hooksPath=/dev/null", "-C", path, ...args], { stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "restore-sources-test-")); roots.push(root);
  const workspace = join(root, "workspace");
  const donor = join(root, "donor");
  mkdirSync(workspace); mkdirSync(donor);
  git(donor, "init", "--template=", "-q");
  mkdirSync(join(donor, "packages", "selected"), { recursive: true });
  mkdirSync(join(donor, "packages", "other"), { recursive: true });
  writeFileSync(join(donor, "README.md"), "original\n");
  writeFileSync(join(donor, ".gitignore"), "scratch.txt\n");
  writeFileSync(join(donor, "packages", "selected", "source.ts"), "export const value = 1;\n");
  writeFileSync(join(donor, "packages", "other", "source.ts"), "export const other = 1;\n");
  git(donor, "add", "."); git(donor, "commit", "-qm", "fixture");
  const first = git(donor, "rev-parse", "HEAD");
  writeFileSync(join(donor, "README.md"), "second\n");
  git(donor, "add", "."); git(donor, "commit", "-qm", "second fixture");
  const second = git(donor, "rev-parse", "HEAD");
  const module = { name: "example", local: ".tmp/sources/example", git: { remote: donor, ref: first } };
  const cache = join(workspace, module.local);
  return { root, workspace, donor, first, second, module, cache };
}
function breakPointer(cache: string) {
  rmSync(join(cache, ".git"), { recursive: true });
  writeFileSync(join(cache, ".git"), "gitdir: /missing/source-repository/.git/worktrees/example\n");
}
function backupNames(cache: string) { return readdirSync(resolve(cache, "..")).filter(name => name.startsWith("example.backup-")); }

describe("portable pinned source restoration", () => {
  test("fresh and repeated restoration stays detached, self-contained and relocatable", () => {
    const f = fixture();
    expect(restoreModule(f.workspace, f.module).state).toBe("restored");
    expect(git(f.cache, "rev-parse", "HEAD")).toBe(f.first);
    expect(lstatSync(join(f.cache, ".git")).isDirectory()).toBe(true);
    expect(existsSync(join(f.cache, ".git", "objects", "info", "alternates"))).toBe(false);
    expect(existsSync(join(f.cache, ".git", "FETCH_HEAD"))).toBe(false);
    expect(restoreModule(f.workspace, f.module).state).toBe("present");
    const relocated = join(f.root, "relocated"); cpSync(f.cache, relocated, { recursive: true });
    renameSync(f.donor, `${f.donor}-unavailable`);
    expect(git(relocated, "rev-parse", "HEAD")).toBe(f.first);
    expect(git(relocated, "status", "--porcelain")).toBe("");
    git(relocated, "fsck", "--connectivity-only", "--no-reflogs");
  });

  test("broken pointer requires repair and preserves the old directory in a backup", () => {
    const f = fixture(); restoreModule(f.workspace, f.module); breakPointer(f.cache);
    expect(() => restoreModule(f.workspace, f.module)).toThrow("--repair");
    const result = restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } });
    expect(result.state).toBe("repaired");
    expect(lstatSync(join(f.cache, ".git")).isDirectory()).toBe(true);
    expect(readFileSync(join(f.workspace, result.backup!, ".git"), "utf8")).toContain("/missing/");
    expect(git(f.cache, "remote", "get-url", "origin")).toBe(f.module.git.remote);
    expect(git(f.cache, "rev-parse", "HEAD")).toBe(f.first);
  });

  test("a valid linked worktree requires its workspace manager, preventing stale ownership", () => {
    const f = fixture(); mkdirSync(resolve(f.cache, ".."), { recursive: true });
    git(f.donor, "worktree", "add", "--detach", f.cache, f.first);
    const pointer = readFileSync(join(f.cache, ".git"), "utf8");
    expect(() => restoreModule(f.workspace, f.module)).toThrow("live linked worktree");
    expect(() => restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } })).toThrow("live linked worktree");
    expect(readFileSync(join(f.cache, ".git"), "utf8")).toBe(pointer);
    expect(git(f.donor, "rev-parse", "HEAD")).toBe(f.second);
    expect(git(f.cache, "rev-parse", "HEAD")).toBe(f.first);
    expect(backupNames(f.cache)).toEqual([]);
  });

  test("finding a commit object is insufficient when HEAD is at another revision", () => {
    const f = fixture(); restoreModule(f.workspace, { ...f.module, git: { ...f.module.git, ref: f.second } });
    git(f.cache, "fetch", "-q", "origin", f.first);
    expect(() => restoreModule(f.workspace, f.module)).toThrow("HEAD does not match");
    expect(git(f.cache, "rev-parse", "HEAD")).toBe(f.second);
    restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } });
    expect(git(f.cache, "rev-parse", "HEAD")).toBe(f.first);
  });

  for (const state of ["modified", "untracked", "ignored"] as const) {
    test(`refuses a ${state} cache even with --repair`, () => {
      const f = fixture(); restoreModule(f.workspace, f.module);
      const file = state === "modified" ? "README.md" : state === "ignored" ? "scratch.txt" : "new.txt";
      writeFileSync(join(f.cache, file), "user changes\n");
      expect(() => restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } })).toThrow("dirty cache");
      expect(readFileSync(join(f.cache, file), "utf8")).toBe("user changes\n");
      expect(backupNames(f.cache)).toEqual([]);
    });
  }

  test("broken Git metadata does not permit replacing changed source files", () => {
    const f = fixture(); restoreModule(f.workspace, f.module); breakPointer(f.cache);
    writeFileSync(join(f.cache, "README.md"), "uncommitted change\n");
    expect(() => restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } })).toThrow("possible local changes");
    expect(readFileSync(join(f.cache, "README.md"), "utf8")).toBe("uncommitted change\n");
    expect(lstatSync(join(f.cache, ".git")).isFile()).toBe(true);
    expect(backupNames(f.cache)).toEqual([]);
  });

  test("restores a sparse subtree and detects a missing declared subtree", () => {
    const f = fixture(); const module = { ...f.module, subpath: "packages/selected" };
    restoreModule(f.workspace, module);
    expect(existsSync(join(f.cache, "packages", "selected", "source.ts"))).toBe(true);
    expect(existsSync(join(f.cache, "packages", "other"))).toBe(false);
    expect(restoreModule(f.workspace, module).state).toBe("present");
    git(f.cache, "sparse-checkout", "set", "--cone", "packages/other");
    expect(() => restoreModule(f.workspace, module)).toThrow("subpath is not fully checked out");
    restoreModule(f.workspace, module, { repair: true, localSources: { example: f.donor } });
    expect(existsSync(join(f.cache, "packages", "selected", "source.ts"))).toBe(true);
  });

  test("wrong origin is detected and repaired using the registered remote", () => {
    const f = fixture(); restoreModule(f.workspace, f.module);
    git(f.cache, "remote", "set-url", "origin", "https://example.invalid/wrong.git");
    expect(() => restoreModule(f.workspace, f.module)).toThrow("origin does not match");
    restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } });
    expect(git(f.cache, "remote", "get-url", "origin")).toBe(f.module.git.remote);
  });

  test("shared object stores need repair, and repair copies the objects", () => {
    const f = fixture(); mkdirSync(resolve(f.cache, ".."), { recursive: true });
    git(f.workspace, "clone", "-q", "--shared", f.donor, f.cache);
    git(f.cache, "checkout", "-q", "--detach", f.first);
    expect(() => restoreModule(f.workspace, f.module)).toThrow("alternate object store");
    restoreModule(f.workspace, f.module, { repair: true, localSources: { example: f.donor } });
    expect(existsSync(join(f.cache, ".git", "objects", "info", "alternates"))).toBe(false);
    renameSync(f.donor, `${f.donor}-unavailable`);
    git(f.cache, "fsck", "--connectivity-only", "--no-reflogs");
  });

  test("fetch failure leaves the old cache in place and removes only its own staging directory", () => {
    const f = fixture(); restoreModule(f.workspace, f.module); breakPointer(f.cache);
    const wrong = { ...f.module, git: { ...f.module.git, remote: join(f.root, "missing-repository") } };
    expect(() => restoreModule(f.workspace, wrong, { repair: true })).toThrow("git fetch failed");
    expect(lstatSync(join(f.cache, ".git")).isFile()).toBe(true);
    expect(readFileSync(join(f.cache, "README.md"), "utf8")).toBe("original\n");
    expect(readdirSync(resolve(f.cache, ".."))).toEqual(["example"]);
  });

  test("rejects cache paths escaping .tmp or traversing symlinks", () => {
    const f = fixture();
    for (const local of [f.donor, "../donor", ".tmp/../donor", "apps/example"]) {
      expect(() => restoreModule(f.workspace, { ...f.module, local })).toThrow("relative path below .tmp");
    }
    mkdirSync(join(f.workspace, ".tmp"));
    symlinkSync(f.donor, join(f.workspace, ".tmp", "sources"));
    expect(() => restoreModule(f.workspace, f.module)).toThrow("real directories");
    expect(git(f.donor, "rev-parse", "HEAD")).toBe(f.second);
  });

  test("CLI repair options are explicit and module-scoped", () => {
    expect(parseOptions(["--repair", "--module", "example", "--local-source", "example=../donor"])).toEqual({ repair: true, modules: ["example"], localSources: { example: "../donor" } });
    expect(() => parseOptions(["--local-source", "../donor"])).toThrow("module=path");
    expect(() => parseOptions(["--module"])).toThrow("module name");
    expect(() => parseOptions(["--force"])).toThrow("Unknown option");
  });
});
