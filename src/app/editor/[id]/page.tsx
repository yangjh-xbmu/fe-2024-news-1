"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/editor/file-uploader";
import { TemplatePicker } from "@/components/editor/template-picker";
import { PortfolioRenderer } from "@/components/portfolio/renderer";
import { AIAnalysis } from "@/lib/deepseek";
import { getTemplate } from "@/lib/templates";

type Section = { type: string; content: string };

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState("general");
  const [suggestedTemplate, setSuggestedTemplate] = useState("general");
  const [sections, setSections] = useState<Section[]>([]);
  const [parsedText, setParsedText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (id === "new") { setLoading(false); return; }
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setTitle(json.data.title);
          setSummary(json.data.summary);
          setKeywords(JSON.parse(json.data.tags || "[]"));
          setTemplateId(json.data.templateId || "general");
          setSections(JSON.parse(json.data.content || "[]"));
        }
        setLoading(false);
      });
  }, [id]);

  async function handleAnalyze() {
    if (!parsedText) return;
    setAnalyzing(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: parsedText }),
    });
    const json = await res.json();
    setAnalyzing(false);
    if (json.success) {
      const analysis: AIAnalysis = json.data;
      setTitle(analysis.title || title);
      setSummary(analysis.summary || summary);
      setKeywords(analysis.keywords || []);
      setSuggestedTemplate(analysis.suggestedTemplate);
      setTemplateId(analysis.suggestedTemplate);
      setSections(analysis.sections.map((s) => ({ type: s.type, content: s.content })));
    }
  }

  async function handleSave(status: "draft" | "published") {
    setSaving(true);
    const body = {
      title,
      summary,
      content: JSON.stringify(sections),
      templateId,
      tags: keywords,
      status,
    };
    const method = id === "new" ? "POST" : "PATCH";
    const url = id === "new" ? "/api/projects" : `/api/projects/${id}`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setSaving(false);
    if (json.data) {
      if (id === "new") router.push(`/editor/${json.data.id}`);
      else if (status === "published") router.push("/dashboard");
    } else {
      alert(json.error || "保存失败");
    }
  }

  function updateSection(index: number, content: string) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, content } : s)));
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>;

  const template = getTemplate(templateId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="项目标题" className="text-2xl font-bold border-0 border-b rounded-none px-0 max-w-lg bg-transparent focus-visible:ring-0" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>保存草稿</Button>
            <Button onClick={() => handleSave("published")} disabled={saving}>发布</Button>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList>
            <TabsTrigger value="upload">1. 上传作业</TabsTrigger>
            <TabsTrigger value="analyze">2. AI 分析</TabsTrigger>
            <TabsTrigger value="template">3. 选择模板</TabsTrigger>
            <TabsTrigger value="edit">4. 编辑内容</TabsTrigger>
            <TabsTrigger value="preview">5. 预览</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <FileUploader projectId={id} onComplete={(data) => setParsedText(data.parsedText)} />
            {parsedText && <p className="text-sm text-green-600 mt-2">文本提取成功，共 {parsedText.length} 字</p>}
            {parsedText && !parsedText.length && <p className="text-sm text-amber-600 mt-2">未能自动提取文本，请在下方手动粘贴</p>}
            <Textarea value={parsedText} onChange={(e) => setParsedText(e.target.value)} placeholder="或直接粘贴作业文本..." className="mt-4 h-40" />
          </TabsContent>

          <TabsContent value="analyze" className="mt-4">
            <Button onClick={handleAnalyze} disabled={!parsedText || analyzing}>
              {analyzing ? "AI 分析中..." : "开始分析"}
            </Button>
            {title && (
              <div className="mt-4 space-y-3">
                <div><Label>摘要</Label><p className="text-sm text-slate-600">{summary}</p></div>
                <div><Label>关键词</Label><div className="flex gap-1 flex-wrap">{keywords.map((k) => <span key={k} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{k}</span>)}</div></div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="template" className="mt-4">
            <TemplatePicker suggested={suggestedTemplate} selected={templateId} onSelect={setTemplateId} />
          </TabsContent>

          <TabsContent value="edit" className="mt-4 space-y-6">
            <div><Label>摘要</Label><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="h-20" /></div>
            <div><Label>关键词（逗号分隔）</Label><Input value={keywords.join(",")} onChange={(e) => setKeywords(e.target.value.split(",").filter(Boolean))} /></div>
            {template?.layoutConfig.sections.map((sec, i) => (
              <div key={sec.type}>
                <Label>{sec.label}</Label>
                <Textarea
                  value={sections.find((s) => s.type === sec.type)?.content || ""}
                  onChange={(e) => updateSection(sections.findIndex((s) => s.type === sec.type), e.target.value)}
                  placeholder={sec.placeholder}
                  className="h-32"
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <PortfolioRenderer templateId={templateId} sections={sections} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
