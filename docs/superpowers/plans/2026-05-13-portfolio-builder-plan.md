# 课程作业转作品集 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 Web 应用，让学生上传课程作业，通过 MinerU + DeepSeek 自动提取分析，选择模板生成专业作品集页面和 PDF。

**Architecture:** Next.js 14 App Router 全栈应用，Prisma ORM + SQLite，Auth.js 认证，shadcn/ui 做应用 UI，纯 Tailwind 做作品集展示模板。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma, SQLite, Auth.js v5, Puppeteer, MinerU API, DeepSeek API

---

### Task 1: 项目初始化

**Files:**
- Run: `npx create-next-app`

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd "C:/Users/yangjh/Desktop/repos/2024news-1"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

- [ ] **Step 2: 安装核心依赖**

```bash
npm install prisma @prisma/client @auth/prisma-adapter next-auth@beta zod
npm install -D @types/node
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-tabs @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react
```

- [ ] **Step 3: 初始化 Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 4: 初始化 shadcn/ui**

```bash
npx shadcn@latest init

# 选择: TypeScript, Tailwind v4, src/ styles, src/lib/utils, CSS variables, slate base
```

- [ ] **Step 5: 添加 shadcn/ui 组件**

```bash
npx shadcn@latest add button input label card dialog dropdown-menu separator tabs toast textarea form avatar
```

- [ ] **Step 6: 在 `src/app/globals.css` 添加字体和基础样式**

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --color-primary: #6366f1;
  --color-primary-foreground: #ffffff;
}

body {
  @apply bg-slate-50 text-slate-900 antialiased;
}
```

- [ ] **Step 7: 修改 `src/app/layout.tsx`，引入 Inter 字体**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "作品集生成器",
  description: "将课程作业转化为专业求职作品集",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: 提交**

```bash
git add -A && git commit -m "chore: init Next.js project with Tailwind, Prisma, shadcn/ui"
```

---

### Task 2: 数据库 Schema

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

- [ ] **Step 1: 编写 Prisma Schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  name         String?
  email        String    @unique
  passwordHash String
  avatar       String?
  bio          String?
  skills       String    @default("[]") // JSON array
  contactInfo  String    @default("{}") // JSON object
  createdAt    DateTime  @default(now())
  projects     Project[]
  accounts     Account[]
  sessions     Session[]
}

model Project {
  id          String    @id @default(cuid())
  userId      String
  title       String
  summary     String    @default("")
  content     String    @default("{}") // JSON: section-based content
  templateId  String?
  status      String    @default("draft") // draft | published
  tags        String    @default("[]") // JSON array
  courseName  String    @default("")
  slug        String    @unique
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  uploads     Upload[]
  template    Template? @relation(fields: [templateId], references: [id])
}

model Upload {
  id         String   @id @default(cuid())
  projectId  String
  filePath   String
  fileType   String
  parsedText String   @default("")
  aiMetadata String   @default("{}") // JSON
  createdAt  DateTime @default(now())
  project    Project  @relation(fields: [projectId], references: [id])
}

model Template {
  id           String    @id @default(cuid())
  name         String    @unique
  category     String    // tech | design | academic | data | general
  previewImage String?
  layoutConfig String    // JSON
  isActive     Boolean   @default(true)
  projects     Project[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 2: 创建 Prisma 客户端单例 `src/lib/db.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 3: 运行迁移**

```bash
npx prisma db push
```

- [ ] **Step 4: 提交**

```bash
git add prisma/schema.prisma src/lib/db.ts && git commit -m "feat: add Prisma schema with User, Project, Upload, Template models"
```

---

### Task 3: 认证系统

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/middleware.ts`
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: 创建 Auth.js 配置 `src/lib/auth.ts`**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id: string }).id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: 创建 API 路由 `src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

- [ ] **Step 3: 创建中间件 `src/middleware.ts`**

```typescript
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/api/projects/:path*"],
};
```

- [ ] **Step 4: 创建认证布局 `src/app/(auth)/layout.tsx`**

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
```

- [ ] **Step 5: 创建登录页 `src/app/(auth)/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) setError("邮箱或密码错误");
    else router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>登录</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">登录</Button>
          <Button type="button" variant="link" onClick={() => router.push("/register")}>没有账号？注册</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
