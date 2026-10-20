// Retrieval scenes for the homepage field: a question, the knowledge page that answers it, and the evidence behind it.
// Evidence links open Source Graph's reader on the default branch: /sourcegraph/code?repo=&path=&revision=main#L<n>.
// The public instance retains only the latest commit, so a pinned SHA stops resolving after the next push;
// line numbers follow main and must be rechecked when the cited files change.
// Knowledge tags open the article that answers the question; site paths derive from the article identity and stay stable.
const REPOS = {
  context: { repo: "context4ai/context", revision: "main" },
  sourcegraph: { repo: "context4ai/sourcegraph", revision: "main" },
};
const PAGES = {
  "architecture/agent-graph/core-model": "pages/ad65c836debb540be355e741aabf3dcf.html",
  "architecture/agent-graph/runs-and-recovery": "pages/708a22de19d0b807fd512451f1269434.html",
  "architecture/context/workflow-execution": "pages/6c0213d0f56d7a7b8fc1a5724b8fc6b1.html",
  "architecture/knowledge/code-extraction": "pages/e4cf47bd22eda024127ed5f7e0ba2041.html",
  "architecture/knowledge/evidence-chains": "pages/d2f41bdf9360d05ff944e1b475267498.html",
  "architecture/knowledge/keeping-knowledge-current": "pages/5ab69e04925afb8be867ea65ed680f86.html",
  "architecture/source-graph/evidence-for-context": "pages/3bbf57d3dcee4b0ea0433d3b367cc045.html",
  "architecture/source-graph/pinned-search-and-reads": "pages/9b8f7c105b990cf29a3a7936dc0ff462.html",
  "product/reference/source-graph/cli": "pages/7b5a8c8039ac425e57fbaeb65690b5b6.html",
  "product/reference/source-graph/http-and-mcp": "pages/a8fe02c341a72e370f653228d71e9982.html",
  "product/reference/source-graph/query-syntax": "pages/e6f59a794ecd01b09dc543afbc9f5da1.html",
  "sop/agent-graph/testing-and-publishing": "pages/2a26bc3e8f39cad36b9354cb975ec644.html",
  "sop/custom-indexers/creating-an-indexer": "pages/ea58e96a208549b9844ac19839769dcc.html",
  "sop/outputs-and-sites/knowledge-packages": "pages/d44c4a3b119c1c5101baa173791105e1.html",
  "sop/outputs-and-sites/llm-docs": "pages/7d888a31ded9bcd291bc79dcd6c87e26.html",
  "sop/outputs-and-sites/page-and-theme-customization": "pages/a14f7cbf6856dbd2ae309934ea6186c8.html",
  "sop/planning-and-production/managed-mode-and-review-policy": "pages/5030bf2337d071ef87c6ac25f5a32343.html",
  "sop/registering-sources/document-directories": "pages/8c2b49b432214167855ee9d7e2888616.html",
  "sop/registering-sources/lark-documents": "pages/fafe8d11c18d92f5a291f0d33365cebc.html",
  "sop/registering-sources/notes": "pages/90474554e682f858092546bb5cea1e31.html",
  "sop/registering-sources/source-batches": "pages/92cda9ec7ca5555e8fca265148b89dd6.html",
  "sop/review-and-revision/reading-review-reports": "pages/1ee5af170f818c848c9e91a9b1d98d4e.html",
  "sop/review-and-revision/reorganizing-at-scale": "pages/9b7018d3ff025bc9a5ed714bf0a7762c.html",
  "sop/source-graph/connecting": "pages/ef2f49d8f38697ceb1f7aaa88deba84d.html",
  "sop/source-graph/operations": "pages/b6b5d0b7d4370275aa82611da7136e4f.html",
  "sop/source-graph/registering-repositories": "pages/aa50227a56841f0d42fe08e9dfa4cd53.html",
  "sop/source-graph/self-hosting": "pages/87e9a0f083fa7c393fae3f5bbb123a11.html",
  "sop/updates-and-versions/versions-and-changelog": "pages/4b322e03dfda3960ee4e5753b1f66a0f.html",
};
const CLI = "packages/context-cli";
const RES = `${CLI}/context-workflow/resources`;
const WF = `${CLI}/context-workflow`;
const isDoc = path => /\.(md|ya?ml|html)$/.test(path);
const ref = (key, path, line, type) => {
  const { repo, revision } = REPOS[key];
  const name = path.split("/").pop();
  return {
    type: type || (isDoc(path) ? "doc" : "code"),
    label: line ? `${name}:${line}` : name,
    href: `/sourcegraph/code?${new URLSearchParams({ repo, path, revision })}${line ? `#L${line}` : ""}`,
  };
};
const code = (file, line) => ref("context", `${CLI}/${file}`, line);
const doc = (file, type) => ref("context", `${RES}/${file}`, undefined, type);
const wf = (file, line) => ref("context", `${WF}/${file}`, line);
const sg = (file, line) => ref("sourcegraph", file, line);
const article = path => `/context/${PAGES[path]}`;
const scene = (area, zh, en, kZh, kEn, page, ev) => ({ area, q: { zh, en }, k: { zh: kZh, en: kEn }, link: article(page), ev });

