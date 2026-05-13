import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">课程作业 → 专业作品集</h1>
      <p className="text-lg text-slate-500 max-w-md mb-8">上传你的课程作业，AI 自动分析并匹配专业模板。五分钟生成面试官想看的高质量作品集。</p>
      <div className="flex gap-3">
        <Link href="/register"><Button size="lg">免费开始</Button></Link>
        <Link href="/login"><Button variant="outline" size="lg">登录</Button></Link>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl text-sm text-slate-400">
        <div><div className="text-2xl mb-1">📤</div>上传作业</div>
        <div><div className="text-2xl mb-1">🤖</div>AI 分析</div>
        <div><div className="text-2xl mb-1">✨</div>一键生成</div>
      </div>
    </div>
  );
}