```

- [ ] **Step 6: 创建注册页 `src/app/(auth)/register/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "注册失败");
      return;
    }
    router.push("/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>注册</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">注册</Button>
          <Button type="button" variant="link" onClick={() => router.push("/login")}>已有账号？登录</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
```

- [ ] **Step 7: 创建注册 API `src/app/api/auth/register/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "邮箱和密码（至少6位）为必填" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { name, email, passwordHash },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
```

- [ ] **Step 8: 安装 bcryptjs 类型**

```bash
npm install bcryptjs && npm install -D @types/bcryptjs
```

- [ ] **Step 9: 提交**

```bash
git add -A && git commit -m "feat: add auth system with login, register, and middleware"
```

---

### Task 4: MinerU 文本提取模块

**Files:**
- Create: `src/lib/mineru.ts`

- [ ] **Step 1: 创建 MinerU 模块**

```typescript
const MINERU_BASE = "https://mineru.net/api/v1";

function getApiKey(): string {
  const key = process.env["mineru-api-key"];
  if (!key) throw new Error("mineru-api-key not found in .env");
  return key;
}

interface MinerUInitResponse {
  code: number;
  msg: string;
  data: { task_id: string; file_url: string };
}

interface MinerUPollResponse {
  data: { state: string; markdown_url?: string; err_msg?: string };
}

export async function extractTextWithMinerU(
  fileBuffer: Buffer,
  fileName: string,
  language = "ch"
): Promise<string> {
  // Step 1: Init — get task_id and OSS upload URL
  const initRes = await fetch(`${MINERU_BASE}/agent/parse/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ file_name: fileName, language }),
  });
  const initData: MinerUInitResponse = await initRes.json();
  if (initData.code !== 0) throw new Error(`MinerU init error: ${initData.msg}`);

  const { task_id, file_url } = initData.data;

  // Step 2: Upload file to OSS
  await fetch(file_url, { method: "PUT", body: fileBuffer });

  // Step 3: Poll for result
  for (let i = 0; i < 60; i++) {
    const pollRes = await fetch(`${MINERU_BASE}/agent/parse/${task_id}`, {
      headers: { Authorization: `Bearer ${getApiKey()}` },
    });
    const pollData: MinerUPollResponse = await pollRes.json();
    if (pollData.data.state === "done") {
      const mdRes = await fetch(pollData.data.markdown_url!);
      return await mdRes.text();
    }
    if (pollData.data.state === "failed") {
      throw new Error(`MinerU parse failed: ${pollData.data.err_msg}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("MinerU timeout after 2 minutes");
}

/** 直接读取文本文件，跳过 MinerU */
export function readTextFile(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/** 判断文件是否需要 MinerU 处理 */
export function needsMinerU(mimeType: string): boolean {
  const mineruTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/bmp",
  ];
  return mineruTypes.includes(mimeType);
}

/** 支持的文件类型列表（包括不需要 MinerU 的） */
export const SUPPORTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
];
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/mineru.ts && git commit -m "feat: add MinerU text extraction module"
```

---

### Task 5: DeepSeek 分析模块

**Files:**
- Create: `src/lib/deepseek.ts`

- [ ] **Step 1: 创建 DeepSeek 模块**

```typescript
const DEEPSEEK_BASE = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一位专业的作品集顾问。学生会提交课程作业的内容，请分析并提取关键信息，用于生成求职作品集。

按以下 JSON 格式返回（不要包含 markdown 代码块标记）：

{
  "category": "tech" | "design" | "academic" | "data" | "general",
  "title": "建议的项目标题，15字以内",
  "summary": "项目概述，突出亮点和可迁移技能，150字以内",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "suggestedTemplate": "tech" | "design" | "academic" | "data" | "general",
  "skillsDemo": ["展示的技能1", "展示的技能2"],
  "sections": [
    { "type": "background", "content": "项目背景描述" },
    { "type": "objective", "content": "目标说明" },
    { "type": "process", "content": "实施过程" },
    { "type": "result", "content": "成果与收获" }
  ]
}

分析原则：
1. 识别作业所属的学科领域和作品集类别
2. 从作业中提取最能体现学生能力的亮点
3. summary 要面向雇主/面试官，突出可迁移技能
4. 如果作业内容不完整或识别不清，在 summary 中如实说明
5. 仅分析提供的文本，不推测未提及的内容`;

export interface AIAnalysis {
  category: "tech" | "design" | "academic" | "data" | "general";
  title: string;
  summary: string;
  keywords: string[];
  suggestedTemplate: string;
  skillsDemo: string[];
  sections: { type: string; content: string }[];
}

export async function analyzeWithDeepSeek(text: string): Promise<AIAnalysis> {
  const apiKey = process.env["ds-api-key"];
  if (!apiKey) throw new Error("ds-api-key not found in .env");

  const truncated = text.slice(0, 4000);

  const res = await fetch(DEEPSEEK_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `请分析以下课程作业内容，提取作品集所需信息：\n\n${truncated}` },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`DeepSeek API error: ${JSON.stringify(data)}`);

  const content: string = data.choices[0].message.content;
  const jsonStr = content.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(jsonStr) as AIAnalysis;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/deepseek.ts && git commit -m "feat: add DeepSeek analysis module"
```

---

### Task 6: 文件上传 API

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: 创建存储抽象层 `src/lib/storage.ts`**

```typescript
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function saveFile(buffer: Buffer, fileName: string): string {
  ensureUploadDir();
  const uniqueName = `${Date.now()}-${fileName}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function readFileBuffer(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}
```

- [ ] **Step 2: 创建上传 API `src/app/api/upload/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveFile, readFileBuffer } from "@/lib/storage";
import { extractTextWithMinerU, readTextFile, needsMinerU, SUPPORTED_TYPES } from "@/lib/mineru";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) return NextResponse.json({ error: "请上传文件" }, { status: 400 });
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `不支持的文件格式: ${file.type}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = saveFile(buffer, file.name);

    // 提取文本
    let parsedText = "";
    try {
      if (needsMinerU(file.type)) {
        parsedText = await extractTextWithMinerU(buffer, file.name);
      } else {
        parsedText = readTextFile(buffer);
      }
    } catch (err) {
      // MinerU 失败不抛错，学生可手动粘贴
      console.error("MinerU extraction failed:", err);
    }

    // 创建 Upload 记录
    const upload = await db.upload.create({
      data: {
        projectId: projectId || "pending",
        filePath,
        fileType: file.type,
        parsedText,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: upload.id, parsedText, fileType: file.type, fileName: file.name },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/storage.ts src/app/api/upload/route.ts && git commit -m "feat: add file upload API with MinerU text extraction"
```

