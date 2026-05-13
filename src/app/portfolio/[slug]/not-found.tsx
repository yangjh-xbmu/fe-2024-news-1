export default function NotFound() {
  return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold">作品未找到</h1>
    <p className="text-slate-500">该作品可能已被删除或尚未发布</p>
  </div>;
}
