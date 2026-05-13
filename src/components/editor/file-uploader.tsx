"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FileUploader({ projectId, onComplete }: { projectId: string; onComplete: (data: { parsedText: string; fileName: string }) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);
    if (json.success) onComplete({ parsedText: json.data.parsedText, fileName: json.data.fileName });
    else alert(json.error);
  }, [projectId, onComplete]);

  return (
    <Card
      className={`p-8 border-2 border-dashed text-center cursor-pointer transition-colors ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300"}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) uploadFile(file); }}
    >
      <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif,.bmp,.txt,.md" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(file); }} />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-slate-600 mb-2">{uploading ? "正在提取文本..." : "拖拽文件到此处，或点击上传"}</p>
        <p className="text-xs text-slate-400">支持 PDF、DOCX、PPT、图片、Markdown、纯文本</p>
      </label>
      {uploading && <p className="text-sm text-indigo-500 mt-4">MinerU 正在解析文档，可能需要 1-2 分钟...</p>}
    </Card>
  );
}