---

### Task 7: AI 分析 API

**Files:**
- Create: `src/app/api/analyze/route.ts`

- [ ] **Step 1: 创建分析 API `src/app/api/analyze/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeWithDeepSeek } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const { text } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "请提供文本内容" }, { status: 400 });
    }

    let analysis;
    try {
      analysis = await analyzeWithDeepSeek(text);
    } catch (err) {
      console.error("DeepSeek analysis failed:", err);
      // 降级：返回默认值
      analysis = {
        category: "general",
        title: "",
        summary: "",
        keywords: [],
        suggestedTemplate: "general",
        skillsDemo: [],
        sections: [
          { type: "background", content: "" },
          { type: "objective", content: "" },
          { type: "process", content: "" },
          { type: "result", content: "" },
        ],
      };
    }

    return NextResponse.json({ success: true, data: analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "分析失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/analyze/route.ts && git commit -m "feat: add AI analysis API endpoint with degradation fallback"
```

---

### Task 8: 模板系统

**Files:**
- Create: `src/lib/templates/types.ts`
- Create: `src/lib/templates/index.ts`
- Create: `src/lib/templates/tech.ts`
- Create: `src/lib/templates/design.ts`
- Create: `src/lib/templates/academic.ts`
- Create: `src/lib/templates/data.ts`
- Create: `src/lib/templates/general.ts`

- [ ] **Step 1: 创建模板类型定义 `src/lib/templates/types.ts`**

```typescript
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
```

- [ ] **Step 2: 创建技术模板 `src/lib/templates/tech.ts`**

