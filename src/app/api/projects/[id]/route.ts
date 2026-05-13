import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const project = await db.project.findFirst({
    where: { id, userId },
    include: { uploads: true, template: true },
  });

  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  return NextResponse.json({ data: project });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.summary !== undefined) data.summary = body.summary;
  if (body.content !== undefined) data.content = typeof body.content === "string" ? body.content : JSON.stringify(body.content);
  if (body.templateId !== undefined) data.templateId = body.templateId;
  if (body.status !== undefined) data.status = body.status;
  if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
  if (body.courseName !== undefined) data.courseName = body.courseName;
  if (body.status === "published" && existing.status !== "published") {
    data.publishedAt = new Date();
  }

  const project = await db.project.update({ where: { id }, data });
  return NextResponse.json({ data: project });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  await db.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
