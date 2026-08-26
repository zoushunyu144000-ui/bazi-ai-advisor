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

所有 AI 工程窗口必须遵守根目录 `AGENTS.md`：开始前读取项目索引、当前状态与相关专题文档；完成后更新 Current State、Decision Log 和必要的专题文档。

### 原因

保证任意新窗口都能接班，避免信息只存在于被压缩的聊天上下文中。

---

## D-005 — 排盘计算与 LLM 解释分离

日期：2026-08-17
状态：Architecture Principle

### 决定

四柱、历法与核心排盘数据使用确定性代码 / 可靠算法得到；LLM 负责解释、组织报告和顾问回答。

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

具体 package versions 以 `package.json` 为准；外部 Supabase / Vercel / Payment / AI Provider 尚未因为本决策而自动连接。

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

保证历史结果可复现、映射规则与 Prompt 可回滚、报告 schema 可迁移，并支持后续灰度 / A-B 实验。

### 影响

后续生成 chart / derived features / report 的窗口不得静默移除这些版本信息；若版本语义变化，应新增 Decision Log 并协调 `types/domain/`。

---

## D-008 — Foundation 合并后统一以最新 main 作为 Wave 1 开发基线

日期：2026-08-18
状态：Approved / Historical Wave 1 baseline

### 决定

Foundation PR #1 正式合并 `main` 后，Wave 1 所有开发窗口统一从最新 `main` 创建独立 feature branch。

### 原因

保证并行窗口共享同一工程地基，减少旧基线与 Contract 漂移。

### 影响

该决定完成了 Wave 1 的分支治理使命；Wave 2 继续沿用“从最新 main 分叉”的原则。

---

## D-009 — 跨窗口转发消息统一使用代码块

日期：2026-08-18
状态：Approved / Active

### 决定

凡需要用户把一段消息复制并转发给另一个 GPT、Codex 或项目窗口时，AI 必须把完整可转发正文放进独立 Markdown 代码块中。

若需要分别转发给多个窗口，则每个窗口使用独立代码块，并在代码块外标明目标窗口。

### 原因

代码块提供更稳定的一键复制体验，减少移动端漏复制、格式破坏和人工整理。

### 影响

适用于跨窗口 Handoff、任务分发、状态汇报和提示词转交。

---

## D-010 — 02 是 canonical BaziDerivedFeatures 唯一传统命理事实来源

日期：2026-08-18
状态：Approved / Historical — authority semantics superseded by D-021

### 决定

02 Bazi Engine 负责：

```text
BirthProfile
→ BaziChart
→ canonical BaziDerivedFeatures
```

以下事实不得由 04 Interpretation 再建立第二套计算：

- 五行分布
- 十神分布
- 日主强弱
- 季节结构

`WeightedElementScore.score` 与 `WeightedTenGodScore.score` 统一为 0–100 percentage scale；`confidence` 使用 0–1。

04 可以计算 Interpretation-only signals，但这些不属于第二套 `BaziDerivedFeatures`。

### 原因

避免 02 与 04 对同一传统命理事实产生互相矛盾的数据与 score scale。

### 影响

数据库只保存 canonical 02 facts；04 消费 canonical facts。

> 2026-08-23 clarification：D-021 已 supersede 本决策中“当前 legacy `BaziDerivedFeatures` numeric / strength fields 属于 Traditional Pattern authority”的语义。Bazi Engine ownership 与 Interpretation 不得建立第二套事实模型的原则继续有效。

---

## D-011 — Birth 已解析 UTC instant 是 DST overlap 的下游 source of truth

日期：2026-08-18
状态：Approved / Active

### 决定

共享 `BirthProfile` 使用：

- `resolvedBirthInstant?: ISODateTime`
- `utcOffsetMinutesAtBirth?: number`

03 Birth 一旦完成 DST overlap disambiguation，应写入这两个字段；02 必须使用 resolved instant，不得再次猜 occurrence；08 必须持久化并完整读取。

