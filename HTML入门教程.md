# HTML 10分钟入门指南

> HTML（HyperText Markup Language，超文本标记语言）是用于构建网页结构和内容的标记语言，通过**标签（Tags）**来描述网页的语义结构，是Web开发的三大基石之一。

---

## 一、HTML 核心概念（2分钟）

### 1.1 什么是HTML？

HTML 是 **超文本标记语言**，它使用**标签**来标记网页中的各个部分，告诉浏览器如何显示内容。

### 1.2 核心概念解析

| 概念 | 说明 | 示例 |
|------|------|------|
| **标签（Tag）** | 用尖括号包裹的关键词，成对出现 | `<p>` `</p>` |
| **元素（Element）** | 开始标签 + 内容 + 结束标签 | `<p>这是一个段落</p>` |
| **属性（Attribute）** | 为元素提供额外信息 | `<img src="photo.jpg" alt="描述" />` |
| **语义化** | 标签具有明确的含义，非仅用于样式 | `<header>` `<nav>` `<article>` |
| **DOM 树** | 文档对象模型，HTML 的层级结构表示 | 父子节点关系 |

---

## 二、HTML 文档结构（2分钟）

### 2.1 标准文档结构

每个 HTML 页面都必须有以下基础结构：

```html
<!DOCTYPE html>           <!-- 文档类型声明（必须是第一行）-->
<html lang="zh-CN">       <!-- 根元素，lang 属性指定页面语言 -->
<head>                     <!-- 元数据区域：标题、编码、样式链接等 -->
    <meta charset="UTF-8" />                        <!-- 字符编码：必须使用UTF-8 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />  <!-- 视口设置：移动端必备 -->
    <meta name="description" content="页面描述" />     <!-- 页面描述：利于SEO -->
    <title>网页标题</title>                           <!-- 浏览器标签页标题 -->
    <link rel="stylesheet" href="style.css" />       <!-- 引入外部CSS文件 -->
</head>
<body>                     <!-- 可见页面内容区域 -->
    <h1>Hello World</h1>
    <p>这是我的第一个网页</p>

    <script src="script.js"></script>              <!-- 引入外部JavaScript文件 -->
</body>
</html>
```

### 2.2 核心结构说明

| 部分 | 说明 | 必要性 |
|------|------|--------|
| `<!DOCTYPE html>` | 声明文档类型为 HTML5，必须放在首行 | **必须** |
| `<html>` | 根元素，包裹整个页面 | **必须** |
| `<head>` | 元数据区域，不直接显示在页面上 | **必须** |
| `<body>` | 页面可见内容 | **必须** |
| `lang` 属性 | 指定页面语言，利于SEO和无障碍访问 | 推荐 |

---

## 三、基础语法规则（2分钟）

### 3.1 标签分类

**双标签**（成对出现：开始标签 + 结束标签）：

```html
<p>段落内容</p>
<div>块级容器</div>
<span>行内文本</span>
<h1>标题</h1>
```

**单标签**（自闭合标签，无内容）：

```html
<br />        <!-- 换行（break） -->
<hr />        <!-- 水平分割线（horizontal rule） -->
<img />       <!-- 图片 -->
<input />     <!-- 输入框 -->
<meta />      <!-- 元数据 -->
```

### 3.2 属性语法

属性写在**开始标签**中，格式为 `属性名="属性值"`：

```html
<!-- 单个属性 -->
<a href="https://example.com">链接</a>

<!-- 多个属性 -->
<a href="https://example.com" target="_blank" title="提示文字">
    在新标签页打开
</a>

<!-- 布尔属性（无需值，存在即生效） -->
<input type="checkbox" checked />     <!-- 已勾选 -->
<input type="text" disabled />       <!-- 禁用状态 -->
<input type="text" required />       <!-- 必填项 -->
```

### 3.3 元素分类

| 类型 | 特点 | 代表标签 |
|------|------|----------|
| **块级元素** | 独占一行，可设置宽高 | `<div>`、`<p>`、`<h1>`-`<h6>`、`<ul>`、`<li>`、`<section>` |
| **行内元素** | 不独占行，不可设置宽高 | `<span>`、`<a>`、`<strong>`、`<em>` |
| **行内块元素** | 不独占行，但可设置宽高 | `<img>`、`<input>`、`<button>` |

---

## 四、常用标签详解（3分钟）

### 4.1 文本标签

