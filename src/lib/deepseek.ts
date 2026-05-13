const DEEPSEEK_BASE = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一位专业的作品集顾问。学生会提交课程作业的内容，请分析并提取关键信息，用于生成求职作品集。

按以下 JSON 格式返回（不要包含 markdown 代码块标记）：

{
  "category": "tech" | "design" | "academic" | "data" | "general",
  "title": "建议的项目标题，15字以内",
  "summary": "项目概述，突出亮点和可迁移技能，150字以内",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "suggestedTemplate": "tech" | "design" | "academic" | "data" | "general",
  "skillsDemo": ["展示的技能1", "展示的技能2"],
  "sections": [
    { "type": "background", "content": "项目背景描述" },
    { "type": "objective", "content": "目标说明" },
    { "type": "process", "content": "实施过程" },
    { "type": "result", "content": "成果与收获" }
  ]
}

分析原则：
1. 识别作业所属的学科领域和作品集类别
2. 从作业中提取最能体现学生能力的亮点
3. summary 要面向雇主/面试官，突出可迁移技能
4. 如果作业内容不完整或识别不清，在 summary 中如实说明
5. 仅分析提供的文本，不推测未提及的内容`;

export interface AIAnalysis {
  category: "tech" | "design" | "academic" | "data" | "general";
  title: string;
  summary: string;
  keywords: string[];
  suggestedTemplate: string;
  skillsDemo: string[];
  sections: { type: string; content: string }[];
}

export async function analyzeWithDeepSeek(text: string): Promise<AIAnalysis> {
  const apiKey = process.env["ds-api-key"];
  if (!apiKey) throw new Error("ds-api-key not found in .env");

  const truncated = text.slice(0, 4000);

  const res = await fetch(DEEPSEEK_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `请分析以下课程作业内容，提取作品集所需信息：\n\n${truncated}` },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`DeepSeek API error: ${JSON.stringify(data)}`);

  const content: string = data.choices[0].message.content;
  const jsonStr = content.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(jsonStr) as AIAnalysis;
}
