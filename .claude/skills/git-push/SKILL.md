---
name: git-push
description: 一键完成 git add、commit、push 全流程。
---

## User Input

```text
$ARGUMENTS
```

## Goal

检查工作区变更，如有变更则自动完成 git add → git commit → git push。

## Workflow

1. **检查工作区状态**
   - 执行 `git status --porcelain` 检查是否有未提交的变更
   - 如无变更，输出 "工作区没有变更，无需推送。" 并结束

2. **执行 git add**
   - 执行 `git add -A` 暂存所有变更

3. **执行 git commit**
   - 如 `$ARGUMENTS` 非空，使用 `$ARGUMENTS` 作为 commit message
   - 如 `$ARGUMENTS` 为空，使用 LLM 生成一个简短的 commit message
   - 执行 `git commit -m "<message>"`

4. **执行 git push**
   - 执行 `git push`
   - 如 push 成功，输出 "推送完成：<commit hash> <message>"
   - 如 push 失败，输出错误信息

## Output style

- 简洁明了
- 显示关键步骤的执行结果
- 成功时显示 commit hash 和 message