```html
<!-- 标题标签：h1最重要，一个页面建议只用一次 -->
<h1>一级标题（页面主标题）</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>

<!-- 段落和换行 -->
<p>这是一个段落。段落会自动换行，内部多个空格会被合并。需要使用</p>
<p>这是另一个段落。</p>
<p>第一行<br />第二行（使用br强制换行）</p>

<!-- 水平分割线 -->
<hr />
```

### 4.2 文本格式化

```html
<!-- 强调（有语义）vs 样式（无语义） -->
<strong>加粗（语义强调，重要内容）</strong>
<b>加粗（纯样式，不推荐）</b>

<em>倾斜（语义强调）</em>
<i>倾斜（纯样式）</i>

<!-- 删除线和下划线 -->
<del>删除的内容</del>       <!-- 语义：已删除 -->
<s>删除线（纯样式）</s>
<ins>插入的内容</ins>       <!-- 语义：新增内容 -->
<u>下划线（纯样式）</u>

<!-- 上下标 -->
H<sub>2</sub>O                  <!-- 下标：H₂O -->
x<sup>2</sup>                   <!-- 上标：x² -->
```

### 4.3 链接与图片

```html
<!-- 超链接 -->
<!-- href：链接地址；target：打开方式；title：悬停提示 -->
<a href="https://www.example.com">普通链接</a>

<a href="https://www.example.com" target="_blank" title="访问示例网站">
    在新标签页打开
</a>
<!-- target="_blank" 表示在新标签页打开 -->

<a href="mailto:email@example.com">发送邮件</a>          <!-- 邮件链接 -->
<a href="tel:+8612345678900">拨打电话</a>               <!-- 电话链接（移动端） -->

<!-- 图片 -->
<!-- src：图片路径；alt：替代文本（图片加载失败时显示，也是屏幕阅读器读取的内容） -->
<img src="photo.jpg" alt="风景照片" width="300" height="200" />
<!-- alt属性非常重要！利于SEO和无障碍访问 -->
```

### 4.4 列表

```html
<!-- 无序列表（ul：unordered list；li：list item） -->
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>

<!-- 有序列表（ol：ordered list） -->
<ol>
    <li>第一步：准备材料</li>
    <li>第二步：开始制作</li>
    <li>第三步：完成</li>
</ol>
```

### 4.5 HTML5 语义化标签

语义化标签让代码更有可读性，有利于SEO和无障碍访问：

```html
<header>                  <!-- 页面或区块的头部 -->
    <nav>                  <!-- 导航链接区域 -->
        <a href="#">首页</a>
        <a href="#">产品</a>
        <a href="#">关于</a>
    </nav>
</header>

<main>                    <!-- 页面主要内容（一个页面只有一个main） -->
    <article>              <!-- 独立的文章内容 -->
        <section>          <!-- 文档中的节或区块 -->
            <h2>文章标题</h2>
            <p>文章内容...</p>
        </section>
    </article>

    <aside>                <!-- 侧边栏内容（与主要内容相关但独立） -->
        <h3>相关推荐</h3>
        <ul>
            <li>推荐文章1</li>
            <li>推荐文章2</li>
        </ul>
    </aside>
</main>

<footer>                  <!-- 页面或区块的底部 -->
    <p>&copy; 2024 版权所有</p>
    <nav>                  <!-- 底部导航 -->
        <a href="#">隐私政策</a>
        <a href="#">使用条款</a>
    </nav>
</footer>
```

**使用语义化标签的好处**：
1. **SEO**：搜索引擎更好地理解页面结构
2. **无障碍访问**：屏幕阅读器能正确朗读页面
3. **代码可读性**：开发者更容易理解代码结构
4. **维护性**：后期修改和协作更方便

---

## 五、表单基础（1分钟）

表单用于收集用户输入：

