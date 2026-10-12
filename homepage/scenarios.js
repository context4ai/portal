// Retrieval scenes for the homepage field: a question, the knowledge page that answers it, and the evidence behind it.
// Evidence links open Source Graph's reader pinned to an indexed commit: /sourcegraph/code?repo=&path=&commit=#L<n>.
// Knowledge pages link to the docs root until the articles are published.
const REPOS = {
  context: { repo: "context4ai/context", commit: "512593e18f1dabb1ccc5d341b74850d2f0ba10e4" },
  sourcegraph: { repo: "context4ai/sourcegraph", commit: "2093bf9b618a37c7869f56175bf9c8d5cecc8dbe" },
};
const CLI = "packages/context-cli";
const RES = `${CLI}/context-workflow/resources`;
const WF = `${CLI}/context-workflow`;
const isDoc = path => /\.(md|ya?ml|html)$/.test(path);
const ref = (key, path, line, type) => {
  const { repo, commit } = REPOS[key];
  const name = path.split("/").pop();
  return {
    type: type || (isDoc(path) ? "doc" : "code"),
    label: line ? `${name}:${line}` : name,
    href: `/sourcegraph/code?${new URLSearchParams({ repo, path, commit })}${line ? `#L${line}` : ""}`,
  };
};
const code = (file, line) => ref("context", `${CLI}/${file}`, line);
const doc = (file, type) => ref("context", `${RES}/${file}`, undefined, type);
const wf = (file, line) => ref("context", `${WF}/${file}`, line);
const sg = (file, line) => ref("sourcegraph", file, line);
const scene = (area, zh, en, kZh, kEn, ev) => ({ area, q: { zh, en }, k: { zh: kZh, en: kEn }, ev });