### 原因

避免用户已确认的 DST occurrence 在下游被重新解析成另一个 instant。

### 影响

`resolvedBirthInstant` 是下游 deterministic calculation 的 canonical instant；unknown birth time / legacy records 允许字段缺失。

---

## D-012 — Shared Bazi calculation context 必须可完整持久化与读回

日期：2026-08-18
状态：Approved / Active

### 决定

共享 Domain 使用：

- `BaziRelation`
- `BaziLuckStructure`
- `BaziCalculationContext`
- `BaziCalculationResult`

定义：

```text
BaziCalculationContext
= BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]
+ BaziLuckStructure

BaziCalculationResult
= BaziCalculationContext
+ BaziDerivedFeatures
```

`BaziChart` 保持纯命盘结构。08 必须保证 metadata、relations、luck、derived features 保存与读取路径对称。

### 原因

保证 02 → 08 → 04 / 07 链路不丢 deterministic context。

### 影响

07 后续只消费共享 result / context，不自己重算命理上下文。

---

## D-013 — Root npm test 聚合所有 Wave 1 模块测试

日期：2026-08-18
状态：Approved / Active

### 决定

Root 测试入口统一：

- `npm run test:birth`
- `npm run test:bazi`
- `npm run test:interpretation`
- `npm run test:backend`
- `npm test`：顺序执行以上全部测试

CI 必须在 typecheck 后、build 前运行 `npm test`。

### 原因

防止各 feature PR 覆盖 root `test` 导致其他模块测试消失。

### 影响

后续 Wave 2 继续保留统一 root test / CI contract。

---

## D-014 — V1 暂不扩大 shared PersonalityDimension

日期：2026-08-18
状态：Approved / Active

### 决定

共享 `PersonalityDimension` V1 保持核心字段：

- `key`
- `label`
- `score`
- `confidence`
- `evidenceKeys`

04 的 contributors、positiveExpression、stressExpression、explanationCodes 暂留 Interpretation module-local `dimensionDetails`。

### 原因

当前跨模块消费尚未证明需要扩大公共 API，避免过早增加 Report / DB / UI 耦合。

### 影响

未来若 first-class persistence 明确需要，再新增 Contract change 与 Decision Log。

---

## D-015 — Research Before Build / Reuse First

日期：2026-08-18
状态：Approved / Active

### 决定

所有重要工程模块和重要依赖选型必须执行 Research Before Build / Reuse First。

固定优先级：

```text
成熟可靠库直接复用
>
Adapter 封装成熟实现
>
参考成熟实现补齐少量业务逻辑
>
最后才自行从零实现
```

开发前至少调查并记录 GitHub / npm / API / MCP / skill / 平台能力、License、维护状态、测试、文档、边界、Adapter 可行性、风险与替代方案。

所有重要外部依赖与参考项目统一登记到 `docs/12_REUSE_AND_REFERENCES.md`。

### 原因

避免多窗口重复造轮子和基础事实漂移，降低算法错误与维护成本。

### 影响

成熟历法、时区、Auth、DB、UI primitives 等能力优先复用并通过明确边界接入。

---

## D-016 — Wave 1 核心技术链完成，项目进入 Wave 2

日期：2026-08-18
状态：Approved / Active

### 决定

以下 Wave 1 核心链已全部正式合并 `main`：

```text
Birth
→ Bazi Engine
→ Interpretation
→ Supabase Persistence
```

对应 Merge：

- PR #4 Birth：Merged
- PR #5 Bazi Engine：Merged
- PR #3 Interpretation V0.2：Merged
- PR #6 Supabase Core：Merged
- PR #6 Merge Commit：`63aa9f5d32947ceb6b5a491a4aed77b0eba448fa`

项目阶段自此进入 **Wave 2**。

同时固定以下边界：

