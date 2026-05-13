import { getTemplate } from "@/lib/templates";

interface Section { type: string; content: string; }

export function PortfolioRenderer({ templateId, sections }: { templateId: string; sections: Section[] }) {
  const template = getTemplate(templateId);
  if (!template) return <p className="p-8 text-center text-slate-500">模板未找到</p>;

  return <GenericRenderer config={template.layoutConfig} sections={sections} />;
}

function GenericRenderer({ config, sections }: { config: any; sections: Section[] }) {
  const c = config.colors;
  return (
    <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: config.fonts.body }} className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {sections.map((section, i) => (
          <div key={i}>
            <h3 style={{ color: c.heading, fontFamily: config.fonts.heading }} className="text-xl font-bold mb-3">
              {config.sections.find((s: any) => s.type === section.type)?.label || section.type}
            </h3>
            <div style={{ color: c.text }} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}