```typescript
import { TemplateDefinition } from "./types";

export const techTemplate: TemplateDefinition = {
  id: "tech",
  name: "技术项目",
  category: "tech",
  description: "适合代码项目、技术文档，暗色 IDE 风格",
  previewImage: "/templates/tech.png",
  layoutConfig: {
    name: "技术项目",
    category: "tech",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "简要介绍项目背景和目标" },
      { type: "tech_stack", label: "技术栈", placeholder: "列出使用的技术和工具" },
      { type: "highlights", label: "核心亮点", placeholder: "代码架构、性能优化、创新点等" },
      { type: "challenges", label: "挑战与解决", placeholder: "遇到的技术难题和解决方案" },
      { type: "links", label: "相关链接", placeholder: "GitHub、演示地址等" },
    ],
    colors: {
      bg: "#0f172a",
      text: "#e2e8f0",
      heading: "#38bdf8",
      accent: "#38bdf8",
      card: "#1e293b",
      muted: "#94a3b8",
    },
    fonts: { heading: "JetBrains Mono, monospace", body: "Inter, sans-serif" },
    layout: "single-column",
  },
};
```

- [ ] **Step 3: 创建设计模板 `src/lib/templates/design.ts`**

```typescript
import { TemplateDefinition } from "./types";

export const designTemplate: TemplateDefinition = {
  id: "design",
  name: "设计作品",
  category: "design",
  description: "适合 UI 设计、海报、视觉作品，极简留白",
  previewImage: "/templates/design.png",
  layoutConfig: {
    name: "设计作品",
    category: "design",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "设计背景和需求" },
      { type: "gallery", label: "作品展示", placeholder: "上传设计稿图片" },
      { type: "process", label: "设计过程", placeholder: "从草图到成品的迭代过程" },
      { type: "outcome", label: "成果与影响", placeholder: "设计带来的效果和反馈" },
    ],
    colors: {
      bg: "#fafafa",
      text: "#18181b",
      heading: "#18181b",
      accent: "#a1a1aa",
      card: "#f4f4f5",
      muted: "#71717a",
    },
    fonts: { heading: "DM Sans, sans-serif", body: "Inter, sans-serif" },
    layout: "grid",
  },
};
```

- [ ] **Step 4: 创建学术模板 `src/lib/templates/academic.ts`**

```typescript
import { TemplateDefinition } from "./types";

export const academicTemplate: TemplateDefinition = {
  id: "academic",
  name: "学术研究",
  category: "academic",
  description: "适合论文、调研报告，暖纸色书卷气",
  previewImage: "/templates/academic.png",
  layoutConfig: {
    name: "学术研究",
    category: "academic",
    sections: [
      { type: "abstract", label: "摘要", placeholder: "研究摘要" },
      { type: "background", label: "研究背景", placeholder: "研究问题和动机" },
      { type: "method", label: "研究方法", placeholder: "采用的研究方法" },
      { type: "findings", label: "研究发现", placeholder: "主要发现和结论" },
      { type: "references", label: "参考文献", placeholder: "引用格式" },
    ],
    colors: {
      bg: "#fefce8",
      text: "#713f12",
      heading: "#854d0e",
      accent: "#ca8a04",
      card: "#fef3c7",
      muted: "#a16207",
    },
    fonts: { heading: "Source Serif 4, serif", body: "Charter, serif" },
    layout: "single-column",
  },
};
```

- [ ] **Step 5: 创建数据模板 `src/lib/templates/data.ts`**

```typescript
import { TemplateDefinition } from "./types";

export const dataTemplate: TemplateDefinition = {
  id: "data",
  name: "数据分析",
  category: "data",
  description: "适合数据报告、可视化项目，蓝绿理性",
  previewImage: "/templates/data.png",
  layoutConfig: {
    name: "数据分析",
    category: "data",
    sections: [
      { type: "overview", label: "分析概述", placeholder: "分析目标和数据来源" },
      { type: "methodology", label: "分析方法", placeholder: "使用的分析方法和工具" },
      { type: "insights", label: "关键洞察", placeholder: "数据揭示的核心发现" },
      { type: "visuals", label: "可视化展示", placeholder: "图表和数据展示" },
      { type: "recommendations", label: "建议与结论", placeholder: "基于数据的行动建议" },
    ],
    colors: {
      bg: "#ffffff",
      text: "#1e293b",
      heading: "#1e40af",
      accent: "#0891b2",
      card: "#f1f5f9",
      muted: "#64748b",
    },
    fonts: { heading: "IBM Plex Sans, sans-serif", body: "Inter, sans-serif" },
    layout: "two-column",
  },
};
```

- [ ] **Step 6: 创建通用模板 `src/lib/templates/general.ts`**