1. **Supabase Core Code Layer 已完成，但 Supabase Live Integration 尚未完成。**
2. **Traditional Pattern / 格局研究已完成，但尚未进入生产算法。** Draft Research PR #9 不自动成为生产实现，`personality-map/0.3.0` 不自动启用。
3. **AI Benchmark / Research 已完成，但正式 AI System 尚未实现。** Draft Research PR #8 不等于 `modules/ai/**` production completion。
4. **05 Visual / UX 继续独立迭代。** PR #2 未合并，不因核心技术链完成自动获得 merge 资格。
5. Wave 2 继续遵守从最新 `main` 创建 feature branch、统一 root test / CI、Reuse First 与 shared Contract 治理。

### 原因

Wave 1 已完成 deterministic input → calculation → interpretation → persistence 的核心工程链路。下一阶段重点从“建立核心模块”转向 live integration、productization、AI / payment / UI integration 与端到端商业闭环；必须明确 Code Layer / Research 与 Production-ready 之间的边界，避免后续窗口误报完成度。

### 影响

- `docs/09_CURRENT_STATE.md` 将 Wave 1 核心链标记为完成并进入 main。
- `docs/10_ROADMAP.md` 将当前阶段切换为 Wave 2 Active。
- Supabase Live、Traditional Pattern production、Formal AI System、05 visual acceptance、真实支付与 Production deployment 继续作为未完成工作存在。
- D-001 的 V1 范围不变：仍只做八字。

---

## D-017 — Wave 2 Billing Contract Gate

日期：2026-08-18
状态：Approved Contract / Implementation Pending

### 决定

Payment / Credits Research 中 `CCR-09-001` ～ `CCR-09-006` 正式裁决如下：

1. **CCR-09-001 APPROVED**：新增 durable Provider Event Inbox，唯一 identity 为 `(provider, provider_event_id)`；Browser return page 永远不是 fulfillment authority。
2. **CCR-09-002 APPROVED**：Full Report 使用 first-class relational `ReportEntitlement`，稳定 identity 为 `(user_id, product_code, resource_id)`，不得依赖 JSONB 模糊 gating。
3. **CCR-09-003 MODIFIED**：V1 使用 `advisor_requests` 作为 request + reservation aggregate，状态 `reserved → committed | released`；不增加通用 `credit_reservations` 表，不用长 DB transaction 包住 LLM。
4. **CCR-09-004 MODIFIED**：保留现有 ledger `entry_type = purchase|usage|refund|adjustment|bonus`，新增 canonical `reason + reference_type + reference_id`；ledger immutable，wallet 是 committed projection。
5. **CCR-09-005 APPROVED**：`Purchase` 升为 first-class shared Domain read model；Report gating 读取 `ReportEntitlement`。
6. **CCR-09-006 REJECTED rename**：serialized ProductCode 正式冻结为 `personality_report` / `advisor_10`，不引入 `REPORT_FULL` / `ADVISOR_10_CREDITS` 第二套 codes。

Advisor V1 的 billing semantics 同时冻结：verified `advisor_10` purchase 每 quantity grant `+10` credits；一次成功且 committed 的 Advisor request 消耗 exactly `1` credit；terminal failure release reservation，不造成永久 credit loss。

详细 Contract、transaction、idempotency、DB target 与 handoff 见 `docs/14_BILLING_CONTRACT_INTEGRATION.md`。

### 原因

Wave 1 已有 wallet / ledger / order / purchase 基础，但 Payment Research 证明仅靠 Order idempotency、JSONB entitlement 和“请求结束后再扣 credit”不足以保证 webhook replay、并发多标签页、AI timeout/retry 和报告权限的一致性。

同时，现有 ProductCode 与 ledger coarse vocabulary 已进入 shared Domain、schema 与 migration history；无收益重命名只会增加迁移和 API 兼容成本。

### 影响

