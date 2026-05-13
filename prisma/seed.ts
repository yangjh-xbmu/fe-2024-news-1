import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const templates = [
    {
      id: "tech",
      name: "技术项目",
      category: "tech",
      previewImage: "/templates/tech.png",
      layoutConfig: JSON.stringify({
        name: "技术项目", category: "tech",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "简要介绍项目背景和目标" },
          { type: "tech_stack", label: "技术栈", placeholder: "列出使用的技术和工具" },
          { type: "highlights", label: "核心亮点", placeholder: "代码架构、性能优化、创新点等" },
          { type: "challenges", label: "挑战与解决", placeholder: "遇到的技术难题和解决方案" },
          { type: "links", label: "相关链接", placeholder: "GitHub、演示地址等" },
        ],
        colors: { bg: "#0f172a", text: "#e2e8f0", heading: "#38bdf8", accent: "#38bdf8", card: "#1e293b", muted: "#94a3b8" },
        fonts: { heading: "JetBrains Mono, monospace", body: "Inter, sans-serif" },
        layout: "single-column",
      }),
    },
    {
      id: "design",
      name: "设计作品",
      category: "design",
      previewImage: "/templates/design.png",
      layoutConfig: JSON.stringify({
        name: "设计作品", category: "design",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "设计背景和需求" },
          { type: "gallery", label: "作品展示", placeholder: "上传设计稿图片" },
          { type: "process", label: "设计过程", placeholder: "从草图到成品的迭代过程" },
          { type: "outcome", label: "成果与影响", placeholder: "设计带来的效果和反馈" },
        ],
        colors: { bg: "#fafafa", text: "#18181b", heading: "#18181b", accent: "#a1a1aa", card: "#f4f4f5", muted: "#71717a" },
        fonts: { heading: "DM Sans, sans-serif", body: "Inter, sans-serif" },
        layout: "grid",
      }),
    },
    {
      id: "academic",
      name: "学术研究",
      category: "academic",
      previewImage: "/templates/academic.png",
      layoutConfig: JSON.stringify({
        name: "学术研究", category: "academic",
        sections: [
          { type: "abstract", label: "摘要", placeholder: "研究摘要" },
          { type: "background", label: "研究背景", placeholder: "研究问题和动机" },
          { type: "method", label: "研究方法", placeholder: "采用的研究方法" },
          { type: "findings", label: "研究发现", placeholder: "主要发现和结论" },
          { type: "references", label: "参考文献", placeholder: "引用格式" },
        ],
        colors: { bg: "#fefce8", text: "#713f12", heading: "#854d0e", accent: "#ca8a04", card: "#fef3c7", muted: "#a16207" },
        fonts: { heading: "Source Serif 4, serif", body: "Charter, serif" },
        layout: "single-column",
      }),
    },
    {
      id: "data",
      name: "数据分析",
      category: "data",
      previewImage: "/templates/data.png",
      layoutConfig: JSON.stringify({
        name: "数据分析", category: "data",
        sections: [
          { type: "overview", label: "分析概述", placeholder: "分析目标和数据来源" },
          { type: "methodology", label: "分析方法", placeholder: "使用的分析方法和工具" },
          { type: "insights", label: "关键洞察", placeholder: "数据揭示的核心发现" },
          { type: "visuals", label: "可视化展示", placeholder: "图表和数据展示" },
          { type: "recommendations", label: "建议与结论", placeholder: "基于数据的行动建议" },
        ],
        colors: { bg: "#ffffff", text: "#1e293b", heading: "#1e40af", accent: "#0891b2", card: "#f1f5f9", muted: "#64748b" },
        fonts: { heading: "IBM Plex Sans, sans-serif", body: "Inter, sans-serif" },
        layout: "two-column",
      }),
    },
    {
      id: "general",
      name: "通用专业",
      category: "general",
      previewImage: "/templates/general.png",
      layoutConfig: JSON.stringify({
        name: "通用专业", category: "general",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "项目背景和目标" },
          { type: "process", label: "实施过程", placeholder: "做了什么、怎么做" },
          { type: "outcome", label: "成果展示", placeholder: "项目成果和收获" },
          { type: "reflection", label: "反思与收获", placeholder: "学到了什么" },
        ],
        colors: { bg: "#ffffff", text: "#0f172a", heading: "#0f172a", accent: "#3b82f6", card: "#f8fafc", muted: "#64748b" },
        fonts: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
        layout: "single-column",
      }),
    },
  ];

  for (const t of templates) {
    await db.template.upsert({ where: { id: t.id }, update: t, create: t });
  }

  console.log("Seed complete: 5 templates inserted");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
