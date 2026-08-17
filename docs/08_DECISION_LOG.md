# 08 — Decision Log

本文件记录已经做出的重要产品、商业、技术和设计决定，以及决定原因。不要删除历史决定；如有变化，新增一条 Superseded 决策并指向新决定。

---

## D-001 — V1 只开发八字

日期：2026-08-17
状态：Approved

### 决定

第一版产品只做八字。

暂不加入：
- 奇门
- 紫微斗数
- 塔罗
- 面相
- 手相
- 风水
- 社区
- 真人大师平台

### 原因

第一阶段目标是尽快验证商业闭环，而不是构建大而全的命理平台。减少范围有助于更快上线、测试转化和迭代。

---

## D-002 — V1 基础付费漏斗

日期：2026-08-17
状态：Approved at product concept level

### 决定

商业路径：

免费测试
→ ¥9.9 等值价格解锁完整人格报告
→ ¥29.9 等值价格购买 10 次 AI 顾问

### 目标

逐步达到月收入人民币 10,000 元以上。

### 说明

具体海外币种价格、支付供应商、税费与促销策略仍待确认。

---

## D-003 — GitHub 作为长期项目记忆与事实来源

日期：2026-08-17
状态：Approved

### 决定

不依赖单个 ChatGPT 窗口长期保存项目关键事实。

采用三层模式：

1. GitHub：长期项目记忆、代码和事实来源
2. ChatGPT Project：协作工作空间与跨窗口辅助上下文
3. 单个 Chat：临时讨论、分析、执行和 Debug

### 原因

聊天上下文存在长度限制、压缩和多窗口漂移风险。重要蓝图、规则、架构、设计、决策和状态必须版本化并可重新读取。

---

## D-004 — AI 任务开始前读取项目记忆，完成后回写

日期：2026-08-17
状态：Approved

### 决定

所有 AI 工程窗口必须遵守根目录 `AGENTS.md`：

开始前读取项目索引、当前状态与相关专题文档；完成后更新 Current State、Decision Log 和必要的专题文档。

### 原因

保证任意新窗口都能接班，避免信息只存在于被压缩的聊天上下文中。

---

## D-005 — 排盘计算与 LLM 解释分离

日期：2026-08-17
状态：Architecture Principle

### 决定

四柱、历法与核心排盘数据使用确定性代码/可靠算法得到；LLM 负责解释、组织报告和顾问回答。

### 原因

避免模型幻觉导致基础命盘错误，并允许计算结果测试、复现与版本化。

---

## D-006 — V1 Foundation 技术栈

日期：2026-08-17
状态：Approved / Implemented in PR #1

### 决定

V1 Foundation 采用：

- Next.js + TypeScript + App Router
- Tailwind CSS + shadcn/ui 基础配置
- PostgreSQL / Supabase
- Supabase Auth
- Vercel 作为部署目标
- Vercel AI SDK + 可替换 Provider / Gateway 边界
- PostHog 作为 Analytics 预留

具体 package versions 以 `package.json` 为准；外部 Supabase/Vercel/Payment/AI Provider 尚未因为本决策而自动连接。

### 原因

该组合满足单体 MVP 快速交付，同时保留确定性八字 Engine、AI Provider、支付与分析层的清晰边界。

### 影响

后续窗口应优先复用当前基础目录与 Contracts，不另起不兼容的平行架构。

---

## D-007 — 生成型数据统一版本字段

日期：2026-08-17
状态：Approved / Implemented in foundation contracts

### 决定

跨 Engine、Interpretation、Report 与 AI 层统一使用：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

### 原因

保证历史结果可复现、映射规则与 Prompt 可回滚、报告 schema 可迁移，并支持后续灰度/A-B 实验。

### 影响

后续生成 chart / derived features / report 的窗口不得静默移除这些版本信息；若版本语义变化，应新增 Decision Log 并协调 `types/domain/`。

---

## 决策模板

复制以下结构新增决策：

```md
## D-XXX — 决策标题

日期：YYYY-MM-DD
状态：Proposed / Approved / Superseded / Rejected

### 决定
...

### 原因
...

### 影响
...
```

最后更新：2026-08-17