- 01 负责 Shared Domain / architecture contract，不实现 Provider 或 migration。
- 08 负责 forward DB migration、RLS、constraints、indexes 与 atomic RPC / transaction primitives。
- 09 负责 BillingService、Provider Adapter、webhook verify/normalize 与 payment fulfillment orchestration。
- 07 负责 Advisor runtime，通过 trusted reserve / commit / release API 消费 credit，不直接写 Wallet / Ledger。
- Browser 不得 set paid、grant/deduct credits 或 unlock/revoke report。
- 真实 Provider 仍需独立 Reuse First / merchant onboarding 验证；本决策不等于已选择或接入 Stripe。

---

## D-018 — AI 项目执行统一采用 Product → Roadmap → Current State → Task → Build → Review → Freeze → Current State

日期：2026-08-22
状态：Approved / Active

### 决定

本仓库所有正式 AI / GPT / Codex / Agent 开发任务统一采用以下项目闭环：

```text
PRODUCT
→ ROADMAP
→ CURRENT_STATE
→ TASK
→ BUILD
→ REVIEW
→ FREEZE
→ CURRENT_STATE
```

完整执行规范见：

`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`

同时规定：

1. 不从聊天中的新想法直接跳到 BUILD；
2. 每轮必须先明确 Task Boundary，包括 Goal / In Scope / Out of Scope / Deliverables / Review Gate / Forbidden；
3. 一个 Task 可以做深，但不能无限横向扩 Scope；
4. Build 完成后必须经过 Scope / Product / Architecture / Engineering / Documentation Review；
5. Review 通过后重要决定才进入 Freeze；
6. Freeze 后其他 Agent 不得仅凭个人偏好重新推翻；
7. 每个真正改变项目状态的 Task 完成后必须更新 `docs/09_CURRENT_STATE.md`，并按需要推进 Roadmap / Decision Log / 专题 Contract；
8. 本仓库沿用现有编号化文档作为唯一 Source of Truth，不再并行创建重复的 `PRODUCT.md / ROADMAP.md / CURRENT_STATE.md / DESIGN_SYSTEM.md / DECISIONS.md`。

### 原因

此前多 Agent 并行开发容易出现范围蔓延、状态漂移、重复推翻冻结决定、Research / Prototype 被误当 Production Ready，以及重要结果只留在聊天窗口的问题。

该闭环把“产品是什么、准备做什么、现在在哪里、本轮只做什么、如何验收、何时冻结、如何回写状态”固定成仓库级执行协议。

### 影响

- 根目录 `AGENTS.md` 必须强制引用并执行该流程；
- `docs/00_PROJECT_INDEX.md` 注册该文档作为统一项目管理入口；
- 当前八字人格项目下一 P0 继续由 `docs/09_CURRENT_STATE.md` 与 `docs/10_ROADMAP.md` 决定；
- 任何 Agent 不能绕过当前 P0 去顺手开发 parked 功能。

---

## D-019 — Traditional Bazi Rule Profile V1 提案

日期：2026-08-22
状态：**Proposed — Superseded by D-020**

### 决定

基于 `docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`，形成：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

提议正式版本：

```text
rule_profile_version = ziping-v1.0.0
```

提议核心体系：

```text
子平月令格局法为主体
《子平真诠》作为格局结构主要规则来源
《渊海子平》+《三命通会》作为传统交叉参考
```

提案明确：

- 精确立春换年、精确“节”切月；
- 月令通过藏气层级与透干决定 Pattern Host，不用数值月支权重；
- `max(tenGodDistribution)`、candidate score、Personality Dimensions、LLM 不得参与传统格局裁决；
- 旺衰使用得令、得地 / 根、得势 / 得助、生克制化的 qualitative evidence，不显示身强百分比；
- regular patterns 为正官、七杀、正财、偏财、正印、偏印、食神、伤官；
- 建禄必须 exact Lu month position；月劫必须是 month-host 劫财；
- 成败破救采用 pattern-specific support / damage / rescue；
- Mixed、primary + secondary、no stable single pattern 均为合法结果；
- 从格与特殊格采用严格白名单；
- Evidence、Counter Evidence、Ambiguity 为 first-class contract。