```typescript
import { TemplateDefinition } from "./types";

export const generalTemplate: TemplateDefinition = {
  id: "general",
  name: "通用专业",
  category: "general",
  description: "安全百搭的简约卡片风格",
  previewImage: "/templates/general.png",
  layoutConfig: {
    name: "通用专业",
    category: "general",
    sections: [
      { type: "overview", label: "项目概述", placeholder: "项目背景和目标" },
      { type: "process", label: "实施过程", placeholder: "做了什么、怎么做" },
      { type: "outcome", label: "成果展示", placeholder: "项目成果和收获" },
      { type: "reflection", label: "反思与收获", placeholder: "学到了什么" },
    ],
    colors: {
      bg: "#ffffff",
      text: "#0f172a",
      heading: "#0f172a",
      accent: "#3b82f6",
      card: "#f8fafc",
      muted: "#64748b",
    },
    fonts: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
    layout: "single-column",
  },
};
```

- [ ] **Step 7: 创建模板注册表 `src/lib/templates/index.ts`**

```typescript
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
```

- [ ] **Step 8: 提交**

```bash
git add src/lib/templates/ && git commit -m "feat: add 5 portfolio templates with layout configs"
```

---

### Task 9: 项目 CRUD API

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/projects/[id]/route.ts`

- [ ] **Step 1: 创建项目列表/创建 API `src/app/api/projects/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { template: { select: { name: true, category: true } } },
  });

  return NextResponse.json({ data: projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { title, content, templateId, tags, courseName } = await req.json();

  const project = await db.project.create({
    data: {
      userId,
      title: title || "未命名项目",
      content: content || "{}",
      templateId,
      tags: JSON.stringify(tags || []),
      courseName: courseName || "",
      slug: generateSlug(),
    },
  });

  return NextResponse.json({ data: project }, { status: 201 });
}
```

- [ ] **Step 2: 创建单个项目 API `src/app/api/projects/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const project = await db.project.findFirst({
    where: { id, userId },
    include: { uploads: true, template: true },
  });

  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  return NextResponse.json({ data: project });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.summary !== undefined) data.summary = body.summary;
  if (body.content !== undefined) data.content = typeof body.content === "string" ? body.content : JSON.stringify(body.content);
  if (body.templateId !== undefined) data.templateId = body.templateId;
  if (body.status !== undefined) data.status = body.status;
  if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
  if (body.courseName !== undefined) data.courseName = body.courseName;
  if (body.status === "published" && existing.status !== "published") {
    data.publishedAt = new Date();
  }

  const project = await db.project.update({ where: { id }, data });
  return NextResponse.json({ data: project });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  await db.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: 提交**

```bash
git add src/app/api/projects/ && git commit -m "feat: add project CRUD API endpoints"
```

---

### Task 10: 作品集渲染组件

**Files:**
- Create: `src/components/portfolio/tech-template.tsx`
- Create: `src/components/portfolio/design-template.tsx`
- Create: `src/components/portfolio/academic-template.tsx`
- Create: `src/components/portfolio/data-template.tsx`
- Create: `src/components/portfolio/general-template.tsx`
- Create: `src/components/portfolio/renderer.tsx`

- [ ] **Step 1: 创建技术模板渲染组件 `src/components/portfolio/tech-template.tsx`**

```tsx
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
```

- [ ] **Step 2: 创建通用渲染器 `src/components/portfolio/renderer.tsx`**

```tsx
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
```

- [ ] **Step 3: 提交**

```bash
git add src/components/portfolio/ && git commit -m "feat: add portfolio template renderer with generic fallback"
```

---

### Task 11: 编辑器页面

**Files:**
- Create: `src/app/editor/[id]/page.tsx`
- Create: `src/components/editor/file-uploader.tsx`
- Create: `src/components/editor/template-picker.tsx`

- [ ] **Step 1: 创建文件上传组件 `src/components/editor/file-uploader.tsx`**

