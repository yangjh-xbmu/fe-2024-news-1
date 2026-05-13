export interface TemplateSection {
  type: string;
  label: string;
  placeholder: string;
  optional?: boolean;
}

export interface LayoutConfig {
  name: string;
  category: "tech" | "design" | "academic" | "data" | "general";
  sections: TemplateSection[];
  colors: {
    bg: string;
    text: string;
    heading: string;
    accent: string;
    card: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: "single-column" | "two-column" | "grid";
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: "tech" | "design" | "academic" | "data" | "general";
  description: string;
  previewImage: string;
  layoutConfig: LayoutConfig;
}
