# Plan: 孕期食品安全扫描工具

## 目标

孕妇上传食品配料表照片 → MinerU 识别文字 → DeepSeek 分析孕期安全性 → 展示结构化结果

## 文件清单

| 文件 | 用途 |
|---|---|
| `package.json` | 项目配置 + 依赖 |
| `server.js` | Express 后端，处理上传/OCR/LLM |
| `public/index.html` | 上传页 + 结果页（单页） |
| `public/style.css` | 样式 |

## 任务分解

### Task 1: 初始化项目依赖
- **文件**: `package.json`
- **内容**: 创建 package.json，安装 express、multer、form-data、node-fetch
- **验证**: `npm install` 无报错

### Task 2: 创建后端 server.js
- **文件**: `server.js`
- **内容**:
  - Express 服务监听 3000 端口
  - multer 处理文件上传（限制 10MB，仅图片格式）
  - POST `/api/analyze` 接口
- **验证**: `node server.js` 启动，curl 测试返回 200

### Task 3: MinerU OCR 模块
- **文件**: `server.js`（追加）
- **内容**:
  - `extractTextFromImage(filePath)` 函数
  - 调用 MinerU Agent API `/api/v1/agent/parse/file` 获取签名 URL
  - PUT 上传图片文件到 OSS
  - 轮询 `/api/v1/agent/parse/{task_id}` 直到 done
  - 下载 markdown_url 内容，返回纯文本
- **验证**: 用测试图片调接口，确认返回文字

### Task 4: DeepSeek 分析模块
- **文件**: `server.js`（追加）
- **内容**:
  - `analyzeSafety(ingredientText)` 函数
  - 调用 DeepSeek API `https://api.deepseek.com/v1/chat/completions`
  - System prompt: 孕期食品安全专家角色，分析配料表
  - 要求返回 JSON 结构：overallRisk / summary / ingredients[]
  - 解析响应的 JSON
- **验证**: 用假配料文字调接口，确认返回结构化 JSON

### Task 5: 前端页面（上传 + 结果）
- **文件**: `public/index.html`
- **内容**:
  - 上传区域：拖拽 + 点击上传，图片预览
  - 分析按钮，调 POST `/api/analyze`
  - 结果区域：风险徽章 + 总结 + 配料分析表格 + 免责声明
- **验证**: 浏览器打开，上传图片，查看完整流程

### Task 6: 样式
- **文件**: `public/style.css`
- **内容**:
  - 移动端优先响应式布局
  - 风险等级颜色编码（红/黄/绿）
  - 加载状态动画
- **验证**: Chrome DevTools 移动端模拟测试

### Task 7: 端到端测试
- **操作**: 用真实食品配料表照片走完整流程
- **验证**: 返回合理的安全性分析结果

## 状态存储

- 任务状态: 无状态，每次请求独立处理
- API Keys: `.env` 文件（已存在，不提交 git）
- 临时文件: multer 上传后立即处理，处理完删除

## 不做的

- 用户系统/登录
- 历史记录
- 知识库 RAG（后续版本）
- 数据库
- 移动端 APP
