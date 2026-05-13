import { TemplateDefinition } from "./types";

export const academicTemplate: TemplateDefinition = {
  id: "academic",
  name: "学术研究",
  category: "academic",
  description: "适合论文、调研报告，暖纸色书卷气",
  previewImage: "/templates/academic.png",
  layoutConfig: {
    name: "学术研究",
    category: "academic",
    sections: [
      { type: "abstract", label: "摘要", placeholder: "研究摘要" },
      { type: "background", label: "研究背景", placeholder: "研究问题和动机" },
      { type: "method", label: "研究方法", placeholder: "采用的研究方法" },
      { type: "findings", label: "研究发现", placeholder: "主要发现和结论" },
      { type: "references", label: "参考文献", placeholder: "引用格式" },
    ],
    colors: {
      bg: "#fefce8",
      text: "#713f12",
      heading: "#854d0e",
      accent: "#ca8a04",
      card: "#fef3c7",
      muted: "#a16207",
    },
    fonts: { heading: "Source Serif 4, serif", body: "Charter, serif" },
    layout: "single-column",
  },
};
