// Homepage copy for the Context docs site. Titles are plain statements without a closing period.
const LLMS_URL = "https://context4ai.org/context/llms.txt";
const PLUGIN_URL = "https://github.com/context4ai/context/tree/main/plugins/context";
const SKILLS_URL = `${PLUGIN_URL}/skills`;
// Each step names the community skill that carries it; "indexers" stands for the four source-type indexers.
export const skillHref = skill => (skill === "indexers" ? SKILLS_URL : `${SKILLS_URL}/${skill}/SKILL.md`);

const en = {
  hero: {
    title: "The enterprise knowledge workflow for engineering",
    deck: "Turn content from every source into an index and evidence chain for agents, bots and people",
    prompt: `Read ${LLMS_URL} and set up Context for this project.`,
    agentHint: "Copy a prompt that connects your coding agent through llms.txt",
    copied: "Prompt copied",
  },
  flow: {
    label: "Information from many sources condenses into a dome of knowledge; agents, bots and people ask it, and every answer is traced back to the original",
    users: ["Team bot", "Coding agent", "Developer"],
    requests: [
      { q: "@bot Add the new webhook runbook", a: "Reviewed · {n} new", lane: "production" },
      { q: "@bot Update from orders v2.4", a: "Reviewed · {n} revised", lane: "update" },
      { q: "@bot Learn from this week's incidents", a: "Reviewed · {n} new", lane: "production" },
    ],
    queries: [
      { by: 0, q: "@bot Retry after a 410?", a: "No. The endpoint is disabled", at: "retry.go:24" },
      { by: 1, q: "Where is refund called?", a: "The refund button on the order list", at: "list.tsx:41" },
      { by: 2, q: "How do I replay a delivery?", a: "From the console, by delivery ID", at: "Runbook §3" },
      { by: 0, q: "@bot Do failed deliveries alert?", a: "After 5 failures in a row", at: "alert.go:18" },
      { by: 1, q: "Where does order status change?", a: "All in OrderMachine", at: "machine.ts:57" },
      { by: 2, q: "How are webhook signatures checked?", a: "HMAC-SHA256 with the endpoint secret", at: "Runbook §5" },
    ],
  },
  flows: {
    title: "Install the Context skills, and your agent knows how to keep knowledge",
    deck: "Production, updates and retrieval are each carried by open skills",
    knowledge: "Knowledge",
    indexers: "Indexer skills",
    lanes: [
      { name: "Production", text: "Sources become traceable knowledge", before: [
        { name: "Plan", icon: "map", skill: "context-plan", tip: "Research the sources and split the writing work" },
        { name: "Capture", icon: "inbox", skill: "context", tip: "Bring code, documents, notes and sessions into the workspace" },
        { name: "Write", icon: "pen", skill: "indexers", tip: "Write articles with citations, per source type" },
        { name: "Review", icon: "check", skill: "context", tip: "Prepare a diff report for people to review" },
      ], after: [
        { name: "Build", icon: "package", skill: "context", tip: "Build the knowledge package and website" },
        { name: "Archive", icon: "archive", skill: "context", tip: "Record the version and changelog" },
      ] },
      { name: "Updates", text: "Only what a change touches is revised", before: [
        { name: "Assess", icon: "search", skill: "context-plan", tip: "Compare source versions and find the affected articles" },
        { name: "Revise", icon: "pen", skill: "indexers", tip: "Rewrite only the affected sections" },
        { name: "Review", icon: "check", skill: "context", tip: "Prepare a diff report for people to review" },
      ], after: [
        { name: "Publish", icon: "globe", skill: "context", tip: "Rebuild and publish" },
      ] },
      { name: "Retrieval", text: "Search the knowledge, then reason from the evidence", before: [
        { name: "Ask", icon: "session", skill: "context-inspect-search", tip: "Take the question" },
        { name: "Understand", icon: "lightbulb", skill: "context-inspect-search", tip: "Work out what knowledge the question needs" },
        { name: "Search", icon: "search", skill: "context-inspect-search", tip: "Search the knowledge for the relevant articles" },
      ], after: [
        { name: "Reason", icon: "code", skill: "context-inspect-search", tip: "Follow the evidence chain to the original at a fixed version and reason" },
        { name: "Answer", icon: "doc", skill: "context-inspect-search", tip: "Answer with sources attached" },
      ] },
    ],
  },

  arch: {
    title: "Build a knowledge service on any agent",
    deck: "Bring the Context workflow into the agents you already run and give them knowledge your team can rely on",
    entry: { name: "Entry", items: [{ icon: "bot", text: "Team bot", duplex: true }, { icon: "terminal", text: "Coding agent", duplex: true }, { icon: "refresh", text: "Scheduled job" }] },
    agent: { name: "Agent", runtime: "Your service agent", runtimes: ["Claude Code", "Codex", "Cursor", "Managed agent platform"], bot: "Bot prompt", plugin: "Context skill plugin", pluginHref: PLUGIN_URL, skills: [{ text: "Production", skill: "context" }, { text: "Updates", skill: "context-plan" }, { text: "Retrieval", skill: "context-inspect-search" }], tools: [{ icon: "code", text: "Remote search", href: "/sourcegraph/" }, { icon: "upload", text: "Publishing" }] },
    out: { name: "Outputs", items: [{ icon: "package", text: "Knowledge package" }, { icon: "globe", text: "Knowledge website" }, { icon: "doc", text: "Git workspace" }] },
  },
  results: {
    title: "On the same real questions: more accurate, faster, cheaper",
    deck: "Real developer questions from a large team and production monorepo, against a plain LLM Wiki setup with the code repositories",
    from: "LLM Wiki",
    to: "Context",
    cards: [
      { label: "Fully resolved", from: 19, to: 23, unit: "", change: "+16.7 points" },
      { label: "Mean time", from: 223.2, to: 93.2, unit: "s", decimals: 1, change: "58.2% faster" },
      { label: "Tool calls", from: 77.5, to: 7.8, unit: "", decimals: 1, change: "89.9% fewer" },
      { label: "Cost per question", from: 2.45, to: 0.27, prefix: "$", decimals: 2, change: "88.9% lower" },
    ],
    quality: {
      name: "More accurate: knowledge as an index",
      text: "Indexer skills extract content from every source and stack into a compact knowledge index, and record its evidence chain",
      extract: { title: "Indexers extract what matters", source: "orders/ · order service", indexer: "Indexer", out: "Knowledge: refund flow", rows: [
        { path: "api/routes.ts", text: "APIs and routes", keep: true },
        { path: "service/refund.ts", text: "Rules and call paths", keep: true },
        { path: "auth/policy.ts", text: "Permission checks", keep: true },
        { path: "config/flags.ts", text: "Flags and defaults", keep: true },
        { path: "gen/*.pb.ts", text: "Generated code" },
        { path: "styles/", text: "Styles" },
      ] },
      ratio: { title: "Compression", value: "1/115", from: { label: "Sources", size: "≈ 202 MB", detail: ["5.84M lines · 1,129 documents"] }, to: { label: "Knowledge", size: "≈ 1.75 MB", detail: ["220 reviewed articles"] } },
      chain: { title: "Evidence chain", article: "knowledge / refund flow", note: "Every claim records its source: file, lines and version", rows: [
        { text: "Refunds need a paid order within 30 days.", at: "service/refund.ts:42-58", rev: "@8f3c2a1" },
        { text: "Refunds over $500 need a manager's approval.", at: "auth/policy.ts:17-24", rev: "@8f3c2a1" },
        { text: "Merchants are notified of the result by webhook.", at: "Runbook §3", rev: "v2.4" },
      ] },
    },
    speed: {
      name: "Faster and cheaper: knowledge first, then the original remotely",
      text: "Knowledge gives the big picture fast; the evidence chain leads remotely to the original for precise reasoning",
      route: { title: "Two routes for one question", direct: "Knowledge is enough · answer directly", agent: "Agent sandbox · nothing cloned", service: "Source Graph remote search", ask: "Ask", knowledge: "Read knowledge", source: "Read original", answer: "Answer", stores: ["Knowledge repo", "Code repo @commit"], returns: ["Evidence chain"] },
      latency: { title: "Time per query", rows: [
        { name: "Local rg", min: 10, max: 740 },
        { name: "Local git grep", min: 9, max: 312 },
        { name: "Remote search", min: 0.9, max: 2.1, live: true },
      ], note: "Server side; under 100 ms including the round trip within the same data center" },
      facts: [
        { value: "Versions", label: "Several versions of a repository side by side, queried by commit" },
        { value: "Same hits", label: "Results match a local search" },
      ],
    },
  },
};

