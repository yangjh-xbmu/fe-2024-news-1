import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeWithDeepSeek } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const { text } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "请提供文本内容" }, { status: 400 });
    }

    let analysis;
    try {
      analysis = await analyzeWithDeepSeek(text);
    } catch (err) {
      console.error("DeepSeek analysis failed:", err);
      analysis = {
        category: "general",
        title: "",
        summary: "",
        keywords: [],
        suggestedTemplate: "general",
        skillsDemo: [],
        sections: [
          { type: "background", content: "" },
          { type: "objective", content: "" },
          { type: "process", content: "" },
          { type: "result", content: "" },
        ],
      };
    }

    return NextResponse.json({ success: true, data: analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "分析失败" }, { status: 500 });
  }
}
