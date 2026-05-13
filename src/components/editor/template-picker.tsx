"use client";

import { getAllTemplates, TemplateDefinition } from "@/lib/templates";
import { Card } from "@/components/ui/card";

export function TemplatePicker({ suggested, selected, onSelect }: { suggested: string; selected: string; onSelect: (id: string) => void }) {
  const templates = getAllTemplates();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {templates.map((t) => (
        <Card
          key={t.id}
          className={`p-4 cursor-pointer border-2 transition-colors text-center ${selected === t.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-400"} ${t.id === suggested ? "ring-2 ring-indigo-300" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <div className="w-full h-20 bg-slate-100 rounded mb-2 flex items-center justify-center text-xs text-slate-400">
            {t.name}
          </div>
          <p className="font-medium text-sm">{t.name}</p>
          <p className="text-xs text-slate-500 mt-1">{t.description}</p>
          {t.id === suggested && <span className="text-xs text-indigo-500 mt-1 block">AI 推荐</span>}
        </Card>
      ))}
    </div>
  );
}