const zh = {
  hero: {
    title: "企业级研发知识工作流",
    deck: "把不同来源的内容整理为索引与证据链，交给 Agent、Bot 和团队使用",
    prompt: `阅读 ${LLMS_URL}，为当前项目接入 Context。`,
    agentHint: "复制提示词，让编码 Agent 通过 llms.txt 接入",
    copied: "已复制提示词",
  },
  flow: {
    label: "不同来源的信息逐渐沉淀为知识；Agent、Bot 和团队向它提问，每个回答都能追溯到原文",
    users: ["团队 Bot", "编码 Agent", "开发者"],
    requests: [
      { q: "@Bot 收录新版 Webhook 运维手册", a: "审核通过，新增 {n} 篇知识", lane: "production" },
      { q: "@Bot 按订单仓库 v2.4 更新知识", a: "审核通过，已更新 {n} 处知识", lane: "update" },
      { q: "@Bot 整理本周的排障记录", a: "审核通过，新增 {n} 篇知识", lane: "production" },
    ],
    queries: [
      { by: 0, q: "@Bot 410 后还重试吗？", a: "不再重试，并停用该端点", at: "retry.go:24" },
      { by: 1, q: "退款在哪里调用？", a: "订单列表页的退款按钮", at: "list.tsx:41" },
      { by: 2, q: "怎么重放一次投递？", a: "在控制台按投递 ID 重放", at: "运维手册 §3" },
      { by: 0, q: "@Bot 投递失败会告警吗？", a: "连续失败 5 次后告警", at: "alert.go:18" },
      { by: 1, q: "订单状态在哪里流转？", a: "统一由 OrderMachine 流转", at: "machine.ts:57" },
      { by: 2, q: "Webhook 签名怎么校验？", a: "用端点密钥做 HMAC-SHA256 校验", at: "运维手册 §5" },
    ],
  },
  flows: {
    title: "装上 Context 技能，Agent 就会维护知识",
    deck: "生产、更新、检索三条流程都由开放的技能完成",
    knowledge: "知识",
    indexers: "Indexer 技能",
    lanes: [
      { name: "生产", text: "把来源写成可追溯的知识", before: [
        { name: "规划", icon: "map", skill: "context-plan", tip: "调研来源，拆分写作任务" },
        { name: "采集", icon: "inbox", skill: "context", tip: "把代码、文档、笔记和会话收进工作区" },
        { name: "写作", icon: "pen", skill: "indexers", tip: "按来源类型写出带引用的文章" },
        { name: "审核", icon: "check", skill: "context", tip: "生成 Diff 报告，交给人审核" },
      ], after: [
        { name: "构建", icon: "package", skill: "context", tip: "构建知识包和知识网站" },
        { name: "归档", icon: "archive", skill: "context", tip: "记录版本与变更日志" },
      ] },
      { name: "更新", text: "只修订变化涉及的部分", before: [
        { name: "评估影响", icon: "search", skill: "context-plan", tip: "比对来源版本，找出受影响的文章" },
        { name: "修订", icon: "pen", skill: "indexers", tip: "只重写受影响的段落" },
        { name: "审核", icon: "check", skill: "context", tip: "生成 Diff 报告，交给人审核" },
      ], after: [
        { name: "发布", icon: "globe", skill: "context", tip: "重新构建并发布" },
      ] },
      { name: "检索", text: "检索知识，再沿证据推理作答", before: [
        { name: "提问", icon: "session", skill: "context-inspect-search", tip: "接收问题" },
        { name: "理解", icon: "lightbulb", skill: "context-inspect-search", tip: "理解问题，判断需要哪些知识" },
        { name: "检索", icon: "search", skill: "context-inspect-search", tip: "在知识中检索相关文章" },
      ], after: [
        { name: "推理", icon: "code", skill: "context-inspect-search", tip: "沿证据链读取固定版本的原文并推理" },
        { name: "作答", icon: "doc", skill: "context-inspect-search", tip: "附上出处作答" },
      ] },
    ],
  },

  arch: {
    title: "在任意 Agent 上搭建知识服务",
    deck: "引入 Context 工作流，增强已有 Agent 的知识能力，为团队助力",
    entry: { name: "入口", items: [{ icon: "bot", text: "团队 Bot", duplex: true }, { icon: "terminal", text: "编码 Agent", duplex: true }, { icon: "refresh", text: "定时任务" }] },
    agent: { name: "Agent", runtime: "你的服务 Agent", runtimes: ["Claude Code", "Codex", "Cursor", "托管 Agent 平台"], bot: "Bot 提示词", plugin: "Context 技能插件", pluginHref: PLUGIN_URL, skills: [{ text: "生产", skill: "context" }, { text: "更新", skill: "context-plan" }, { text: "检索", skill: "context-inspect-search" }], tools: [{ icon: "code", text: "远程检索", href: "/sourcegraph/" }, { icon: "upload", text: "知识发布" }] },
    out: { name: "知识出口", items: [{ icon: "package", text: "知识包" }, { icon: "globe", text: "知识网站" }, { icon: "doc", text: "Git 工作区" }] },
  },
  results: {
    title: "同一批真实问题，更准、更快、更省",
    deck: "大型团队和生产 Monorepo 的真实开发者问题，对照纯 LLM Wiki 方案 + 代码库方案",
    from: "LLM Wiki",
    to: "Context",
    cards: [
      { label: "完全解决", from: 19, to: 23, unit: "题", change: "+16.7 个百分点" },
      { label: "平均耗时", from: 223.2, to: 93.2, unit: "秒", decimals: 1, change: "缩短 58.2%" },
      { label: "平均工具调用", from: 77.5, to: 7.8, unit: "次", decimals: 1, change: "减少 89.9%" },
      { label: "每题成本", from: 2.45, to: 0.27, prefix: "$", decimals: 2, change: "降低 88.9%" },
    ],
    quality: {
      name: "更准：知识即索引",
      text: "通过 Indexer 技能，把不同来源、不同技术栈的内容抽取为高压缩的知识索引，并登记证据链",
      extract: { title: "Indexer 按需提取", source: "orders/ · 订单服务", indexer: "Indexer", out: "知识：退款流程", rows: [
        { path: "api/routes.ts", text: "接口与路由", keep: true },
        { path: "service/refund.ts", text: "业务规则与调用链", keep: true },
        { path: "auth/policy.ts", text: "权限判断", keep: true },
        { path: "config/flags.ts", text: "开关与默认值", keep: true },
        { path: "gen/*.pb.ts", text: "生成代码" },
        { path: "styles/", text: "样式" },
      ] },
      ratio: { title: "压缩率", value: "1/115", from: { label: "来源", size: "约 202 MB", detail: ["584 万行代码 · 1,129 份文档"] }, to: { label: "知识", size: "约 1.75 MB", detail: ["220 篇已审核文章"] } },
      chain: { title: "证据链", article: "knowledge / 退款流程", note: "每段结论都登记出处：文件、行号与版本", rows: [
        { text: "退款要求订单已支付且未超过 30 天。", at: "service/refund.ts:42-58", rev: "@8f3c2a1" },
        { text: "超过 500 元的退款需主管审批。", at: "auth/policy.ts:17-24", rev: "@8f3c2a1" },
        { text: "退款结果通过 Webhook 通知商户。", at: "运维手册 §3", rev: "v2.4" },
      ] },
    },
    speed: {
      name: "更快、更省：先读知识，再远程取原文",
      text: "通过知识快速了解全局，再沿证据链远程抵达原文，精确推理",
      route: { title: "一次问答的两种路径", direct: "知识足够，直接作答", agent: "Agent 沙箱 · 不克隆仓库", service: "Source Graph 远程检索", ask: "提问", knowledge: "读知识", source: "读原文", answer: "作答", stores: ["知识仓库", "代码仓库 @commit"], returns: ["证据链"] },
      latency: { title: "单次查询耗时", rows: [
        { name: "本地 rg", min: 10, max: 740 },
        { name: "本地 git grep", min: 9, max: 312 },
        { name: "远程检索", min: 0.9, max: 2.1, live: true },
      ], note: "服务端耗时；同机房含网络往返在 100 ms 以内" },
      facts: [
        { value: "多版本", label: "同一仓库多个版本并存，按 commit 直接查" },
        { value: "结果一致", label: "检出结果与本地搜索相同" },
      ],
    },
  },
};

export const content = { en, zh };
