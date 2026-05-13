import { LayoutConfig } from "@/lib/templates/types";

interface Section { type: string; content: string; }

export function TechTemplate({ config, sections }: { config: LayoutConfig; sections: Section[] }) {
  const c = config.colors;
  return (
    <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: config.fonts.body }} className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {sections.map((section, i) => (
          <div key={i} style={{ backgroundColor: c.card, color: c.text }} className="rounded-lg p-6 mb-6 border border-slate-700">
            <h3 style={{ color: c.heading, fontFamily: config.fonts.heading }} className="text-lg font-bold mb-3">
              &gt; {getSectionLabel(config, section.type)}
            </h3>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function getSectionLabel(config: LayoutConfig, type: string): string {
  const section = config.sections.find((s) => s.type === type);
  return section?.label || type;
}
