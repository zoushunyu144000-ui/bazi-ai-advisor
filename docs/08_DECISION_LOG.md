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
状态：Approved / Active

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

最后更新：2026-08-18
