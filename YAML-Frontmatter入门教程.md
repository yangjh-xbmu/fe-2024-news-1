# YAML Frontmatter 3分钟入门指南

> Markdown 文件顶部的元数据区域，用于定义文档属性

---

## 什么是 Frontmatter？

Frontmatter 是位于 Markdown 文件顶部的元数据块，用 `---` 包裹，采用 YAML 格式书写。

```markdown
---
title: 文章标题
date: 2024-01-15
author: 张三
---

# 正文开始
这里是文章内容...
```

---

## 基本语法（1分钟）

### 格式规则
- 位于文件**最顶部**
- 以 `---` 开始和结束
- 使用 `键: 值` 的格式
- **冒号后面必须有空格**

```yaml
---
title: 我的文章
date: 2024-03-25
tags: markdown, tutorial
---
```

---

## 数据类型（1分钟）

### 字符串
```yaml
---
title: 文章标题
description: "可以带引号，也可以不带"
---
```

### 数字
```yaml
---
views: 100
rating: 4.5
---
```

### 布尔值
```yaml
---
published: true
draft: false
---
```

### 列表（数组）
```yaml
---
tags:
  - markdown
  - tutorial
  - yaml
categories: [技术, 前端]
---
```

### 多行文本
```yaml
---
description: |
  这是多行文本
  每一行都会保留换行

summary: >
  这是折叠的多行文本
  实际会显示为一行
---
```

---

## 实际应用场景（1分钟）

### Hugo 博客
```yaml
---
title: "我的第一篇博客"
date: 2024-03-25T10:00:00+08:00
draft: false
tags: ["hugo", "blog"]
categories: ["技术"]
author: "宏哥"
---
```

### Jekyll 博客
```yaml
---
layout: post
title: 文章标题
date: 2024-03-25 10:00:00 +0800
categories: jekyll update
---
```

### VuePress 文档
```yaml
---
title: 页面标题
lang: zh-CN
sidebar: auto
prev: ./上一页
next: ./下一页
---
```

---

## 常见字段速查表

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | `title: 我的文章` |
| `date` | 发布日期 | `date: 2024-03-25` |
| `author` | 作者 | `author: 张三` |
| `tags` | 标签 | `tags: [a, b]` |
| `categories` | 分类 | `categories: 技术` |
| `draft` | 草稿标记 | `draft: true` |
| `description` | 描述 | `description: 简介` |
| `slug` | 自定义链接 | `slug: my-post` |

---

# 📝 YAML Frontmatter 测试题

> 请作答后查看答案解析

---

## 单选题

### 第1题
**Frontmatter 应该放在文件的什么位置？**

A. 文件底部

B. 文件中间

C. 文件最顶部

D. 任意位置

<details>
<summary>点击查看答案</summary>

**答案：C**

解析：Frontmatter 必须放在 Markdown 文件的最顶部，以 `---` 开始。

</details>

---

### 第2题
**以下哪个是正确的 Frontmatter 语法？**

A. `title:我的文章`

B. `title: 我的文章`

C. `title=我的文章`

D. `"title": "我的文章"`

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：YAML 语法要求冒号后面必须有一个空格，格式为 `键: 值`。

</details>

---

### 第3题
**Frontmatter 使用什么符号包裹？**

A. ` ``` `（三个反引号）

B. `---`（三个横线）

C. `<!-- -->`（HTML注释）

D. `[[ ]]`（双方括号）

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：Frontmatter 以三个横线 `---` 开始和结束。

</details>

---

### 第4题
**以下哪个定义标签列表的方式是正确的？**

A. `tags: markdown tutorial yaml`

B. `tags: [markdown, tutorial, yaml]`

C. `tags = ["markdown", "tutorial"]`

D. `tags(markdown, tutorial)`

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：YAML 中列表可以用方括号 `[]` 表示，元素之间用逗号分隔。

</details>

---

### 第5题
**以下哪个布尔值写法在 YAML 中是正确的？**

A. `published: yes`

B. `published: "true"`

C. `published: true`

D. `published = true`

<details>
<summary>点击查看答案</summary>

**答案：C**

解析：YAML 的布尔值是 `true` 或 `false`，不需要引号，也不要用等号。

</details>

---

## 判断题

### 第6题
Frontmatter 只能用于 Hugo 博客，其他工具不支持。

<details>
<summary>点击查看答案</summary>

**答案：✗ 错误**

解析：Frontmatter 被广泛使用，包括 Hugo、Jekyll、VuePress、Hexo、Gatsby 等众多静态网站生成器都支持。

</details>

---

### 第7题
`date: 2024-03-25` 是一个有效的 Frontmatter 字段。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：日期是 Frontmatter 中非常常见的字段，几乎所有静态网站生成器都支持。

</details>

---

### 第8题
YAML 中 `key: value` 的冒号后面可以不加空格。

<details>
<summary>点击查看答案</summary>

**答案：✗ 错误**

解析：YAML 语法严格要求冒号后面必须有一个空格，否则解析会失败。

</details>

---

### 第9题
`draft: true` 表示该文章是草稿，通常不会发布。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：`draft` 字段用于标记草稿状态，设为 `true` 时大多数生成器会跳过该文件不发布。

</details>

---

### 第10题
Frontmatter 中可以使用中文字段名，如 `标题: 我的文章`。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：YAML 支持 Unicode，中文字段名是合法的，但不推荐使用，因为兼容性可能有问题。

</details>

---

## 附：完整示例

```markdown
---
title: "YAML Frontmatter 完全指南"
date: 2024-03-25T10:30:00+08:00
lastmod: 2024-03-26T15:00:00+08:00
author: "宏哥"
draft: false
tags:
  - yaml
  - markdown
  - tutorial
categories:
  - 技术文档
description: "这是一篇关于 YAML Frontmatter 的详细教程"
image: /images/cover.png
slug: yaml-frontmatter-guide
---

# 正文标题

正文内容从这里开始...
```

---

**祝宏哥学习愉快！** 🎉
