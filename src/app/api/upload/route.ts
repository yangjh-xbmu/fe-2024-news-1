import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveFile } from "@/lib/storage";
import { extractTextWithMinerU, readTextFile, needsMinerU, SUPPORTED_TYPES } from "@/lib/mineru";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) return NextResponse.json({ error: "请上传文件" }, { status: 400 });
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `不支持的文件格式: ${file.type}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = saveFile(buffer, file.name);

    let parsedText = "";
    try {
      if (needsMinerU(file.type)) {
        parsedText = await extractTextWithMinerU(buffer, file.name);
      } else {
        parsedText = readTextFile(buffer);
      }
    } catch (err) {
      console.error("MinerU extraction failed:", err);
    }

    const upload = await db.upload.create({
      data: {
        projectId: projectId || "pending",
        filePath,
        fileType: file.type,
        parsedText,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: upload.id, parsedText, fileType: file.type, fileName: file.name },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
