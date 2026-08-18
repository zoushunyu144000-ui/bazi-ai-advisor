# 10 — Roadmap

状态：**V1 Roadmap — Wave 2 Active**

最后更新：2026-08-18

## Phase 0 — 项目记忆与工程治理

状态：**Completed / continuously maintained**

核心治理：GitHub source of truth、`AGENTS.md`、Current State、Roadmap、Decision Log、Reuse Registry、Contract docs、Research Before Build / Reuse First。

## Phase 1 — Foundation

状态：**Completed / Merged**

Next.js / TypeScript / Tailwind / shadcn、Supabase foundation、shared Domain、CI、版本字段均已建立。

## Wave 1 — Core Technical Chain

状态：**Completed / Merged**

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

PR #4 / #5 / #3 / #6 均已进入 main。

## Wave 2 — Integration / Productization

状态：**Active**

### A. Supabase Live Integration

状态：**Pending**

Core Code Layer 已完成；仍需真实 Supabase link、remote migration、Auth/RLS/live CRUD/E2E。

### B. Traditional Pattern / 格局

状态：**Research merged / Production implementation pending**

PR #9 只归档 taxonomy / ownership research；不自动变成 production algorithm，也不自动启用 `personality-map/0.3.0`。

### C. AI System

状态：**Formal V1 implementation on Draft PR #13**

PR #8 Research 已结束。PR #13 正式实现：

- Provider Port + server-only Vercel AI SDK adapter
- ContextAssembler
- versioned report/advisor prompts
- structured schema + evidence/safety validation
- retry / repair
- Full Personality Report runtime
- Advisor runtime
- bounded memory
- Billing Port boundary
- AI tests

继续不变量：LLM 只解释 `BaziCalculationResult + PersonalityProfile`，不得排盘。

PR #13 合并前仍需 CI 全绿与 review；即便代码 merge，也不等于真实 production Provider 已配置。

### D. Billing / Payment

状态：**Shared Contract merged / implementation pending**

PR #11 已进入 main。

冻结链路：

```text
Provider Event
→ Order / Purchase
→ ReportEntitlement OR credits

Advisor:
reserve
→ AI outside DB transaction
→ validate + persist
→ commit
failure → release
```

后续：

1. 08：Billing forward migration / RLS / indexes / atomic reserve-commit-release RPC
2. 09：BillingService / Provider Adapter / verified webhook / fulfillment
3. 07：把当前 Billing Port 接到 trusted 08/09 implementation
4. UI：只消费 trusted entitlement / billing read path

### E. Visual / UX

状态：**Independent iteration / acceptance pending**

PR #2 继续独立验收。

## Phase 2 — Free Bazi Test Product Loop

目标：

```text
Birth input
→ normalization
→ deterministic Bazi
→ interpretation
→ result UI
```

Engine/Interpretation 已进入 main；仍需最终 UI、live persistence 与 E2E。

## Phase 3 — Paid Full Personality Report

商业基准：¥9.9 等值。

Formal AI Report V1 code 已在 Draft PR #13；上线闭环仍需：

- PR #13 merge
- real provider config
- ReportEntitlement persistence/API
- payment fulfillment
- locked/unlocked UI
- failure/recovery

## Phase 4 — AI Advisor 10-credit Pack

商业基准：¥29.9 等值 / 10 credits。

已冻结：verified `advisor_10` 每 quantity +10；一次 successful committed request -1；terminal failure release。

Advisor runtime code 已在 Draft PR #13；上线仍需：

- 08 atomic reservation / commit / release
- 09 trusted Billing API
- real AI provider
- UI / streaming or request UX
- production observability / rate-limit / recovery

## Phase 5 — Analytics / Conversion Optimization

状态：Pending

- funnel events
- report conversion
- payment failures
- advisor usage / repurchase
- prompt/model cost and latency
- CTA / pricing / content experiments

## Phase 6 — V1 Stable Launch

状态：Pending

至少验收：

- live Supabase / Auth / RLS
- production payment
- production AI Provider
- report generation recovery
- advisor credit accuracy under concurrency/retry
- permissions
- Mobile/Desktop
- privacy / terms
- monitoring
- Vercel production deployment

## V1 范围

仍只做：**八字**。

商业闭环验证前，不提前加入紫微、奇门、塔罗、面相、手相、风水、社区或真人大师平台。
