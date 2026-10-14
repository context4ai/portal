// Check out every registered repository module at its pinned commit, so a fresh
// clone (CI) can verify cited source regions.
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { $ } from "bun";

type Module = { name: string; local?: string; git?: { remote: string; ref: string } };
const index = Bun.YAML.parse(await Bun.file("sources/repo/index.yaml").text()) as {
  sources: { name: string; modules: Module[] }[];
};

for (const source of index.sources) {
  for (const module of source.modules) {
    if (!module.local || !module.git) continue;
    const { local } = module;
    const { remote, ref } = module.git;
    if (existsSync(`${local}/.git`)) {
      const has = await $`git -C ${local} cat-file -e ${ref}^{commit}`.nothrow().quiet();
      if (has.exitCode === 0) {
        console.log(`${module.name}: ${ref.slice(0, 12)} already present`);
        continue;
      }
    } else {
      await mkdir(local, { recursive: true });
      await $`git -C ${local} init -q`;
      await $`git -C ${local} remote add origin ${remote}`;
    }
    await $`git -C ${local} fetch -q --depth 1 origin ${ref}`;
    await $`git -C ${local} checkout -q --detach ${ref}`;
    console.log(`${module.name}: ${ref.slice(0, 12)} checked out`);
  }
}
