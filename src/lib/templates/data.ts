import { TemplateDefinition } from "./types";

export const dataTemplate: TemplateDefinition = {
  id: "data",
  name: "数据分析",
  category: "data",
  description: "适合数据报告、可视化项目，蓝绿理性",
  previewImage: "/templates/data.png",
  layoutConfig: {
    name: "数据分析",
    category: "data",
    sections: [
      { type: "overview", label: "分析概述", placeholder: "分析目标和数据来源" },
      { type: "methodology", label: "分析方法", placeholder: "使用的分析方法和工具" },
      { type: "insights", label: "关键洞察", placeholder: "数据揭示的核心发现" },
      { type: "visuals", label: "可视化展示", placeholder: "图表和数据展示" },
      { type: "recommendations", label: "建议与结论", placeholder: "基于数据的行动建议" },
    ],
    colors: {
      bg: "#ffffff",
      text: "#1e293b",
      heading: "#1e40af",
      accent: "#0891b2",
      card: "#f1f5f9",
      muted: "#64748b",
    },
    fonts: { heading: "IBM Plex Sans, sans-serif", body: "Inter, sans-serif" },
    layout: "two-column",
  },
};