D-019 当时保留 OA-01 ～ OA-07 Owner Approval Gate。该 Gate 已于 2026-08-23 由 D-020 完成。

### 原因

上一轮 Audit 已确认现有生产链没有完整 Traditional Pattern adjudication，而且关键 `SCHOOL_CHOICE` 必须先显式冻结，不能把某一流派或工程假设静默包装成传统共识。

### 影响

本提案现已由 D-020 supersede；历史提案保留以便追踪决策过程。

---

## D-020 — Traditional Bazi Rule Profile `ziping-v1.0.0` 正式冻结

日期：2026-08-23
状态：**Approved / Locked / Active**

Supersedes：`D-019`

### 决定

Owner 已明确批准 OA-01 ～ OA-07，并正式冻结：

```text
rule_profile_version = ziping-v1.0.0
```

Rule Profile Source of Truth：

`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`

#### OA-01 — Day Boundary

```text
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
```

#### OA-02 — Late Zi

```text
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
```

具体语义：23:00–23:59 日柱仍为当前 civil day，时支为子，时干按次日日干起子时；00:00–00:59 日柱进入新 civil day，时支为子，时干按新日日干起子时。

#### OA-03 — Time Standard / True Solar Time

```text
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1
```

接近时辰、日界、立春或节气边界时必须保留 ambiguity，不自动切换为真太阳时结果。

#### OA-04 — Month Host

```text
MONTH_HOST_BASE =
month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host
```

明确：

- 不使用 numeric month multiplier；
- `ziping-v1.0.0` 不使用 exact commander-day table authority；
- hierarchy 只选择 **base Host**；
- 后续 exposure context、combination / transformation、formation、damage / rescue、roots / strength、mixed / follow rules 可以改变最终 pattern verdict，但不能改写 base Host evidence。

#### OA-05 — Yangren

```text
YANGREN = FIVE_YANG_STEMS_ONLY
甲→卯
丙→午
戊→午
庚→酉
壬→子
```

五阴干不自动论真阳刃。

#### OA-06 — Day Master Strength

```text
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
```

使用得令、得地 / 通根、得势 / 得助、生克制化；禁止 personality percentage 或 numeric threshold authority。

#### OA-07 — Follow Structure

```text
FOLLOW_STRUCTURE_FINAL_VERDICT =
STRICT_FOLLOW_WEALTH
+
STRICT_FOLLOW_KILLING
```

其他 follow structures 仅 candidate / evidence-only / ambiguous / deferred。

### 同时冻结的结构规则

- 子平月令格局法为核心；
- 《子平真诠》为主要格局结构来源，《渊海子平》《三命通会》交叉参考；
- 8 regular patterns + Jianlu + Yuejie + five-yang Yangren structural host；
- Formation 使用 pattern-specific support / damage / rescue；
- `PRIMARY_WITH_SECONDARY / MIXED / NO_STABLE_SINGLE_PATTERN` 均合法；
- directional combination 必须保留 Host direction；
- `evidence[] / counter_evidence[] / ambiguities[]` 为 first-class；
- `max(tenGodDistribution)`、legacy candidate score、Personality Dimensions、LLM、产品均衡目标不得参与 Traditional verdict；
- 任何后续规则语义变化必须 bump `rule_profile_version`，不得 silent migration。

### 原因

OA-01 ～ OA-07 已由 Owner 显式裁决，Rule Profile 的关键流派选择、时间口径、月令 Host、旺衰、阳刃与从格范围已经具备稳定、可版本化、可实现与可测试的 V1 contract。

### 影响

```text
Traditional Bazi Rule Audit = DONE
Traditional Bazi Rule Profile = LOCKED
TraditionalPatternResult Implementation = ALLOWED / NEXT P0
```

