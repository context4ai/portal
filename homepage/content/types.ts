export type Area = "context" | "source" | "agent";

export interface HomeContent {
  lang: "en-US" | "zh-CN";
  docs: string;
  meta: { title: string; description: string };
  header: { github: string; llms: string; theme: string; switchLabel: string; switchTitle: string; skip: string };
  slogan: string;
  entries: { area: Area; label: string; href: string; description: string; primary?: boolean }[];
  intro: { video: string; title: string; open: string; play: string; pause: string; seek: string; replay: string; back: string };
}
