# 课程作业转作品集 — 设计规格

**日期:** 2026-05-13
**状态:** 已确认，待实现

## 1. 产品概述

面向所有专业学生的 Web 应用，帮助将课程作业转化为专业求职作品集。
核心价值：让学生用最低的时间成本，把已有的课程产出包装成面试官想看的作品。

## 2. 产品定义

| 维度 | 决策 |
|------|------|
| 产品形态 | Web 应用 + 模板库 + 方法论指导 |
| 目标用户 | 不限专业（计算机、设计、人文社科等） |
| 核心流程 | 上传作业 → AI 智能识别/推荐模板 → 学生填写细节/编辑 → 发布 |
| 输出形式 | 个人主页 + 独立项目页面 + PDF 导出 |
| 智能化程度 | 智能识别 + 人工确认（AI 建议，学生决策） |

## 3. 核心用户流程

### 3.1 新建作品集（5 步）
1. **上传作业** — 拖拽/选择 PDF、DOCX、PPT、图片、Markdown、纯文本
2. **AI 解析结果** — 系统展示提取的标题、摘要、关键词、推荐模板，学生确认或修改
3. **选择模板** — 接受 AI 推荐或浏览模板库自选
4. **编辑完善** — 富文本编辑文案、替换图片、调整区块顺序
5. **发布** — 生成可分享 URL + PDF 下载链接

### 3.2 管理已有项目
- 复制分享链接、继续编辑、下载 PDF、预览个人主页、删除

### 3.3 对外展示页面
- **个人主页** — `yourname.domain.com`，头像/简介/技能标签/作品卡片网格/联系方式
- **项目详情页** — 项目背景/目标/过程/成果展示/技能标签/关联课程/分享与下载

## 4. 系统架构

**方案：Next.js 全栈一体式 Web 应用**

```
浏览器 → Next.js App (单体)
  ├── 文件上传模块 (PDF/DOCX/PPT/Image/MD/TXT)
  ├── AI 解析模块 (MinerU 提取文本 → DeepSeek 分析)
  ├── 模板引擎 (模板布局 + 项目内容 → HTML)
  ├── PDF 生成模块 (Puppeteer 服务端渲染)
  └── 认证模块 (注册/登录/个人中心)
       ↓
  SQLite/PostgreSQL ←→ 文件存储 ←→ 外部 AI API
```

## 5. 数据模型

### User
`id`, `name`, `email`, `password_hash`, `avatar`, `bio`, `skills[]`, `contact_info`, `created_at`

### Project
`id`, `user_id`, `title`, `summary`, `content` (rich text), `template_id`, `status` (draft|published), `tags[]`, `course_name`, `published_at`, `slug`

### Upload
`id`, `project_id`, `file_path`, `file_type`, `parsed_text`, `ai_metadata` (JSON)

### Template
`id`, `name`, `category`, `preview_image`, `layout_config` (JSON), `is_active`

**关系：** User 1:N Project, Project 1:N Upload, Template 1:N Project

## 6. 模板系统

### 6.1 分类（5 套）

| 模板 | 适用场景 | 视觉特征 |
|------|---------|---------|
| 技术项目 | 代码仓库、技术文档 | 暗色 IDE 风、代码高亮、技术栈标签 |
| 设计作品 | UI 设计、海报、视频 | 大图优先、画廊布局、极简黑白灰 |
| 学术研究 | 论文、调研报告 | 衬线字体、暖纸色底、引用格式 |
| 数据分析 | 数据报告、可视化 | 蓝绿冷调、图表嵌入、洞察要点 |
| 通用专业 | 不限定领域 | 白底蓝强调、卡片布局、安全百搭 |

### 6.2 模板工作原理
- 模板 = `layout_config` JSON：定义区块结构、配色、字体、布局方式
- 渲染 = `template.layout_config` + `project.content` → HTML
- PDF = 同一 HTML → 打印样式 → Puppeteer → PDF
- 切换模板 = 保留项目内容，换 layout_config 重新渲染

### 6.3 AI 模板推荐
输入（作业文本 + AI 识别结果）→ 领域关键词 ↔ 模板类别 → 输出 Top 2 推荐（含匹配度百分比），学生可忽略自选

### 6.4 学生编辑能力
修改文案、替换图片、调整区块顺序、切换模板、添加技能标签

## 7. AI 集成

### 7.1 流水线

```
学生上传文件
  → 判断文件类型
    → 二进制文档 (PDF/DOCX/PPT/Image): MinerU API 提取文本
    → 纯文本 (MD/TXT): 直接读取
  → DeepSeek V4 Pro 分析
  → 结构化 JSON 填充编辑表单
```

