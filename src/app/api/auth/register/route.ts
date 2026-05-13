import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "邮箱和密码（至少6位）为必填" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { name, email, passwordHash },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
