import type { HomeContent } from "./types";

const content: HomeContent = {
  lang: "en-US",
  docs: "/context/",
  meta: {
    title: "Context for AI: rebuilding software engineering context for agents",
    description: "Context turns code, documents and conversations into sourced knowledge that evolves with every iteration; Source Graph searches remote repositories in milliseconds; Agent Graph keeps AI on stable workflows.",
  },
  header: { github: "GitHub", llms: "LLMs", theme: "Toggle theme", switchLabel: "中文", switchTitle: "切换到中文", skip: "Skip to content" },
  slogan: "Building software engineering context for agents",
  entries: [
    { area: "context", label: "Context", href: "/context/", primary: true, description: "An enterprise knowledge workflow: code, documents and conversations become sourced knowledge that evolves with every iteration" },
    { area: "source", label: "Source Graph", href: "/sourcegraph/", description: "Millisecond remote code search: as fast as a local rg or grep, search and read code at any specified version" },
    { area: "agent", label: "Agent Graph", href: "/context/pages/9fb722d61652eb09bd4609cb38748ba5.html", description: "Keep Agents on stable workflows: the knowledge and skills each step needs, consistent results across runs" },
  ],
};

export default content;
