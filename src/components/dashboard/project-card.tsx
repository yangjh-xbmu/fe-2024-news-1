"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectData {
  id: string;
  title: string;
  summary: string;
  status: string;
  slug: string;
  updatedAt: string;
  template?: { name: string; category: string } | null;
}

export function ProjectCard({ project, onDelete }: { project: ProjectData; onDelete: (id: string) => void }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => router.push(`/editor/${project.id}`)}>
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.summary || "暂无摘要"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded ${project.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {project.status === "published" ? "已发布" : "草稿"}
              </span>
              {project.template && <span className="text-xs text-slate-400">{project.template.name}</span>}
            </div>
          </div>
          {project.status === "published" && (
            <Button variant="ghost" size="sm" onClick={() => window.open(`/portfolio/${project.slug}`, "_blank")}>查看</Button>
          )}
        </div>
        <div className="flex gap-1 mt-3 text-xs text-slate-400">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/editor/${project.id}`)}>编辑</Button>
          <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portfolio/${project.slug}`); }}>复制链接</Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(project.id)}>删除</Button>
        </div>
      </CardContent>
    </Card>
  );
}
