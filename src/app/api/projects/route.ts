import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { template: { select: { name: true, category: true } } },
  });

  return NextResponse.json({ data: projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { title, content, templateId, tags, courseName } = await req.json();

  const project = await db.project.create({
    data: {
      userId,
      title: title || "未命名项目",
      content: content || "{}",
      templateId,
      tags: JSON.stringify(tags || []),
      courseName: courseName || "",
      slug: generateSlug(),
    },
  });

  return NextResponse.json({ data: project }, { status: 201 });
}