- `docs/09_CURRENT_STATE.md` 必须标记 Rule Profile LOCKED；
- `docs/10_ROADMAP.md` 下一 P0 移动到 TraditionalPatternResult Implementation；
- implementation 必须严格消费 `ziping-v1.0.0`，不得重新加入 experimental numeric weights；
- D-019 保留为历史 Proposed decision，不删除；
- Rule Profile Freeze 本身不表示 TraditionalPatternResult 已经 Production-ready。

---

## D-021 — TraditionalPatternResult V1 Contract 正式冻结 + Legacy BaziDerivedFeatures Authority 澄清

日期：2026-08-23
状态：**Approved / Locked / Active**

Related：`D-010`, `D-020`  
Supersedes：**D-010 中关于当前 legacy `BaziDerivedFeatures` numeric / strength fields 属于 Traditional Pattern authority 的语义；不 supersede Bazi Engine ownership / anti-duplication 原则。**

### 决定

Owner 已完成 `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md` Review，并批准 TP-01 ～ TP-07 与四项 Required Contract Revisions。

正式冻结：

```text
pattern_schema_version = traditional-pattern-result/1.0.0
status = LOCKED / ACTIVE
rule_profile_version = ziping-v1.0.0
```

#### TP-01 — Ownership

```text
TraditionalPatternResult owner = modules/bazi/traditional-pattern/**
Interpretation = consumer only
LLM = no pattern judgment authority
```

#### TP-02 — Input Authority Isolation

```text
TraditionalPatternInput
= BirthProfile
+ BaziChart
+ BaziCalculationMetadata
+ BaziRelation[]

Current legacy BaziDerivedFeatures
= excluded from Traditional Pattern authority input
```

Bazi Engine 继续是 deterministic Bazi facts 的 canonical owner。

但当前 legacy：

```text
dayMasterStrength
elementDistribution
tenGodDistribution
support-ratio-derived semantics
confidence
```

只能保留作 compatibility / analytics / Interpretation support；它们不定义 `ziping-v1.0.0` 的 Month Host、qualitative strength、pattern formation 或 follow verdict。

D-010 的“Interpretation 不得自己建立第二套 deterministic facts”继续有效；D-010 中把当前 numeric / distribution / strength fields 称为 Traditional Pattern authority 的语义由 D-021 supersede。

#### TP-03 — Schema Version

```text
pattern_schema_version = traditional-pattern-result/1.0.0
```

与 `rule_profile_version` 独立版本化。

#### TP-04 — No UNKNOWN / NONE Pattern Sentinel

```text
primaryPattern = null
+ structured patternStatus
```

不得发明 `UNKNOWN / NONE` 格局。

#### TP-05 — Evidence Sufficiency

仅：

```text
sufficient
partial
insufficient
indeterminate
```

不得使用 numeric traditional confidence / percentage authority。

#### TP-06 — Approximate Birth Time

没有用户 / source 提供明确 uncertainty range 时，不得自造 ±15 / ±30 / ±60 分钟等窗口。

无明确范围：

```text
approximate_time_unbounded
```

若可能跨关键边界，升级 material / blocking ambiguity。

#### TP-07 — Shadow Independence Is Temporary

Phase A / Phase B 允许 `TraditionalPatternResult` 以 chartId 独立版本化进行 shadow migration。

但在 Authority Cutover 前必须进入 canonical Bazi / traditional-result boundary；不得永久保留 parallel authority trees。

### Required Revision 1 — Nullable Base Month Host

冻结：

```text
baseMonthHost: TraditionalBaseMonthHost | null
```

Invariant：

```text
baseMonthHost = null
=> material/blocking ambiguity must explain it
```

### Required Revision 2 — Primary Formation State

冻结：

```text
primaryFormationState: TraditionalFormationState | null
```

