import type { HomeContent } from "./types";

const content: HomeContent = {
  lang: "zh-CN",
  docs: "/context/",
  meta: {
    title: "Context for AI：为智能体构建软件工程的上下文",
    description: "Context 把代码、文档与会话沉淀为有出处、随迭代演进的知识；Source Graph 提供毫秒级的远程代码检索；Agent Graph 让 AI 按稳定的工作流运行。",
  },
  header: { github: "GitHub", llms: "LLMs", theme: "切换主题", switchLabel: "EN", switchTitle: "Switch to English", skip: "跳到正文" },
  slogan: "为智能体构建软件工程的上下文",
  entries: [
    { area: "context", label: "Context", href: "/context/", primary: true, description: "企业级研发知识工作流：把代码、文档与会话沉淀为有出处、随迭代演进的知识" },
    { area: "source", label: "Source Graph", href: "/sourcegraph/", description: "毫秒级的远程仓库检索：像本地 rg、grep 一样快，指定版本搜索和阅读代码" },
    { area: "agent", label: "Agent Graph", href: "/context/pages/91e2679fb8eb437a1a32a70050351382.html", description: "让 AI 按稳定的工作流运行：过程可观测、可测试，驱动工作流优化迭代" },
  ],
};

export default content;
