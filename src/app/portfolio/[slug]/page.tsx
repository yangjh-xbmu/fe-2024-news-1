import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PortfolioRenderer } from "@/components/portfolio/renderer";
import { PrintButton } from "./print-button";

interface ProjectData {
  id: string; title: string; summary: string; content: string; templateId: string;
  tags: string; courseName: string; publishedAt: Date | null;
  user: { name: string | null; avatar: string | null; bio: string | null };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { slug, status: "published" },
    include: { user: { select: { name: true, avatar: true, bio: true } } },
  }) as ProjectData | null;

  if (!project) notFound();

  const sections = JSON.parse(project.content || "[]");
  const tags = JSON.parse(project.tags || "[]");

  return (
    <div>
      <PortfolioRenderer templateId={project.templateId || "general"} sections={sections} />
      <div className="max-w-3xl mx-auto px-6 py-8 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {project.user.name?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium">{project.user.name}</p>
            {project.user.bio && <p className="text-sm text-slate-500">{project.user.bio}</p>}
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-4">
            {tags.map((t: string) => <span key={t} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{t}</span>)}
          </div>
        )}
        {project.courseName && <p className="text-sm text-slate-400 mt-2">来源课程：{project.courseName}</p>}
        <div className="flex gap-2 mt-6">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