Invariants：

```text
primaryPattern != null => primaryFormationState != null
primaryPattern == null => primaryFormationState == null
```

Candidate 继续保留各自 `candidate.formationState`。

### Required Revision 3 — Determinism / Audit Timestamp

冻结：

```text
computedAt: ISODateTime
```

为 non-semantic audit metadata。

`computedAt` 明确排除于：

```text
deterministic ID
canonical hash
canonical equality
semantic determinism / byte-stability assertion
```

Determinism 测试比较 canonical semantic result，而不是包含 execution timestamp 的 raw object。

### Required Revision 4 — Legacy Authority Supersession

`types/domain/bazi.ts` 的 legacy `BaziDerivedFeatures` 注释同步澄清：字段保留，但不再描述为 `ziping-v1.0.0` Traditional Pattern authority。

不删除 legacy fields，不破坏 Interpretation compatibility。

### Production Profile Prerequisite

当前 production calculation profile 仍是：

```text
civil-local-jieqi-v1
```

而 TraditionalPatternResult authority 必须消费：

```text
ziping-v1.0.0
```

因此实现必须 fail closed：

```text
legacy profile
=> RULE_PROFILE_MISMATCH
=> do not emit ziping-v1.0.0 verdict
```

Build 允许开始，但第一阶段必须建立 versioned `ziping-v1.0.0` calculation path，包括 frozen late-Zi hour-stem behavior。不得 silent reinterpret legacy chart。

### 原因

Review 发现原 Proposed Contract 有四个可导致未来实现歧义的问题：阻塞月令边界时 Host 不可强制非空；mixed/no-primary 时顶层 formation state 无明确主体；execution timestamp 与 semantic determinism 冲突；D-010 / legacy domain wording 可能让未来 Agent 恢复 numeric authority。

上述修订解决这些 contract contradictions，同时不修改已冻结的传统规则体系。

### 影响

```text
Rule Audit = DONE
Rule Profile ziping-v1.0.0 = LOCKED
TraditionalPatternResult Spec traditional-pattern-result/1.0.0 = LOCKED
TraditionalPatternResult Implementation = NEXT / ALLOWED
```

同时：

- Production Build 可以从 Contract / profile guard 开始；
- legacy `civil-local-jieqi-v1` 不得产生 `ziping-v1.0.0` authority result；
- Authority Cutover 仍需 implementation Review + Golden QA + canonical boundary integration + Translation Review；
- PR #16 继续 Draft；
- 本 Freeze round 不修改 production logic。

---

## D-022 — Character Visual V2 严格采用 Owner 参考图并冻结为十个 Canonical IP

日期：2026-08-26
状态：Approved

### 决定

`docs/assets/character-style-master-v2.png` 成为 V2 唯一画风母版。Public Personality 继续冻结为 10 个名称，但正式角色合同统一为：

```text
10 Public Personalities
→ 10 fixed canonical characters
→ public/characters/v2/{ten_god}.png
```

角色性别属于品牌 IP，不跟随出生资料性别变化。V2 画风、色彩、动作与反例见 `docs/24_CHARACTER_STYLE_LOCK_V2.md`。

### 原因

Owner 明确否决了此前过暗、过饱和以及偏离参考图的生成方向，并要求严格复制其 City Observation Editorial 画风、重新生成 10 个完整 IP。现有 V1 二进制母版不可解码，正式角色目录仍为 0/10；代码中的 20 性别变体测试也与固定 IP 产品决策冲突。

### 影响

- V2 资产、网页与 Share Card 必须消费 canonical character，不再按用户性别切图；
- 出生性别继续只服务于真实的确定性命理规则，不从 Domain Contract 移除；
- Presentation V2 可与 TraditionalPatternResult 开发并行，但不得提前声称完成 Authority Cutover；
- V1 文档和目录保留为历史记录，不作为 V2 runtime source。

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

最后更新：2026-08-26
