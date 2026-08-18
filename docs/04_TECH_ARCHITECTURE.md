# 04 — Technical Architecture

状态：Foundation 已合并 `main`；Wave 1.5 正在统一 Wave 1 的共享 Contract 与集成边界。

## 1. 架构目标

V1 技术架构优先级：

1. 尽快跑通完整商业闭环
2. 可维护、可观测、可回滚
3. AI Prompt / 报告 / 权益均可版本化
4. 支持后续海外用户、多币种和扩容
5. 不为了未来假设过度工程化

### 1.1 Research Before Build / Reuse First

所有重要模块在实现前必须先调查成熟外部能力，并把证据登记到 `docs/12_REUSE_AND_REFERENCES.md`。

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

架构上优先把第三方能力隔离在 Adapter / client / repository boundary 内，避免第三方数据结构直接污染 `types/domain/`。

不得为了“代码归自己”而无研究依据重复实现：历法、节气、干支、时区/DST 数据与基础转换、基础排盘能力、常见 UI primitives、认证、数据库基础能力。

若最终决定自研，必须在 PR/Handoff 记录已调查方案、License、维护状态、测试/文档成熟度、不采用原因、风险与替代方案。聊天窗口不得仅凭记忆选库。

## 2. 当前工程基线

实际代码以 `package.json` 与仓库配置为准：

- Web：Next.js `16.2.11`
- React：`19.2.6`
- TypeScript：`^5.8.0`，strict mode
- Routing：Next.js App Router
- CSS：Tailwind CSS `^4.1.0`
- UI 基线：shadcn/ui 配置文件 `components.json` + `lib/utils.ts`
- Database：PostgreSQL / Supabase 作为 V1 目标数据库
- Auth：Supabase Auth 作为 V1 目标认证方案
- AI：Vercel AI SDK `^6.0.0`，通过 provider / gateway adapter 保持模型可替换
- Deployment：Vercel；**当前尚未绑定本仓库的正式 Vercel Project，也未执行 Production 部署**
- Analytics：PostHog 环境变量已预留，尚未接入

Supabase、支付、AI Provider、PostHog 当前均不因为 Foundation 或 Wave 1 Contract 工作而自动连接真实 Production 服务。

所有重要外部依赖的 URL、License、维护状态、采用方式、风险、替代方案与版本，以 `docs/12_REUSE_AND_REFERENCES.md` 为依赖选型 source of truth。

## 3. 目录与逻辑模块

```text
app/                 App Router 与页面
modules/
  birth/             出生信息、地点、时区标准化
  bazi/              确定性排盘与 canonical Bazi facts
  interpretation/    canonical Bazi facts → 现代行为解释
  ai/                provider / gateway 适配边界
  billing/           订单、权益、钱包、顾问次数
  poster/            分享海报
  analytics/         产品分析边界
lib/                 通用工具
db/                  PostgreSQL / Supabase schema
types/domain/        跨窗口共享 Domain Contracts
tests/               模块测试与共享 fixtures
scripts/             共享工程脚本
```

## 4. Wave 1.5 核心数据流

```text
Birth input
  ↓
Birth normalization
  ↓
BirthProfile
  - timezone
  - resolvedBirthInstant?      ← 已消歧义的 canonical UTC instant
  - utcOffsetMinutesAtBirth?
  ↓
Deterministic Bazi Engine (02)
  ↓
BaziCalculationResult
  ├─ chart: BaziChart
  ├─ calculationMetadata: BaziCalculationMetadata
  ├─ derivedFeatures: BaziDerivedFeatures   ← canonical traditional facts
  ├─ relations: BaziRelation[]
  └─ luck: BaziLuckStructure
  ↓
Persistence / repository layer (08)
  ↓
Interpretation (04) / future AI Report & Advisor (07)
```

### 4.1 确定性计算 vs AI 生成

必须分离：

- 四柱、历法、五行/十神分布、日主强弱、季节结构、干支关系、大运：确定性代码 / 可测试算法
- 现代行为映射：确定性 Interpretation 规则
- 语言解释、报告组织、顾问建议：LLM / 规则结合

禁止把原始出生日期/时间直接交给 LLM，让模型自由生成四柱作为真实命盘。

### 4.2 确定性不等于从零自研

“Deterministic”表示输出由可测试、可复现的代码路径产生，不表示必须手写所有历法/节气/时区算法。

优先模式：

```text
成熟 calendar / timezone library
→ Adapter
→ 项目 rule profile
→ canonical Domain
```

项目只自行实现产品特有、流派特有、Contract 特有的规则层和 glue；成熟基础能力优先复用。

## 5. Canonical Bazi Facts 所有权

### 5.1 02 Bazi Engine 是唯一来源

以下传统命理结构事实只允许由 02 Bazi Engine 产生：

- `BaziChart`
- `BaziDerivedFeatures.dayMasterStrength`
- `BaziDerivedFeatures.elementDistribution`
- `BaziDerivedFeatures.tenGodDistribution`
- `BaziDerivedFeatures.seasonalContext`
- `BaziDerivedFeatures.structuralTags`
- `BaziRelation[]`
- `BaziLuckStructure`

04 Interpretation **不得**重新实现第二套五行比例、十神比例、日主强弱或季节结构算法。

02 自身也必须遵守 Reuse First：成熟历法、节气、干支基础能力优先经 Adapter 复用；只把八字规则差异留在版本化 rule layer。

### 5.2 Interpretation-only signals

04 可以从同一个 `BaziCalculationResult` 的 `chart` 与 canonical `derivedFeatures` 计算仅供人格映射使用的局部信号，例如：

- element balance / entropy
- ten-god concentration
- visible yang ratio
- personality contributors
- explanation codes