```tsx
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FileUploader({ projectId, onComplete }: { projectId: string; onComplete: (data: { parsedText: string; fileName: string }) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);
    if (json.success) onComplete({ parsedText: json.data.parsedText, fileName: json.data.fileName });
    else alert(json.error);
  }, [projectId, onComplete]);

  return (
    <Card
      className={`p-8 border-2 border-dashed text-center cursor-pointer transition-colors ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300"}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) uploadFile(file); }}
    >
      <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif,.bmp,.txt,.md" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(file); }} />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-slate-600 mb-2">{uploading ? "正在提取文本..." : "拖拽文件到此处，或点击上传"}</p>
        <p className="text-xs text-slate-400">支持 PDF、DOCX、PPT、图片、Markdown、纯文本</p>
      </label>
      {uploading && <p className="text-sm text-indigo-500 mt-4">MinerU 正在解析文档，可能需要 1-2 分钟...</p>}
    </Card>
  );
}
```

- [ ] **Step 2: 创建模板选择组件 `src/components/editor/template-picker.tsx`**

```tsx
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
          {t.id === suggested && <span className="text-xs text-indigo-500 mt-1 block">🤖 AI 推荐</span>}
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: 创建编辑器页面 `src/app/editor/[id]/page.tsx`**

```tsx
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
        {/* Header */}
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
```

- [ ] **Step 4: 提交**

```bash
git add src/app/editor/ src/components/editor/ && git commit -m "feat: add portfolio editor with upload, AI analyze, template pick, and preview"
```

---

### Task 12: Dashboard 页面

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/project-card.tsx`

- [ ] **Step 1: 创建项目卡片组件 `src/components/dashboard/project-card.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectData {
  id: string;
  title: string;
  summary: string;
  status: string;
  slug: string;
  updatedAt: string;
  template?: { name: string; category: string } | null;
}

export function ProjectCard({ project, onDelete }: { project: ProjectData; onDelete: (id: string) => void }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => router.push(`/editor/${project.id}`)}>
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.summary || "暂无摘要"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded ${project.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {project.status === "published" ? "已发布" : "草稿"}
              </span>
              {project.template && <span className="text-xs text-slate-400">{project.template.name}</span>}
            </div>
          </div>
          {project.status === "published" && (
            <Button variant="ghost" size="sm" onClick={() => window.open(`/portfolio/${project.slug}`, "_blank")}>查看</Button>
          )}
        </div>
        <div className="flex gap-1 mt-3 text-xs text-slate-400">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/editor/${project.id}`)}>编辑</Button>
          <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portfolio/${project.slug}`); }}>复制链接</Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(project.id)}>删除</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: 创建 Dashboard 页面 `src/app/dashboard/page.tsx`**

```tsx
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
```

- [ ] **Step 3: 提交**

```bash
git add src/app/dashboard/ src/components/dashboard/ && git commit -m "feat: add dashboard with project list, edit, copy link, and delete"
```

---

### Task 13: 公开作品集页面

**Files:**
- Create: `src/app/portfolio/[slug]/page.tsx`

- [ ] **Step 1: 创建公开作品页 `src/app/portfolio/[slug]/page.tsx`**

```tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PortfolioRenderer } from "@/components/portfolio/renderer";
import { Button } from "@/components/ui/button";

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
          <Button variant="outline" onClick={() => window.print()}>下载 PDF</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 修改 `src/middleware.ts` 排除公开页面**

```typescript
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/api/projects/:path*", "/api/upload/:path*", "/api/analyze/:path*"],
};
```

- [ ] **Step 3: 添加 loading.tsx 和 not-found.tsx**

创建 `src/app/portfolio/[slug]/loading.tsx`:
```tsx
export default function Loading() {
  return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
}
```

创建 `src/app/portfolio/[slug]/not-found.tsx`:
```tsx
export default function NotFound() {
  return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold">作品未找到</h1>
    <p className="text-slate-500">该作品可能已被删除或尚未发布</p>
  </div>;
}
```

- [ ] **Step 4: 提交**

```bash
git add src/app/portfolio/ src/middleware.ts && git commit -m "feat: add public portfolio page with template rendering"
```

---

### Task 14: PDF 导出

**Files:**
- Create: `src/lib/pdf.ts`
- Create: `src/app/api/projects/[id]/pdf/route.ts`

- [ ] **Step 1: 创建 PDF 生成模块 `src/lib/pdf.ts`**

```typescript
import puppeteer from "puppeteer";

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
  await browser.close();
  return Buffer.from(pdf);
}
```

- [ ] **Step 2: 创建 PDF 下载 API `src/app/api/projects/[id]/pdf/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatePDF } from "@/lib/pdf";
import { getTemplate } from "@/lib/templates";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const project = await db.project.findFirst({ where: { id, userId } });
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });

  const template = getTemplate(project.templateId || "general");
  if (!template) return NextResponse.json({ error: "模板未找到" }, { status: 500 });

  const sections = JSON.parse(project.content || "[]");
  const c = template.layoutConfig.colors;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: ${template.layoutConfig.fonts.body}; color: ${c.text}; background: ${c.bg}; margin: 0; padding: 40px; }
  h1 { font-family: ${template.layoutConfig.fonts.heading}; color: ${c.heading}; }
  h3 { font-family: ${template.layoutConfig.fonts.heading}; color: ${c.heading}; }
  .card { background: ${c.card}; padding: 20px; margin-bottom: 16px; border-radius: 8px; }
  .muted { color: ${c.muted}; }
