import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatePDF } from "@/lib/pdf";
import { getTemplate } from "@/lib/templates";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const project = await db.project.findFirst({ where: { id, userId } });
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  const template = getTemplate(project.templateId || "general");
  if (!template) return NextResponse.json({ error: "模板未找到" }, { status: 500 });

  const sections = JSON.parse(project.content || "[]");
  const c = template.layoutConfig.colors;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: ${template.layoutConfig.fonts.body}; color: ${c.text}; background: ${c.bg}; margin: 0; padding: 40px; }
  h1 { font-family: ${template.layoutConfig.fonts.heading}; color: ${c.heading}; }
  h3 { font-family: ${template.layoutConfig.fonts.heading}; color: ${c.heading}; }
  .card { background: ${c.card}; padding: 20px; margin-bottom: 16px; border-radius: 8px; }
  .muted { color: ${c.muted}; }
</style></head>
<body>
  <h1>${project.title}</h1>
  <p class="muted">${project.summary}</p>
  ${sections.map((s: { type: string; content: string }) => `
    <div class="card">
      <h3>${template.layoutConfig.sections.find((sec) => sec.type === s.type)?.label || s.type}</h3>
      <div>${s.content}</div>
    </div>
  `).join("")}
</body>
</html>`;

  try {
    const pdfBuffer = await generatePDF(html);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${project.slug}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF 生成失败" }, { status: 500 });
  }
}
