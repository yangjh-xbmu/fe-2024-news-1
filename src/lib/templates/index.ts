import { TemplateDefinition } from "./types";
import { techTemplate } from "./tech";
import { designTemplate } from "./design";
import { academicTemplate } from "./academic";
import { dataTemplate } from "./data";
import { generalTemplate } from "./general";

const templates: Record<string, TemplateDefinition> = {
  tech: techTemplate,
  design: designTemplate,
  academic: academicTemplate,
  data: dataTemplate,
  general: generalTemplate,
};

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates[id];
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(templates);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return Object.values(templates).filter((t) => t.category === category);
}

export { templates };
export type { TemplateDefinition };
