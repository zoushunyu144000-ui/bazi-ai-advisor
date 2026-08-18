# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库 / 分支 / PR / CI / 部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository / main 基线

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Foundation PR #1：Merged / Closed
- Wave 1.5 Contract Integration PR #7：Merged / Closed
- 本次状态同步前 `main` HEAD：`63aa9f5d32947ceb6b5a491a4aed77b0eba448fa`
- 该提交为 PR #6 Supabase Core Merge Commit。

## 2. Wave 1 核心技术链：已正式进入 main

Wave 1 核心 deterministic / persistence 链已经完成 Merge：

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

### PR #4 — Birth normalization

状态：**Merged / Closed**

- Merge Commit：`41c7faa8c7f8b063dea8bf2ae8d5aa79422792f3`
- Birth tests：**14/14 passed**
- DST overlap / gap、resolved instant、UTC offset persistence contract 已覆盖。
- provider adapter 仍保持 mockable / 非 live 调用边界。

### PR #5 — Deterministic Bazi Engine V1

状态：**Merged / Closed**

- Merge Commit：`de87b86e495aeac5a68a8e9c9a0de9433ec207d3`
- Bazi tests：**22/22 passed**
- LLM 不参与排盘。
- `BaziDerivedFeatures` 继续是 canonical 五行分布、十神分布、日主强弱事实来源。
- `tyme4ts@1.5.2` 继续通过 Adapter 隔离使用。

### PR #3 — Interpretation V0.2

状态：**Merged / Closed**

- Merge Commit：`6806cc5514048121a3ff1cebf4123800162b4939`
- Interpretation tests：**9/9 passed**
- 当前 mapping：`personality-map/0.2.0`
- 04 消费 `BaziChart + canonical BaziDerivedFeatures`，不重算第二套传统命理事实。
- Stable archetype machine layer 已建立；最终视觉角色 / 热梗名称仍属于 05 表现层。

### PR #6 — Supabase Core Data Layer

状态：**Merged / Closed**

- Merge Commit：`63aa9f5d32947ceb6b5a491a4aed77b0eba448fa`
- Backend tests：**19/19 passed**
- migration history、Auth bootstrap、RLS、SSR/browser/server-only clients、user-scoped repositories 已进入 main。
- BirthProfile 的 resolved instant / UTC offset 与完整 `BaziCalculationResult` 已有 persistence / read-back code path。

## 3. Wave 1 验收汇总

核心模块最终验收累计：

- Birth：**14/14 passed**
- Bazi：**22/22 passed**
- Interpretation：**9/9 passed**
- Backend：**19/19 passed**
- skipped：**0（Wave 1 核心链最终累计验收口径）**

相关最终 feature HEAD 均存在 GitHub Actions `success` 记录；统一 CI contract 为：

```text
npm ci
→ npm run lint
→ npm run typecheck
→ npm test
→ npm run build
```

本阶段验收结论：

- lint：success
- typecheck：success
- npm test：success
- build：success

说明：以上为 Wave 1 核心模块最终验收的累计结果，不把 Merge Commit 后不存在的额外 `main` 单次 workflow run 虚构为独立验收记录。

## 4. Supabase 状态边界

**Supabase Core Code Layer 已完成。**

已经进入 main 的是代码层能力，包括：

- migrations
- Auth bootstrap
- RLS
- browser / SSR / server-only client boundary
- repositories
- Birth / Bazi calculation persistence contract

但 **真实 Supabase Live Integration 尚未完成**。

仍需后续完成：

- 创建 / 确认真实 Supabase Project
- 配置 Project URL / publishable key / server secret
- Auth redirect URLs / SMTP 等真实 Auth 配置
- `supabase link`
- remote migration apply / `supabase db push`
- live RLS verification
- live Auth verification
- live CRUD / persistence round-trip verification

因此当前不得把 Supabase 状态描述为“已部署 / 已连接生产环境”。

## 5. Traditional Pattern / 格局研究

状态：**Research completed / Production algorithm not implemented**。

GitHub 当前存在 Draft Research PR #9：

- branch：`research/traditional-pattern-taxonomy`
- 只包含研究文档，不修改 `modules/bazi/**`、`modules/interpretation/**` 或 shared Domain Contract。
- 已研究月令 / 子平格局 taxonomy、regular patterns、建禄/月劫、组合结构与未来 `TraditionalPatternResult` 责任边界。

当前明确边界：

- Traditional Pattern **尚未进入生产算法**。
- 不得把 `max(Ten-God distribution)` 直接等同于传统格局。
- 不得因为研究完成就自动升级 `personality-map/0.3.0`。
- 若后续实现，传统格局事实原则上应由 deterministic Bazi layer 产生，再由 Interpretation 消费。

## 6. AI System 状态

状态：**Research completed / Formal AI System not implemented**。

GitHub 当前存在 Draft Research PR #8：

- branch：`research/ai-bazi-benchmark`
- 研究 Bazi AI / Skill / MCP / structured output / memory / report hierarchy / deterministic facts handoff。
- 研究结论保持 Reuse First，并建议以 `BaziCalculationResult` 为 canonical source of truth。

当前明确未完成：

- `modules/ai/**` 正式生产实现
- AI Provider live integration
- Prompt v1 / scenario prompt system
- structured output runtime validation
- Advisor production flow
- memory production flow

因此不得把“AI research 完成”写成“AI System 已完成”。

## 7. 05 Visual / UX

05 仍在独立视觉迭代。

- PR #2 `design/product-visual-v1` 当前仍为 Open / 未合并。
- 视觉方向与角色语言继续独立验收。
- 05 不得把 Traditional Pattern research taxonomy 硬编码成最终人格命名。
- 最终角色绑定继续通过 stable `archetype_code` / approved pattern mapping 接入。

## 8. 共享架构不变量

继续生效：

1. Birth 先完成 normalized / resolved birth facts。
2. 02 Bazi Engine 是 canonical traditional Bazi facts 唯一 deterministic source。
3. 04 Interpretation 消费 canonical facts，不重算第二套五行 / 十神 / 日主强弱。
4. 08 Persistence 必须无损保存 deterministic result / relations / luck / metadata。
5. LLM 不得从原始出生日期时间自由排盘。
6. 重要依赖遵守 Research Before Build / Reuse First。
7. shared `types/domain/**` 语义修改必须协调影响面。

## 9. 当前阶段

**Wave 1 核心技术链已完成并正式进入 main。**

项目现在进入：

# **Wave 2**

Wave 2 的具体业务任务由 00 号总调度 / 用户分配；本次状态同步不擅自增加业务功能。

当前主要未完成边界包括：

- Supabase Live Integration
- Traditional Pattern production algorithm
- Formal AI System
- 05 Visual acceptance / merge
- real payment
- production deployment / end-to-end live integration

后续开发窗口仍必须先同步最新 `main`，再从最新 `main` 创建独立 feature branch。