</style></head>
<body>
  <h1>${project.title}</h1>
  <p class="muted">${project.summary}</p>
  ${sections.map((s: { type: string; content: string }) => `
    <div class="card">
      <h3>${template.layoutConfig.sections.find((sec) => sec.type === s.type)?.label || s.type}</h3>
      <div>${s.content}</div>
    </div>
  `).join("")}
</body>
</html>`;

  try {
    const pdfBuffer = await generatePDF(html);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${project.slug}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF 生成失败" }, { status: 500 });
  }
}
```

- [ ] **Step 3: 安装 Puppeteer**

```bash
npm install puppeteer
```

- [ ] **Step 4: 提交**

```bash
git add src/lib/pdf.ts src/app/api/projects/ && git commit -m "feat: add PDF generation via Puppeteer"
```

---

### Task 15: 首页 + 最终集成

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/layout/header.tsx`

- [ ] **Step 1: 创建导航头部 `src/components/layout/header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-600">作品集生成器</Link>
        <nav className="flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard"><Button variant="ghost" size="sm">我的项目</Button></Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>退出</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">登录</Button></Link>
              <Link href="/register"><Button size="sm">注册</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 更新首页 `src/app/page.tsx`**

```tsx
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
```

- [ ] **Step 3: 更新根布局，嵌入 Header 和 SessionProvider**

