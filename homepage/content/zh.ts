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
    { area: "agent", label: "Agent Graph", href: "/context/pages/9fb722d61652eb09bd4609cb38748ba5.html", description: "让 Agent 按稳定的工作流运行：具备充足知识技能，保证多次任务结果一致" },
  ],
  intro: {
    video: "https://github.com/context4ai/portal/releases/download/intro-video-2026-10-15/context4ai-v2-with-music.mp4",
    title: "4 分钟了解 Context for AI",
    open: "播放介绍视频：",
    play: "播放",
    pause: "暂停",
    seek: "播放进度",
    replay: "重播",
    back: "返回",
  },
};

export default content;