export const SCENARIOS = [
  scene("context", "知识里每句话的出处在哪？", "Where does each sentence in the knowledge come from?", "证据与引用", "Evidence and citations", "architecture/knowledge/evidence-chains",
    [code("src/evidence/blockIdentity.ts", 19), code("src/project/documentEvidenceIndex.ts", 254), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "Review 通过之后才会发布吗？", "Is anything published before review passes?", "审核与发布", "Review and publishing", "sop/review-and-revision/reading-review-reports",
    [code("src/project/review.ts", 330), code("src/project/approvedRevisionRoute.ts", 11), doc("manuals/guides/package-outputs.md")]),
  scene("context", "源码更新后，知识怎么跟着变？", "How does knowledge follow source changes?", "知识更新", "Knowledge updates", "architecture/knowledge/keeping-knowledge-current",
    [code("src/project/knowledgeMaintenanceRoute.ts", 6), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "飞书和 Markdown 文档能导入吗？", "Can I import Lark and Markdown documents?", "文档采集", "Document capture", "sop/registering-sources/document-directories",
    [code("src/project/documentCapture.ts", 264), doc("manuals/guides/imports.md"), doc("manuals/guides/lark-resources.md")]),
  scene("context", "飞书画板也能变成知识吗？", "Can a Lark whiteboard become knowledge?", "飞书资源", "Lark resources", "sop/registering-sources/lark-documents",
    [code("src/lib/larkWhiteboardExport.ts", 36), doc("manuals/guides/lark-resources.md")]),
  scene("context", "文档站的导航和样式怎么定制？", "How do I customise the docs site?", "站点定制", "Site customisation", "sop/outputs-and-sites/page-and-theme-customization",
    [code("src/project/packageSite.ts", 47), code("src/project/packageSiteTheme.ts", 743), doc("manuals/guides/page-customization.md")]),
  scene("context", "一个知识包里到底装了什么？", "What is inside a knowledge package?", "知识包结构", "Package structure", "sop/outputs-and-sites/knowledge-packages",
    [code("src/project/packageKnowledgeProjection.ts", 56), doc("manuals/reference/package-templates.md")]),
  scene("context", "知识包怎么直接给大模型读？", "How does a model read a package directly?", "llms.txt 与知识地图", "llms.txt and the knowledge map", "sop/outputs-and-sites/llm-docs",
    [code("src/project/packageLlms.ts", 11), doc("manuals/guides/package-outputs.md")]),
  scene("context", "会话里的结论能沉淀成知识吗？", "Can conclusions from a chat become knowledge?", "笔记与会话", "Notes and sessions", "sop/registering-sources/notes",
    [doc("manuals/guides/sessions.md", "session"), doc("manuals/guides/note.md", "note")]),
  scene("context", "代码仓库是怎么被抽取的？", "How is a code repository extracted?", "代码抽取", "Code extraction", "architecture/knowledge/code-extraction",
    [doc("manuals/reference/code-extractors.md"), code("src/project/indexerCodePageProjections.ts", 15)]),
  scene("context", "能为自己的框架写一个 Indexer 吗？", "Can I write an Indexer for my framework?", "自定义 Indexer", "Custom Indexers", "sop/custom-indexers/creating-an-indexer",
    [doc("manuals/guides/code-indexer-skill-authoring.md"), doc("manuals/guides/indexer-provider-and-customization.md")]),
  scene("context", "上百个来源怎么分批处理？", "How are hundreds of sources batched?", "来源批次", "Source batches", "sop/registering-sources/source-batches",
    [code("src/project/sourceBatchRegistration.ts", 155), doc("manuals/guides/source-batches.md")]),
  scene("context", "哪些文章必须先审核？", "Which articles must be reviewed first?", "必审文章", "Required reviews", "sop/planning-and-production/managed-mode-and-review-policy",
    [code("src/project/indexerRequiredArticleReview.ts", 17), doc("manuals/guides/workspace-commit.md")]),
  scene("context", "页面挪了位置，旧链接会断吗？", "Do old links break when a page moves?", "页面移动与引用", "Page moves and references", "sop/review-and-revision/reorganizing-at-scale",
    [code("src/project/approvedPageMove.ts", 7), code("src/project/approvedStructureEdges.ts", 134)]),
  scene("context", "这个版本和上个版本比改了什么？", "What changed since the last version?", "版本与 Changelog", "Versions and changelog", "sop/updates-and-versions/versions-and-changelog",
    [code("src/commands/versionCommands.ts", 10), doc("manuals/guides/knowledge-updates.md")]),
  scene("context", "怎么恢复到之前的知识版本？", "How do I restore an earlier knowledge version?", "版本恢复", "Version restore", "sop/updates-and-versions/versions-and-changelog",
    [doc("manuals/guides/workspace-restore.md"), doc("manuals/guides/workspace-prepare.md")]),

  scene("source", "远程搜索为什么能做到毫秒级？", "How is remote search this fast?", "Source Graph · 索引与检索", "Source Graph · indexing and search", "architecture/source-graph/pinned-search-and-reads",
    [sg("README.md", 14), sg("internal/service/scoped_search.go", 122)]),
  scene("source", "命令行能像 rg 一样搜远程仓库吗？", "Can a CLI search remote repos like rg?", "Source Graph · CLI", "Source Graph · CLI", "product/reference/source-graph/cli",
    [sg("cmd/sourcegraph-cli/main.go", 37), sg("web/assets/connect-page.js", 23)]),
  scene("source", "能只搜 *.go 文件吗？", "Can I search only *.go files?", "Source Graph · 搜索语法", "Source Graph · query syntax", "product/reference/source-graph/query-syntax",
    [sg("cmd/sourcegraph-cli/main.go", 37), sg("web/assets/search-model.mjs", 21)]),
  scene("source", "Agent 怎么读到固定版本的代码？", "How does an agent read a pinned commit?", "Source Graph · 固定版本读取", "Source Graph · pinned reads", "architecture/source-graph/pinned-search-and-reads",
    [code("src/project/evidencePlugin.ts", 54), sg("internal/service/scoped_search.go", 122)]),
  scene("source", "Source Graph 能接 MCP 吗？", "Does Source Graph speak MCP?", "Source Graph · MCP", "Source Graph · MCP", "sop/source-graph/connecting",
    [sg("docs/interfaces.md", 8), sg("README.md", 49)]),
  scene("source", "它提供哪些接口？", "Which interfaces does it offer?", "Source Graph · 接口", "Source Graph · interfaces", "product/reference/source-graph/http-and-mcp",
    [sg("docs/interfaces.md", 8), sg("docs/interfaces.md", 10)]),
  scene("source", "证据行号会随提交漂移吗？", "Do evidence line numbers drift between commits?", "版本锁定的证据", "Pinned evidence", "architecture/source-graph/evidence-for-context",
    [code("src/evidence/blockIdentity.ts", 15), code("src/project/documentEvidenceIndex.ts", 586)]),
  scene("source", "可以自己部署一套吗？", "Can I deploy my own?", "Source Graph · 部署", "Source Graph · deployment", "sop/source-graph/self-hosting",
    [sg("docs/deployment.md", 21), sg("DEVELOPMENT.md", 32)]),
  scene("source", "新仓库怎么接进来？", "How do I add a repository?", "Source Graph · 仓库登记", "Source Graph · repositories", "sop/source-graph/registering-repositories",
    [sg("web/repos.html", 19), sg("cmd/repo-service/main.go", 35)]),
  scene("source", "搜索太频繁会被限流吗？", "Is heavy searching rate limited?", "Source Graph · 限流", "Source Graph · rate limits", "sop/source-graph/operations",
    [sg("internal/httpserver/runtime.go", 215), sg("internal/mcpserver/recovery.go", 12)]),

  scene("agent", "Route 和 Gate 分别做什么？", "What do Routes and Gates do?", "Agent Graph · Route 与 Gate", "Agent Graph · Routes and Gates", "architecture/agent-graph/core-model",
    [wf("README.zh-CN.md", 13), wf("graphs/workspace.yaml")]),
  scene("agent", "每一步为什么这么走，能查到原因吗？", "Can I see why each step was chosen?", "Agent Graph · 路由原因", "Agent Graph · route reasons", "architecture/agent-graph/core-model",
    [wf("codes.yaml", 3), wf("README.zh-CN.md", 9)]),
  scene("agent", "工作流能不调模型就测试吗？", "Can a workflow be tested without a model?", "Agent Graph · 场景测试", "Agent Graph · scenario tests", "sop/agent-graph/testing-and-publishing",
    [wf("tests/complete.yaml"), wf("README.zh-CN.md", 40)]),
  scene("agent", "流程中断后从哪恢复？", "Where does an interrupted run resume?", "Agent Graph · Run 与恢复", "Agent Graph · runs and recovery", "architecture/agent-graph/runs-and-recovery",
    [wf("actions/inspect-task-recovery.yaml"), wf("README.zh-CN.md", 69)]),
  scene("agent", "过期的指令会被执行吗？", "Can a stale instruction still run?", "Agent Graph · Revision 校验", "Agent Graph · revision checks", "architecture/agent-graph/runs-and-recovery",
    [wf("README.zh-CN.md", 51)]),
  scene("agent", "Agent 做过的每一步能回看吗？", "Can I replay every step an agent took?", "Agent Graph · 运行事件", "Agent Graph · runtime events", "architecture/agent-graph/runs-and-recovery",
    [wf("actions/flush-runtime-events.yaml"), code("src/commands/runtimeEventLogs.ts", 19)]),
  scene("agent", "全托管运行会在哪里停下？", "Where does a fully managed run stop?", "Agent Graph · 全托管循环", "Agent Graph · managed loop", "sop/planning-and-production/managed-mode-and-review-policy",
    [wf("README.zh-CN.md", 77), wf("README.zh-CN.md", 86)]),
  scene("agent", "什么时候需要人来确认？", "When does a person need to confirm?", "人工关口", "Human gates", "sop/planning-and-production/managed-mode-and-review-policy",
    [code("src/project/indexerRequirementGateActions.ts", 20), doc("dialogue/human-gates.md")]),
  scene("agent", "做错了能回滚吗？", "Can a mistake be rolled back?", "Agent Graph · 回滚", "Agent Graph · rollback", "architecture/agent-graph/runs-and-recovery",
    [wf("actions/finish-rollback.yaml")]),
  scene("agent", "生产流程每一步怎么编排？", "How is each production step orchestrated?", "Agent Graph · 生产流程", "Agent Graph · production route", "architecture/context/workflow-execution",
    [code("src/project/productionWorkflowRoute.ts", 16), wf("graphs/indexer.yaml")]),
  scene("agent", "单个步骤的做法怎么持续优化？", "How does a single step keep improving?", "Agent Graph · 节点技能", "Agent Graph · step skills", "architecture/context/workflow-execution",
    [wf("actions/approve-production-report.yaml"), code("src/project/productionSkillCatalog.ts", 20)]),
];
