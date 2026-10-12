# portal Context Project

This is a project-local Context workspace. `src/` contains human-maintained project declarations and package templates; `sources/`, `knowledge/`, `dist/`, and `.tmp/context-runtime/` are lifecycle-managed by Context.

## Working Directory

The directory containing this file is this Context workspace root, identified by `context.project: true` in its package.json. Set it explicitly as the working directory of every workflow CLI call, including after conversation resume. A previous shell `cd` may not persist.

Keep this task's `.tmp/agent-payloads/`, work-start report, and `.tmp/context-runtime/` in this workspace. Generate and read them using workspace-local paths, never a parent or another workspace's `.tmp/`. Source material may live elsewhere; its location does not select the workspace.

If the CLI workspace, Route resources, and task scratch directory refer to different workspaces, a command, write, or read is targeting the wrong location. Stop submissions, follow the CLI working-directory diagnostic, and obtain the intended workspace's current Route. Even an initialized parent is a separate workspace: do not mix revisions, tasks, or ledgers, move runtime state, or initialize another workspace to clear the error.

## Workspace Contract

Use context-repo-content for independent edits and registration of same-repository docs and authored Skills. repo-content/ is a symlink view: edit originals, use rg -L locally, or real paths from repo-content.yaml when links are unavailable. Editing does not start production or advance knowledge baselines.

package.json.version is the workspace version. At formal-content completion, use context version inspect / record to increment SemVer and generate changelog.yaml and CHANGELOG.md together. Write descriptions from the diff and conversation. Added modules/coverage increment minor; repairs, navigation and persistent status changes increment patch. Major requires an explicit user instruction. Ignore .tmp progress; build only records hashes. The coordinator alone records versions; recording a version does not commit or publish, and later delivery follows this task's authorization and the installed distribution skill. Triggers are required; use an explicitly known conversational Lark display name, otherwise let CLI use Git user.name.
Compare bodies, structure, assets, navigation and templates using Git; version inspect --base selects a delivery commit/tag. Preview builds do not seal versions. Changes to already published content must increment the version. No root Context version/build/publication receipts are required.
Each version's changelog details must total at most 1500 visible characters, including punctuation across the title, changes, trigger descriptions and user display name; exclude protocol keys, version and date. Before submission, compress longer entries by merging related changes and removing repeated process narration. Preserve the main changes, impact and triggers; never truncate blindly or split one iteration into multiple versions to evade the limit.

- Start or resume through the installed Context Skill. When using the CLI directly, begin with `context status --format json`.
- Treat `workflow.current` and its selected resources and commands as the only current-step authority. Do not reconstruct the lifecycle from this file, an earlier conversation, or memory.
- When the Route returns `configuration`, edit only the named project files. Use Context CLI for every lifecycle write. User-facing knowledge pages and outputs may be read normally, but managed directories must never be repaired or rewritten with ad hoc scripts.
- Source, semantic-structure, Review, and package-shape decisions require user authority or authority established by the current Route. Never infer them from repository layout, filenames, or examples.
- Context completion proves knowledge-workflow state, not Git commit safety. Preserve worktree changes that existed before the task, stage only explicit paths, and never use `git add -A` to mix unrelated modifications, deletions, or untracked directories into the deliverable.
- Customize `src/package-templates/kb/wikis/index.md` for the product before publishing a knowledge package; do not edit generated `dist/` pages.

## Navigation and Classification

Before adding or revising knowledge, read the current map, overview and relevant category articles to understand and reuse their intent. Follow the current Route's knowledge-updates guidance for placement, names and order. A new source or product does not automatically warrant a top-level category. Present top-level name, purpose or structure changes with a before/after tree and reuse rationale in the work-start report or current plan, and obtain approval of the concrete proposal before applying it. Reuse explicit prior approval; ordinary placements add no review gate. Keep lasting category intent concise in this file or the existing organization guide.

## Diagram style (user editable)

- Keep diagrams minimal: approximately 1px lines, theme-default text and stroke colors, no colorful decoration. Avoid fixed Mermaid palettes, backgrounds and theme initialization. Configure line width in a capable viewer; unsupported styling never blocks authoring.
- Follow this editable AGENTS.md and explicit current user instructions. Preserve meaningful source colors as labels or a legend instead of discarding their meaning.
- package.json context.convertVisuals defaults to true. Attempt faithful structural diagram/table conversion when capable; otherwise retain the original. Explicit session opt-out overrides the saved default.

## Manuals

- Read only the manuals and schemas selected by `workflow.current.resources` for the current step.
- General SDK index: `node_modules/@c4a/context/docs/README.md`.
- Project declarations: `node_modules/@c4a/context/docs/reference/project-api.md`.
- Package templates: `node_modules/@c4a/context/docs/reference/package-templates.md`.
