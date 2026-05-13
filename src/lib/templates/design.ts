import { TemplateDefinition } from "./types";

export const designTemplate: TemplateDefinition = {
  id: "design",
  name: "设计作品",
  category: "design",
  description: "适合 UI 设计、海报、视觉作品，极简留白",
  previewImage: "/templates/design.png",
  layoutConfig: {
    name: "设计作品",
    category: "design",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "设计背景和需求" },
      { type: "gallery", label: "作品展示", placeholder: "上传设计稿图片" },
      { type: "process", label: "设计过程", placeholder: "从草图到成品的迭代过程" },
      { type: "outcome", label: "成果与影响", placeholder: "设计带来的效果和反馈" },
    ],
    colors: {
      bg: "#fafafa",
      text: "#18181b",
      heading: "#18181b",
      accent: "#a1a1aa",
      card: "#f4f4f5",
      muted: "#71717a",
    },
    fonts: { heading: "DM Sans, sans-serif", body: "Inter, sans-serif" },
    layout: "grid",
  },
};