```html
<form action="/submit" method="POST">      <!-- action：提交地址；method：提交方式（GET/POST） -->

    <!-- 文本输入：label的for属性与input的id属性关联 -->
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username" placeholder="请输入用户名" required />

    <!-- 密码输入 -->
    <label for="pwd">密码：</label>
    <input type="password" id="pwd" name="password" />

    <!-- 邮箱输入（自动验证格式） -->
    <input type="email" name="email" placeholder="your@email.com" />

    <!-- 单选按钮：name相同表示一组 -->
    <input type="radio" name="gender" value="male" id="male" />
    <label for="male">男</label>
    <input type="radio" name="gender" value="female" id="female" />
    <label for="female">女</label>

    <!-- 复选框 -->
    <input type="checkbox" name="hobby" value="reading" id="reading" />
    <label for="reading">阅读</label>
    <input type="checkbox" name="hobby" value="sports" id="sports" />
    <label for="sports">运动</label>

    <!-- 下拉选择 -->
    <select name="city">
        <option value="">请选择城市</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="guangzhou">广州</option>
    </select>

    <!-- 多行文本 -->
    <textarea name="message" rows="4" cols="50" placeholder="请输入留言"></textarea>

    <!-- 提交按钮 -->
    <button type="submit">提交</button>
    <button type="reset">重置</button>

</form>
```

### 常用 input 类型

| type值 | 用途 | 特性 |
|--------|------|------|
| `text` | 单行文本 | 基础输入 |
| `password` | 密码 | 隐藏输入内容 |
| `email` | 邮箱 | 自动验证邮箱格式 |
| `tel` | 电话号码 | 移动端唤起数字键盘 |
| `number` | 数字 | 只能输入数字 |
| `date` | 日期 | 唤起日期选择器 |
| `file` | 文件上传 | 选择本地文件 |
| `radio` | 单选 | 同一name只能选一个 |
| `checkbox` | 多选 | 可同时选多个 |
| `submit` | 提交按钮 | 提交表单数据 |

---

## 附：快速参考表

### 常用标签速查

| 功能 | 标签 | 示例 |
|------|------|------|
| 一级标题 | `<h1>` | `<h1>主标题</h1>` |
| 二级标题 | `<h2>` | `<h2>副标题</h2>` |
| 段落 | `<p>` | `<p>段落文本</p>` |
| 换行 | `<br />` | `第一行<br />第二行` |
| 水平线 | `<hr />` | `<hr />` |
| 加粗（语义） | `<strong>` | `<strong>重要</strong>` |
| 倾斜（语义） | `<em>` | `<em>强调</em>` |
| 链接 | `<a>` | `<a href="url">链接</a>` |
| 图片 | `<img />` | `<img src="pic.jpg" alt="描述" />` |
| 无序列表 | `<ul>` + `<li>` | `<ul><li>项</li></ul>` |
| 有序列表 | `<ol>` + `<li>` | `<ol><li>项</li></ol>` |
| 块级容器 | `<div>` | `<div>内容</div>` |
| 行内容器 | `<span>` | `<span>文本</span>` |
| 页头 | `<header>` | `<header>头部内容</header>` |
| 导航 | `<nav>` | `<nav>导航链接</nav>` |
| 主要内容 | `<main>` | `<main>主内容</main>` |
| 文章 | `<article>` | `<article>独立文章</article>` |
| 页脚 | `<footer>` | `<footer>底部</footer>` |
| 注释 | `<!-- -->` | `<!-- 注释内容 -->` |

### 特殊字符转义

| 字符 | 转义码 | 显示 |
|------|--------|------|
| < | `&lt;` | < |
| > | `&gt;` | > |
| & | `&amp;` | & |
| " | `&quot;` | " |
| 空格 | `&nbsp;` | 不间断空格 |
| © | `&copy;` | © |
| ® | `&reg;` | ® |
| ¥ | `&yen;` | ¥ |

### 官方文档参考

| 资源 | 网址 |
|------|------|
| **MDN HTML 文档（中文）** | https://developer.mozilla.org/zh-CN/docs/Web/HTML |
| **MDN 学习教程** | https://developer.mozilla.org/zh-CN/docs/Learn/HTML |
| **W3C HTML5 标准** | https://www.w3.org/TR/html5/ |
| **WHATWG HTML 现行标准** | https://html.spec.whatwg.org/ |
| **Can I Use（兼容性查询）** | https://caniuse.com/ |

---

# 测试题

## 单选题（5道）

### 第1题
HTML 是什么的缩写？

A. Hyper Text Makeup Language
B. Hyper Text Markup Language
C. High Text Markup Language
D. Home Tool Markup Language

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：HTML 是 HyperText Markup Language（超文本标记语言）的缩写。HyperText 指超文本（包含链接的文本），Markup 指标记。

</details>

---

### 第2题
以下哪个标签用于定义网页的标题（显示在浏览器标签页上）？

