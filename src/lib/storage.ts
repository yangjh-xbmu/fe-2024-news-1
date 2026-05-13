import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function saveFile(buffer: Buffer, fileName: string): string {
  ensureUploadDir();
  const uniqueName = `${Date.now()}-${fileName}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function readFileBuffer(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}