export const SCENARIOS = [
  scene("context", "知识里每句话的出处在哪？", "Where does each sentence in the knowledge come from?", "证据与引用", "Evidence and citations",
    [code("src/evidence/blockIdentity.ts", 19), code("src/project/documentEvidenceIndex.ts", 254), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "Review 通过之后才会发布吗？", "Is anything published before review passes?", "审核与发布", "Review and publishing",
    [code("src/project/review.ts", 330), code("src/project/approvedRevisionRoute.ts", 11), doc("manuals/guides/package-outputs.md")]),
  scene("context", "源码更新后，知识怎么跟着变？", "How does knowledge follow source changes?", "知识更新", "Knowledge updates",
    [code("src/project/knowledgeMaintenanceRoute.ts", 6), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "飞书和 Markdown 文档能导入吗？", "Can I import Lark and Markdown documents?", "文档采集", "Document capture",
    [code("src/project/documentCapture.ts", 264), doc("manuals/guides/imports.md"), doc("manuals/guides/lark-resources.md")]),
  scene("context", "飞书画板也能变成知识吗？", "Can a Lark whiteboard become knowledge?", "飞书资源", "Lark resources",
    [code("src/lib/larkWhiteboardExport.ts", 36), doc("manuals/guides/lark-resources.md")]),
  scene("context", "文档站的导航和样式怎么定制？", "How do I customise the docs site?", "站点定制", "Site customisation",
    [code("src/project/packageSite.ts", 45), code("src/project/packageSiteTheme.ts", 504), doc("manuals/guides/page-customization.md")]),
  scene("context", "一个知识包里到底装了什么？", "What is inside a knowledge package?", "知识包结构", "Package structure",
    [code("src/project/packageKnowledgeProjection.ts", 56), doc("manuals/reference/package-templates.md")]),
  scene("context", "知识包怎么直接给大模型读？", "How does a model read a package directly?", "llms.txt 与知识地图", "llms.txt and the knowledge map",
    [code("src/project/packageLlms.ts", 11), doc("manuals/guides/package-outputs.md")]),
  scene("context", "会话里的结论能沉淀成知识吗？", "Can conclusions from a chat become knowledge?", "笔记与会话", "Notes and sessions",
    [doc("manuals/guides/sessions.md", "session"), doc("manuals/guides/note.md", "note")]),
  scene("context", "代码仓库是怎么被抽取的？", "How is a code repository extracted?", "代码抽取", "Code extraction",
    [doc("manuals/reference/code-extractors.md"), code("src/project/indexerCodePageProjections.ts", 15)]),
  scene("context", "能为自己的框架写一个 Indexer 吗？", "Can I write an Indexer for my framework?", "自定义 Indexer", "Custom Indexers",
    [doc("manuals/guides/code-indexer-skill-authoring.md"), doc("manuals/guides/indexer-provider-and-customization.md")]),
  scene("context", "上百个来源怎么分批处理？", "How are hundreds of sources batched?", "来源批次", "Source batches",
    [code("src/project/sourceBatchRegistration.ts", 155), doc("manuals/guides/source-batches.md")]),
  scene("context", "哪些文章必须先审核？", "Which articles must be reviewed first?", "必审文章", "Required reviews",
    [code("src/project/indexerRequiredArticleReview.ts", 17), doc("manuals/guides/workspace-commit.md")]),
  scene("context", "页面挪了位置，旧链接会断吗？", "Do old links break when a page moves?", "页面移动与引用", "Page moves and references",
    [code("src/project/approvedPageMove.ts", 7), code("src/project/approvedStructureEdges.ts", 134)]),
  scene("context", "这个版本和上个版本比改了什么？", "What changed since the last version?", "版本与 Changelog", "Versions and changelog",
    [code("src/commands/versionCommands.ts", 10), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "新同事怎么接手同一个知识库？", "How does a new teammate pick up the workspace?", "工作区恢复", "Workspace restore",
    [doc("manuals/guides/workspace-restore.md"), doc("manuals/guides/workspace-prepare.md")]),

  scene("source", "远程搜索为什么能做到毫秒级？", "How is remote search this fast?", "Source Graph · 索引与检索", "Source Graph · indexing and search",
    [sg("README.md", 14), sg("internal/service/scoped_search.go", 122)]),
  scene("source", "命令行能像 rg 一样搜远程仓库吗？", "Can a CLI search remote repos like rg?", "Source Graph · CLI", "Source Graph · CLI",
    [sg("cmd/sourcegraph-cli/main.go", 37), sg("web/assets/connect-page.js", 23)]),
  scene("source", "能只搜 *.go 文件吗？", "Can I search only *.go files?", "Source Graph · 搜索语法", "Source Graph · query syntax",
    [sg("cmd/sourcegraph-cli/main.go", 37), sg("web/assets/search-model.mjs", 21)]),
  scene("source", "Agent 怎么读到固定版本的代码？", "How does an agent read a pinned commit?", "Source Graph · 固定版本读取", "Source Graph · pinned reads",
    [code("src/project/evidencePlugin.ts", 54), sg("internal/service/scoped_search.go", 122)]),
  scene("source", "Source Graph 能接 MCP 吗？", "Does Source Graph speak MCP?", "Source Graph · MCP", "Source Graph · MCP",
    [sg("docs/interfaces.md", 5), sg("README.md", 49)]),
  scene("source", "它提供哪些接口？", "Which interfaces does it offer?", "Source Graph · 接口", "Source Graph · interfaces",
    [sg("docs/interfaces.md", 5), sg("docs/interfaces.md", 16)]),
  scene("source", "证据行号会随提交漂移吗？", "Do evidence line numbers drift between commits?", "版本锁定的证据", "Pinned evidence",
    [code("src/evidence/blockIdentity.ts", 15), code("src/project/documentEvidenceIndex.ts", 586)]),
  scene("source", "可以自己部署一套吗？", "Can I deploy my own?", "Source Graph · 部署", "Source Graph · deployment",
    [sg("docs/deployment.md", 21), sg("DEVELOPMENT.md", 32)]),
  scene("source", "新仓库怎么接进来？", "How do I add a repository?", "Source Graph · 仓库登记", "Source Graph · repositories",
    [sg("web/repos.html", 19), sg("cmd/repo-service/main.go", 35)]),
  scene("source", "搜索太频繁会被限流吗？", "Is heavy searching rate limited?", "Source Graph · 限流", "Source Graph · rate limits",
    [sg("internal/httpserver/runtime.go", 215), sg("internal/mcpserver/recovery.go", 12)]),

  scene("agent", "Route 和 Gate 分别做什么？", "What do Routes and Gates do?", "Agent Graph · Route 与 Gate", "Agent Graph · Routes and Gates",
    [wf("README.zh-CN.md", 13), wf("graphs/workspace.yaml")]),
  scene("agent", "每一步为什么这么走，能查到原因吗？", "Can I see why each step was chosen?", "Agent Graph · 路由原因", "Agent Graph · route reasons",
    [wf("codes.yaml", 3), wf("README.zh-CN.md", 9)]),
  scene("agent", "工作流能不调模型就测试吗？", "Can a workflow be tested without a model?", "Agent Graph · 场景测试", "Agent Graph · scenario tests",
    [wf("tests/complete.yaml"), wf("README.zh-CN.md", 40)]),
  scene("agent", "流程中断后从哪恢复？", "Where does an interrupted run resume?", "Agent Graph · Run 与恢复", "Agent Graph · runs and recovery",
    [wf("actions/inspect-task-recovery.yaml"), wf("README.zh-CN.md", 69)]),
  scene("agent", "过期的指令会被执行吗？", "Can a stale instruction still run?", "Agent Graph · Revision 校验", "Agent Graph · revision checks",
    [wf("README.zh-CN.md", 51)]),
  scene("agent", "Agent 做过的每一步能回看吗？", "Can I replay every step an agent took?", "Agent Graph · 运行事件", "Agent Graph · runtime events",
    [wf("actions/flush-runtime-events.yaml"), code("src/commands/runtimeEventLogs.ts", 19)]),
  scene("agent", "全托管运行会在哪里停下？", "Where does a fully managed run stop?", "Agent Graph · 全托管循环", "Agent Graph · managed loop",
    [wf("README.zh-CN.md", 77), wf("README.zh-CN.md", 86)]),
  scene("agent", "什么时候需要人来确认？", "When does a person need to confirm?", "人工关口", "Human gates",
    [code("src/project/indexerRequirementGateActions.ts", 20), doc("dialogue/human-gates.md")]),
  scene("agent", "做错了能回滚吗？", "Can a mistake be rolled back?", "Agent Graph · 回滚", "Agent Graph · rollback",
    [wf("actions/finish-rollback.yaml")]),
  scene("agent", "生产流程每一步怎么编排？", "How is each production step orchestrated?", "Agent Graph · 生产流程", "Agent Graph · production route",
    [code("src/project/productionWorkflowRoute.ts", 16), wf("graphs/indexer.yaml")]),
  scene("agent", "单个步骤的做法怎么持续优化？", "How does a single step keep improving?", "Agent Graph · 节点技能", "Agent Graph · step skills",
    [wf("actions/approve-production-report.yaml"), code("src/project/productionSkillCatalog.ts", 20)]),
];