修改 `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "作品集生成器",
  description: "将课程作业转化为专业求职作品集",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 更新 `.gitignore`，排除 uploads 目录**

确保 `.gitignore` 包含:
```
uploads/
.superpowers/
```

- [ ] **Step 5: 提交**

```bash
git add src/app/page.tsx src/app/layout.tsx src/components/layout/ .gitignore && git commit -m "feat: add landing page, header nav, and session provider"
```

---

### Task 16: 模板种子数据 + Prisma 迁移

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: 创建种子数据脚本 `prisma/seed.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const templates = [
    {
      id: "tech",
      name: "技术项目",
      category: "tech",
      previewImage: "/templates/tech.png",
      layoutConfig: JSON.stringify({
        name: "技术项目", category: "tech",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "简要介绍项目背景和目标" },
          { type: "tech_stack", label: "技术栈", placeholder: "列出使用的技术和工具" },
          { type: "highlights", label: "核心亮点", placeholder: "代码架构、性能优化、创新点等" },
          { type: "challenges", label: "挑战与解决", placeholder: "遇到的技术难题和解决方案" },
          { type: "links", label: "相关链接", placeholder: "GitHub、演示地址等" },
        ],
        colors: { bg: "#0f172a", text: "#e2e8f0", heading: "#38bdf8", accent: "#38bdf8", card: "#1e293b", muted: "#94a3b8" },
        fonts: { heading: "JetBrains Mono, monospace", body: "Inter, sans-serif" },
        layout: "single-column",
      }),
    },
    {
      id: "design",
      name: "设计作品",
      category: "design",
      previewImage: "/templates/design.png",
      layoutConfig: JSON.stringify({
        name: "设计作品", category: "design",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "设计背景和需求" },
          { type: "gallery", label: "作品展示", placeholder: "上传设计稿图片" },
          { type: "process", label: "设计过程", placeholder: "从草图到成品的迭代过程" },
          { type: "outcome", label: "成果与影响", placeholder: "设计带来的效果和反馈" },
        ],
        colors: { bg: "#fafafa", text: "#18181b", heading: "#18181b", accent: "#a1a1aa", card: "#f4f4f5", muted: "#71717a" },
        fonts: { heading: "DM Sans, sans-serif", body: "Inter, sans-serif" },
        layout: "grid",
      }),
    },
    {
      id: "academic",
      name: "学术研究",
      category: "academic",
      previewImage: "/templates/academic.png",
      layoutConfig: JSON.stringify({
        name: "学术研究", category: "academic",
        sections: [
          { type: "abstract", label: "摘要", placeholder: "研究摘要" },
          { type: "background", label: "研究背景", placeholder: "研究问题和动机" },
          { type: "method", label: "研究方法", placeholder: "采用的研究方法" },
          { type: "findings", label: "研究发现", placeholder: "主要发现和结论" },
          { type: "references", label: "参考文献", placeholder: "引用格式" },
        ],
        colors: { bg: "#fefce8", text: "#713f12", heading: "#854d0e", accent: "#ca8a04", card: "#fef3c7", muted: "#a16207" },
        fonts: { heading: "Source Serif 4, serif", body: "Charter, serif" },
        layout: "single-column",
      }),
    },
    {
      id: "data",
      name: "数据分析",
      category: "data",
      previewImage: "/templates/data.png",
      layoutConfig: JSON.stringify({
        name: "数据分析", category: "data",
        sections: [
          { type: "overview", label: "分析概述", placeholder: "分析目标和数据来源" },
          { type: "methodology", label: "分析方法", placeholder: "使用的分析方法和工具" },
          { type: "insights", label: "关键洞察", placeholder: "数据揭示的核心发现" },
          { type: "visuals", label: "可视化展示", placeholder: "图表和数据展示" },
          { type: "recommendations", label: "建议与结论", placeholder: "基于数据的行动建议" },
        ],
        colors: { bg: "#ffffff", text: "#1e293b", heading: "#1e40af", accent: "#0891b2", card: "#f1f5f9", muted: "#64748b" },
        fonts: { heading: "IBM Plex Sans, sans-serif", body: "Inter, sans-serif" },
        layout: "two-column",
      }),
    },
    {
      id: "general",
      name: "通用专业",
      category: "general",
      previewImage: "/templates/general.png",
      layoutConfig: JSON.stringify({
        name: "通用专业", category: "general",
        sections: [
          { type: "overview", label: "项目概述", placeholder: "项目背景和目标" },
          { type: "process", label: "实施过程", placeholder: "做了什么、怎么做" },
          { type: "outcome", label: "成果展示", placeholder: "项目成果和收获" },
          { type: "reflection", label: "反思与收获", placeholder: "学到了什么" },
        ],
        colors: { bg: "#ffffff", text: "#0f172a", heading: "#0f172a", accent: "#3b82f6", card: "#f8fafc", muted: "#64748b" },
        fonts: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
        layout: "single-column",
      }),
    },
  ];

  for (const t of templates) {
    await db.template.upsert({ where: { id: t.id }, update: t, create: t });
  }

  console.log("Seed complete: 5 templates inserted");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
```

- [ ] **Step 2: 更新 `package.json` 添加 seed 脚本**

在 `package.json` 的 `scripts` 中添加:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

- [ ] **Step 3: 运行种子数据**

```bash
npm install -D tsx && npx prisma db seed
```

- [ ] **Step 4: 提交**

```bash
git add prisma/seed.ts package.json && git commit -m "feat: add template seed data with 5 portfolio templates"
```

---

## 实现顺序总结

| 顺序 | 任务 | 依赖 |
|------|------|------|
| 1 | 项目初始化 | — |
| 2 | 数据库 Schema | 1 |
| 3 | 认证系统 | 2 |
| 4 | MinerU 模块 | 1 |
| 5 | DeepSeek 模块 | 1 |
| 6 | 文件上传 API | 3, 4 |
| 7 | AI 分析 API | 3, 5 |
| 8 | 模板系统 | 1 |
| 9 | 项目 CRUD API | 3 |
| 10 | 作品集渲染组件 | 8 |
| 11 | 编辑器页面 | 6, 7, 8, 9 |
| 12 | Dashboard 页面 | 9 |
| 13 | 公开作品集页面 | 9, 10 |
| 14 | PDF 导出 | 10 |
| 15 | 首页 + 最终集成 | 3 |
| 16 | 模板种子数据 | 2, 8 |