这些信号不得写回或伪装成第二套 `BaziDerivedFeatures`。

### 5.3 Distribution score scale

`WeightedElementScore.score` 与 `WeightedTenGodScore.score` 统一采用 **0–100 percentage scale**。

约束：

- 每个 score 必须在 `[0, 100]`
- 一组完整分布应在浮点舍入容差内合计约 `100`
- 禁止一个模块使用 `0–1` fraction、另一个模块使用 `0–100`
- `confidence` 仍保持 `0–1`，不要与 distribution score 混淆

## 6. Birth / DST 可重现性

`BirthProfile` 新增：

- `resolvedBirthInstant?: ISODateTime`
- `utcOffsetMinutesAtBirth?: number`

语义：

1. 03 Birth 一旦完成 DST overlap / offset disambiguation，应把最终 UTC instant 写入 `resolvedBirthInstant`。
2. `utcOffsetMinutesAtBirth` 保存当时选择的 UTC offset，作为 overlap occurrence 与审计信息。
3. 02 如果收到 `resolvedBirthInstant`，必须以它为 source of truth，不得再次对同一 civil time 自行选择 earlier/later occurrence。
4. 仅在 legacy record 或 unknown birth time 没有 resolved instant 时，02 才允许按其 rule profile 进行本地时间解析或降级处理。
5. 08 必须把这两个字段持久化并完整恢复。
6. 世界时区规则数据库与基础 instant/local 转换不得由项目自行维护；优先使用 runtime IANA/Intl 或经研究批准的成熟 timezone library。
7. 项目可自行定义的部分是 disambiguation policy、输入验证、warning、Adapter glue 与可复现测试。

## 7. Shared calculation context 与持久化边界

共享 Domain 提升以下类型：

- `BaziRelation`
- `BaziLuckStructure`
- `BaziCalculationContext`
- `BaziCalculationResult`

其中：

```text
BaziCalculationContext
= chart
+ calculationMetadata
+ relations
+ luck

BaziCalculationResult
= BaziCalculationContext
+ canonical derivedFeatures
```

目的：确保：

```text
02 算出
→ 08 保存
→ 04 / 07 重新读取
```

时不会丢失 calculation metadata、干支关系或大运上下文。

`BaziChart` 保持纯命盘结构，不把 metadata / luck / relations 全部塞进 chart 本体。

## 8. Calculation Metadata read path

数据库保存 `calculation_metadata` 后，Repository 必须提供能够读回它的 API。

Wave 1.5 推荐 08 收敛为：

- `saveChart(context: BaziCalculationContext)` 或等价明确命名的方法
- `getById(id): Promise<BaziCalculationContext>`，或新增语义等价的 `getCalculationContextById`
- `saveDerivedFeatures(features: BaziDerivedFeatures)`
- `getCalculationResultById(id): Promise<BaziCalculationResult>`（可由 context + canonical derived feature 组合）

不允许只保存 metadata / relations / luck，却让标准 read path 永远只返回 `BaziChart`。

## 9. PersonalityDimension V1 边界

共享 `PersonalityDimension` 在 V1 暂不扩大，继续保持：

- `score`
- `confidence`
- `evidenceKeys`

以及现有 `key` / `label`。

04 的以下字段暂时保持 Interpretation module-local `dimensionDetails`：

- contributors
- positiveExpression
- stressExpression
- explanationCodes

如果后续 Report / DB 证明必须 first-class 持久化，再通过新的 Contract change 升级，不在 Wave 1.5 提前扩大共享 API。

## 10. 共享测试入口

Root 测试入口固定为：

```text
npm run test:birth
npm run test:bazi
npm run test:interpretation
npm run test:backend
npm test
```

`npm test` 必须顺序覆盖以上全部模块。

CI 标准顺序：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

在 Wave 1 PR 逐个合并期间，尚未进入当前 branch 的模块测试目录可以被共享 runner 明确标记为 skipped；一旦对应 `tests/<module>` 目录存在但没有可执行测试，则必须 hard fail。

各业务 PR 不再把 root `npm test` 改成“只跑自己模块”。

## 11. 共享 Contract 与版本化

`types/domain/` 是模块间与多窗口间的公共接口，禁止用 `any` 绕过边界。

生成型数据统一保留：

- `engine_version`
- `rule_profile_version`
- `mapping_version`
- `prompt_version`
- `report_schema_version`

目的：历史结果可复现、规则可灰度升级、报告可追溯、Prompt 可回滚。

## 12. 权益与支付边界

- 付费权限必须由服务端 / 数据库校验，不只靠前端隐藏组件。
- 金额使用整数 minor units。
- AI 顾问次数使用整数 wallet + credit ledger。
- 顾问扣减、支付回调与账本写入必须支持幂等/事务策略。
- Wave 1.5 不接真实支付。

认证与数据库基础设施继续优先复用 Supabase Auth / SSR / PostgreSQL / RLS / migrations，不自行实现密码、token refresh、session protocol 或数据库权限系统。

## 13. 环境

至少区分：

- Local
- Preview
- Production

Secret 只放环境变量 / Secret Store，不提交 Git。`.env.example` 仅列变量名。

## 14. 当前集成限制

Wave 1 PR #2～#6 尚未合并，因此本文件描述的是已批准的共享集成 Contract，而不是宣称各 feature branch 已全部完成返工。

各窗口必须先吸收本 Contract Integration，再按 `docs/13_WAVE1_CONTRACT_INTEGRATION.md` 做最小返工；涉及外部能力时同时遵守 `docs/12_REUSE_AND_REFERENCES.md`，之后才进入最终 Merge Gate。

最后更新：2026-08-18