### 7.2 MinerU 文本提取

- **API:** mineru.net/api/v1
- **Key:** `.env` → `mineru-api-key`
- **流程:** POST `/parse/file` → 获取 task_id + OSS 上传 URL → PUT 文件到 OSS → 轮询 GET `/parse/{task_id}` → 获取 markdown_url → 下载 Markdown
- **超时:** 60 次轮询 × 2s = 最多 2 分钟
- **复用:** 基于 `server.js` 中的 `extractTextFromImage` 扩展，增加 PDF/DOCX/PPT 支持

### 7.3 DeepSeek V4 Pro 分析

- **API:** `api.deepseek.com/v1/chat/completions`
- **Key:** `.env` → `ds-api-key`
- **Model:** `deepseek-chat`
- **参数:** temperature=0.3, max_tokens=2048
- **输入:** MinerU 提取的 Markdown 文本（截取前 4000 字）
- **输出:** JSON（category, title, summary, keywords, suggested_template, skills_demo, sections）
- **Prompt:** 作品集顾问角色，面向雇主提炼亮点

### 7.4 降级策略

| 环节 | 失败处理 |
|------|---------|
| MinerU 失败 | 尝试直接读取文本；二进制文件提示手动粘贴 |
| DeepSeek 失败 | 空表单 + 默认通用模板，完全手动填写 |
| JSON 解析失败 | 正则提取 + 兜底默认值，不抛错 |

## 8. 技术栈

| 类别 | 选型 | 理由 |
|------|------|------|
| 全栈框架 | Next.js 14+ (App Router) | API Routes 处理上传/AI，SSR 渲染作品页 |
| 数据库 | SQLite (开发) → PostgreSQL (生产) | Prisma ORM 适配，改 URL 即切换 |
| UI 组件 (应用层) | Tailwind CSS + shadcn/ui | 源码可控、Tailwind 原生、无障碍内置 |
| 认证 | Auth.js (NextAuth v5) | 邮箱密码 + OAuth，session 管理内置 |
| PDF 生成 | Puppeteer | 服务端渲染 HTML → 打印样式 → PDF |
| 文件存储 | 本地磁盘 → S3 兼容 | 抽象存储接口，后续可切换 |
| AI 提取 | MinerU API | 已有可用代码，支持多格式 |
| AI 分析 | DeepSeek V4 Pro (deepseek-chat) | 已有可用代码和 key |

## 9. 视觉设计

### 9.1 两层分离策略

- **应用层** (Dashboard / 编辑器)：shadcn/ui 组件，统一、高效、无障碍
- **展示层** (作品集页面 / 模板)：纯 Tailwind 手写，每个模板独立视觉个性

### 9.2 字体

- **应用层:** `'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif`（Inter 自托管）
- **展示层模板:** 按类别各自选字体（JetBrains Mono / DM Sans / Source Serif / IBM Plex Sans），全部自托管
- **中文:** 统一使用系统自带字体，不加载 Web Font（中文字体 5-15MB，对首屏速度是灾难）

### 9.3 色彩

- **应用层:** Slate 灰阶 + Indigo 500 品牌色。克制、不抢眼
- **展示层:** 5 套模板各有独立配色方案
  - 技术：深蓝底 + 天蓝强调（IDE 感）
  - 设计：极简黑白灰（让作品说话）
  - 学术：暖纸色底 + 深棕文字（书卷气）
  - 数据：蓝绿冷调（理性客观）
  - 通用：白底 + 蓝强调（安全百搭）

## 10. 项目目录结构

```
src/
├── app/
│   ├── (auth)/          # 登录/注册
│   ├── dashboard/       # 项目列表
│   ├── editor/[id]/     # 作品编辑页
│   ├── portfolio/[slug] # 公开作品页
│   └── api/
│       ├── upload/      # 文件上传 + MinerU 提取
│       ├── analyze/     # DeepSeek 分析
│       └── projects/    # CRUD
├── lib/
│   ├── mineru.ts        # MinerU API（复刻 server.js）
│   ├── deepseek.ts      # DeepSeek API 调用
│   ├── templates/       # 模板 layout_config 定义
│   └── pdf.ts           # Puppeteer PDF 生成
├── components/          # shadcn/ui + 自定义组件
└── prisma/              # 数据模型 + 迁移
```

## 11. 部署

- **初期（个人使用）:** VPS 单机，Node.js + SQLite + Nginx + PM2
- **扩展（多用户）:** Vercel/Railway + PostgreSQL 云服务 + S3 对象存储
