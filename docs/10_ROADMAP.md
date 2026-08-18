# 10 — Roadmap

状态：**V1 Roadmap — Wave 1 Core Chain Complete / Wave 2 Active**

最后更新：2026-08-18

## Phase 0 — 项目记忆与工程治理

状态：**Completed / continuously maintained**

已建立：

- `AGENTS.md`
- 项目索引 / Blueprint / Product Spec / Design System
- Tech Architecture / Database / AI / Business Rules
- Decision Log / Current State / Roadmap
- ChatGPT Project Instructions / Handoff
- `docs/12_REUSE_AND_REFERENCES.md`
- `docs/13_WAVE1_CONTRACT_INTEGRATION.md`

项目级 **Research Before Build / Reuse First** 持续生效。

## Phase 1 — Foundation

状态：**Completed / Merged**

- Foundation PR #1 已进入 `main`。
- Next.js / TypeScript / App Router / Tailwind / shadcn/ui 基础工程已建立。
- PostgreSQL / Supabase foundation schema、shared Domain Contracts、CI 与版本字段体系已建立。

## Wave 1.5 — Shared Contract Integration

状态：**Completed / Merged**

PR #7 已完成 shared Contract 收敛：

- canonical `BaziDerivedFeatures`
- Birth resolved instant / UTC offset
- shared calculation context / result
- unified root test contract
- Reuse First governance

Wave 1.5 已完成历史使命，不再是当前开发 Gate。

## Wave 1 — Core Technical Chain

状态：**Completed / Merged to main**

核心链：

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

### Completed merges

- PR #4 Birth normalization — Merged
- PR #5 Bazi Engine V1 — Merged
- PR #3 Interpretation V0.2 — Merged
- PR #6 Supabase Core — Merged

最终主线合并顺序完成至：

`63aa9f5d32947ceb6b5a491a4aed77b0eba448fa` — PR #6 Supabase Core Merge Commit。

### Wave 1 cumulative acceptance

- Birth：14/14 passed
- Bazi：22/22 passed
- Interpretation：9/9 passed
- Backend：19/19 passed
- skipped：0（Wave 1 核心链最终累计验收口径）

相关最终 feature HEAD 的 GitHub Actions 均为 success，统一验收流程：

```text
npm ci
→ lint
→ typecheck
→ npm test
→ build
```

## Wave 2 — Integration / Productization

状态：**Active**

Wave 2 从已经进入 main 的核心 deterministic / persistence 链继续向真实产品闭环推进。

本 Roadmap 只记录已经明确的边界；具体任务由 00 号总调度 / 用户分配，不在本文件擅自扩张范围。

### A. Supabase Live Integration

状态：**Pending**

Supabase Core **Code Layer 已完成**，但真实 Supabase 项目尚未完成 live integration。

Wave 2 后续需要：

- 创建 / 确认 Supabase Project
- 配置真实 env / server secrets
- link project
- apply migrations
- Auth live configuration
- RLS live verification
- CRUD / Birth / Bazi persistence end-to-end verification

完成这些之前，不得把 backend 描述为 Production-connected。

### B. Traditional Pattern / 格局

状态：**Research complete / Production implementation pending**

Draft Research PR #9 已完成 taxonomy 与 ownership research。

当前 Gate：

- 不自动合并研究结论为生产算法。
- 不使用 `max(Ten-God distribution)` 代替传统格局判断。
- `TraditionalPatternResult` 若进入生产，应走 deterministic fact ownership + explicit rule profile。
- `personality-map/0.3.0` 不因 research 完成自动启用。

### C. AI System

状态：**Research complete / Formal implementation pending**

Draft Research PR #8 已完成 Bazi AI / Skill / MCP benchmark。

下一阶段正式 AI System 仍需单独实现并验收：

- provider / gateway boundary
- versioned scenario prompts
- context assembler
- structured output validation
- report generation runtime
- advisor runtime
- memory boundary
- failure / retry / safety handling

`BaziCalculationResult` 继续作为 deterministic source of truth；LLM 不排盘。

### D. 05 Visual / UX

状态：**Independent iteration / acceptance pending**

PR #2 仍 Open / 未合并。

05 继续：

- 视觉方向
- 角色画风
- archetype presentation layer
- mobile / desktop product UI

但不得把 Draft Traditional Pattern research 直接硬编码成最终人格体系。

### E. Payment / Commercial Entitlement

状态：**Pending**

仍需完成：

- payment provider selection
- order / webhook idempotency
- ¥9.9 等值 full report entitlement
- ¥29.9 等值 10-advisor-credit entitlement
- wallet / ledger atomic server-side operations

## Phase 2 — Free Bazi Test Product Loop

目标：让真实用户完成：

```text
Birth input
→ normalization
→ deterministic Bazi
→ interpretation
→ result UI
```

核心 Engine / Interpretation 已具备主线能力；Wave 2 需要把真实 UI、live persistence 与端到端流程接起来。

关键验收：

- 可复现
- Mobile / Desktop 可用
- 结果内容与 canonical facts 一致
- 无 LLM 自由排盘

## Phase 3 — Paid Full Personality Report

目标：形成第一笔真实商业交付。

商业基准：¥9.9 等值。

仍需：

- Full Report Schema
- formal AI report generation
- payment
- entitlement
- locked / unlocked UI
- failure recovery

## Phase 4 — AI Advisor 10-use Pack

目标：完成第二层付费产品。

商业基准：¥29.9 等值 / 10 次。

仍需：

- Advisor production UI
- structured deterministic context injection
- conversation persistence
- credit ledger
- atomic deduction / compensation
- memory / safety / retry boundary

## Phase 5 — Analytics / Conversion Optimization

状态：Pending

- funnel events
- report conversion
- payment failure
- advisor usage / repurchase
- CTA / pricing / content experiments

## Phase 6 — V1 Stable Launch

状态：Pending

验收至少包括：

- live Supabase / Auth
- production payment
- permissions / RLS
- Mobile / Desktop
- report generation recovery
- advisor credit accuracy
- privacy / terms
- monitoring
- Vercel production deployment

## V1 范围不变

当前仍只做：**八字**。

在商业闭环得到数据验证前，不提前加入紫微、奇门、塔罗、面相、手相、风水、社区或真人大师平台。
