import { TemplateDefinition } from "./types";

export const techTemplate: TemplateDefinition = {
  id: "tech",
  name: "技术项目",
  category: "tech",
  description: "适合代码项目、技术文档，暗色 IDE 风格",
  previewImage: "/templates/tech.png",
  layoutConfig: {
    name: "技术项目",
    category: "tech",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "简要介绍项目背景和目标" },
      { type: "tech_stack", label: "技术栈", placeholder: "列出使用的技术和工具" },
      { type: "highlights", label: "核心亮点", placeholder: "代码架构、性能优化、创新点等" },
      { type: "challenges", label: "挑战与解决", placeholder: "遇到的技术难题和解决方案" },
      { type: "links", label: "相关链接", placeholder: "GitHub、演示地址等" },
    ],
    colors: {
      bg: "#0f172a",
      text: "#e2e8f0",
      heading: "#38bdf8",
      accent: "#38bdf8",
      card: "#1e293b",
      muted: "#94a3b8",
    },
    fonts: { heading: "JetBrains Mono, monospace", body: "Inter, sans-serif" },
    layout: "single-column",
  },
};