A. `<h1>`
B. `<header>`
C. `<title>`
D. `<head>`

<details>
<summary>点击查看答案</summary>

**答案：C**

解析：`<title>` 标签定义文档的标题，显示在浏览器标签页和收藏夹中。`<h1>` 是页面内容的一级标题，`<head>` 是元数据容器，`<header>` 是页面头部区域。

</details>

---

### 第3题
以下哪个是自闭合标签（单标签）的正确写法？

A. `<img></img>`
B. `<img />`
C. `<image>`
D. `</img>`

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：在 HTML5 标准中，自闭合标签推荐写成 `<img />`、`<br />`、`<input />` 的形式。虽然 `<img>` 也能被浏览器解析，但加上斜杠更符合规范。

</details>

---

### 第4题
在 HTML 中，哪个属性用于指定超链接在新标签页打开？

A. `open="new"`
B. `target="_blank"`
C. `new="true"`
D. `window="new"`

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：`target="_blank"` 属性告诉浏览器在新窗口或新标签页中打开链接。其他 target 值还包括 `_self`（默认，当前页）、`_parent`、`_top`。

</details>

---

### 第5题
以下哪组标签是 HTML5 新增的语义化标签？

A. `<div>`、`<span>`、`<p>`
B. `<header>`、`<nav>`、`<article>`、`<footer>`
C. `<table>`、`<tr>`、`<td>`
D. `<font>`、`<center>`、`<big>`

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：`<header>`、`<nav>`、`<article>`、`<section>`、`<aside>`、`<footer>` 等都是 HTML5 新增的语义化标签。选项 D 中的标签已被 HTML5 废弃，不推荐使用。

</details>

---

## 判断题（5道）

### 第6题
HTML 标签不区分大小写，`<DIV>` 和 `<div>` 是等效的。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：HTML 标签确实不区分大小写，但**强烈建议使用小写**，这是行业规范，也是 XHTML 的要求。小写标签在团队协作和代码可读性上更好。

</details>

---

### 第7题
`<h1>` 标签可以在一个页面中多次使用，没有数量限制。

<details>
<summary>点击查看答案</summary>

**答案：✗ 错误**

解析：虽然浏览器允许多个 `<h1>`，但**最佳实践是一个页面只使用一个 `<h1>`**，用于定义页面的主标题。这有利于 SEO（搜索引擎优化）和屏幕阅读器的使用。其他标题应按层级使用（h1→h2→h3）。

</details>

---

### 第8题
`<img>` 标签的 `alt` 属性是可选的，没有实际用途。

<details>
<summary>点击查看答案</summary>

**答案：✗ 错误**

解析：`alt` 属性非常重要！它的作用包括：
1. 图片加载失败时显示替代文本
2. 屏幕阅读器为视障用户读取图片内容
3. 有利于 SEO（搜索引擎无法"看到"图片，但可以读取 alt 文本）

</details>

---

### 第9题
`<div>` 是块级元素，`<span>` 是行内元素。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：正确。`<div>` 独占一行，用于页面布局和分块；`<span>` 不独占行，用于行内文本的样式控制。这是两者的核心区别。

</details>

---

### 第10题
`<!DOCTYPE html>` 声明必须放在 HTML 文档的第一行。

<details>
<summary>点击查看答案</summary>

**答案：✓ 正确**

解析：正确。`<!DOCTYPE html>` 必须位于文档的最顶部，用于告诉浏览器使用 HTML5 标准解析页面。如果省略，浏览器可能进入"怪异模式"（quirks mode），导致页面渲染不一致。

</details>

---

## 学习总结

通过本教程，你已经学习了：

✅ HTML 的核心概念（标签、元素、属性、语义化）
✅ 标准文档结构（`<!DOCTYPE>`、`<html>`、`<head>`、`<body>`）
✅ 基础语法规则（双标签、单标签、属性写法、元素分类）
✅ 常用标签（文本、链接、图片、列表、语义化标签）
✅ 表单基础（input类型、表单控件）

### 下一步学习建议

1. **练习**：手写一个完整的HTML页面（个人简历、博客首页）
2. **深入学习 CSS**：学习如何美化HTML页面
3. **学习 JavaScript**：学习如何给页面添加交互功能
4. **项目实践**：做一个静态网站（个人作品集、产品展示页）

---

*学习资料来源：MDN Web Docs、W3C HTML 标准*
