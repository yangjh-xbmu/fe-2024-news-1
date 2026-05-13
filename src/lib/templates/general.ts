import { TemplateDefinition } from "./types";

export const generalTemplate: TemplateDefinition = {
  id: "general",
  name: "通用专业",
  category: "general",
  description: "安全百搭的简约卡片风格",
  previewImage: "/templates/general.png",
  layoutConfig: {
    name: "通用专业",
    category: "general",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "项目背景和目标" },
      { type: "process", label: "实施过程", placeholder: "做了什么、怎么做" },
      { type: "outcome", label: "成果展示", placeholder: "项目成果和收获" },
      { type: "reflection", label: "反思与收获", placeholder: "学到了什么" },
    ],
    colors: {
      bg: "#ffffff",
      text: "#0f172a",
      heading: "#0f172a",
      accent: "#3b82f6",
      card: "#f8fafc",
      muted: "#64748b",
    },
    fonts: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
    layout: "single-column",
  },
};
