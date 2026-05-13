"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";

interface ProjectData {
  id: string; title: string; summary: string; status: string; slug: string;
  updatedAt: string; template?: { name: string; category: string } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => { setProjects(json.data || []); setLoading(false); });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的项目</h1>
        <Button onClick={() => router.push("/editor/new")}>新建作品集</Button>
      </div>
      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">还没有作品集</p>
          <Button onClick={() => router.push("/editor/new")}>创建第一个</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
