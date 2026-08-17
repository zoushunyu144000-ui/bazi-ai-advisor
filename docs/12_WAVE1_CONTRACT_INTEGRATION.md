# 12 — Wave 1 Contract Integration

状态：Approved integration specification

日期：2026-08-18

Branch：`feature/wave1-contract-integration`

适用 PR：#3 / #4 / #5 / #6；#2 仅受统一 CI/test 基线影响，不修改视觉。

## 1. 目的

Wave 1 第一轮并行开发后，出现四类典型跨窗口冲突：

1. root `npm test` 被多个 PR 互相覆盖
2. 02 与 04 同时计算传统命理事实，且 score scale 不一致
3. 03 已解析 DST overlap，但 shared BirthProfile 无法把 exact occurrence 交给 02
4. 02 计算出的 metadata / relations / luck 无法被 08 完整持久化与读回

本规范只解决共享 Contract 与集成边界，不新增业务功能。

## 2. Shared Domain 最终决定

### 2.1 BirthProfile

新增：

```ts
resolvedBirthInstant?: ISODateTime;
utcOffsetMinutesAtBirth?: number;
```

`resolvedBirthInstant` 一旦存在就是下游 deterministic calculation 的 canonical UTC instant。

### 2.2 Bazi distribution scale

```text
WeightedElementScore.score = 0..100 percentage
WeightedTenGodScore.score   = 0..100 percentage
```

完整分布应在浮点舍入容差内合计约 100。

`BaziDerivedFeatures.confidence` 仍为 0..1。

### 2.3 Canonical facts ownership

02 唯一负责：

- `BaziChart`
- `BaziDerivedFeatures`
- day-master strength
- element distribution
- Ten-God distribution
- seasonal context
- structural tags
- relations
- luck

04 不再输出第二套 `BaziDerivedFeatures`。

### 2.4 Shared calculation types

新增/提升：

```ts
BaziPillarPosition
BaziRelationKind
BaziRelation
BaziLuckDirection
BaziLuckCyclePeriod
BaziLuckStructure
BaziCalculationContext
BaziCalculationResult
```

定义：

```text
BaziCalculationContext
= chart + calculationMetadata + relations + luck

BaziCalculationResult
= BaziCalculationContext + derivedFeatures
```

### 2.5 PersonalityDimension

本轮不改 shared `PersonalityDimension`。

04 的：

- contributors
- positiveExpression
- stressExpression
- explanationCodes

继续保持 module-local `dimensionDetails`。

## 3. 统一测试规范

Root scripts：

```text
npm run test:birth
npm run test:bazi
npm run test:interpretation
npm run test:backend
npm test
```

`npm test` 必须顺序执行四套。

共享 runner：`scripts/run-test-suite.mjs`

规则：

- feature 尚未进入 branch、`tests/<module>` 不存在：明确 skip
- `tests/<module>` 已存在但没有测试：fail
- Bazi 保留其 TypeScript compile-then-node-test 模式
- Birth / Interpretation / Backend 使用 Node 22 type stripping + node:test

CI：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## 4. 02 Bazi Engine 最小返工

目标 branch：`feature/bazi-engine-v1`

必须：

1. 同步 Contract Integration 后的最新 `main`。
2. 删除或别名化 `modules/bazi/types.ts` 中与 shared 重复的：
   - `BaziRelation`
   - `BaziLuckStructure`
   - `BaziEngineResult`
3. Engine 对外返回 shared `BaziCalculationResult`。
4. `deriveFeatures()` 输出：
   - element distribution 0–100
   - Ten-God distribution 0–100
   - 两组总和约 100
5. 02 保持 canonical `BaziDerivedFeatures` 唯一事实来源。
6. `resolveBirthInstant()`：
   - 如果 `profile.resolvedBirthInstant` 存在，直接使用该 instant
   - 根据 profile timezone 从该 instant 恢复 local parts
   - 不允许再次对同一 DST overlap 默认 earlier occurrence
   - 可校验 `utcOffsetMinutesAtBirth` 与计算 offset 一致，不一致则 warning/error 按 rule profile 明确处理
7. deterministic canonical input / ID 应包含 `resolvedBirthInstant`（存在时）以及必要的 offset 信息，避免两个 overlap occurrence 得到同一 identity。
8. relations / luck 使用 shared types。
9. 保留其 module-local `ResolvedBirthInstant` / solar-term adapter types，只要它们不跨模块泄漏即可。
10. package conflict 解决时保留统一 root test scripts，不再设置 backend/bazi-only `test`。

新增/调整测试至少覆盖：

- element scores in 0..100 and total ≈100
- Ten-God scores in 0..100 and total ≈100
- 同一个 ambiguous local time 的两个 resolved instants 能得到各自正确 replay，不被强制 earlier
- shared `BaziCalculationResult` shape

## 5. 03 Birth normalization 最小返工

目标 branch：`feature/birth-normalization-v1`

必须：

1. 同步 Contract Integration 后的最新 `main`。
2. `normalizeBirthProfile()` 把 `TimezoneResolution.resolvedInstant` 写入：
   - `profile.resolvedBirthInstant`
3. 把 `TimezoneResolution.offsetMinutes` 写入：
   - `profile.utcOffsetMinutesAtBirth`
4. unknown time / unresolved instant 时保持字段 absent。
5. DST overlap 经用户 offset disambiguation 后，profile 中必须保留最终 occurrence。
6. 本轮不扩大 shared `BirthPlace` bilingual contract；现有 module-local localized names 继续允许。
7. package conflict 解决时保留统一 root test scripts。

测试至少覆盖：

- Malaysia/Singapore no-DST instant/offset round-trip
- US/Canada/Europe fall-back overlap 不同 offset 对应不同 `resolvedBirthInstant`
- normalized profile 包含 resolved instant / offset
- unknown time 不伪造 resolved instant

## 6. 04 Interpretation 最小返工

目标 branch：`feature/interpretation-v1`

必须：

1. 同步 #5 最终 canonical facts baseline（或至少同步包含相同 shared Contract 的 main）。
2. 停止从 `BaziChart` 独立生成第二套 `BaziDerivedFeatures`。
3. 删除/停用以下重复传统事实计算：
   - element raw weighting / normalization
   - Ten-God raw weighting / normalization
   - day-master strength threshold
   - seasonal structural derivation
4. Personality mapping 必须消费 02 的 canonical `BaziDerivedFeatures`。
5. 如果需要 `visibleYangRatio`，允许同时读取同一个 calculation result 的 `chart`；但它只是 Interpretation-only signal。
6. `elementBalance` 必须基于 canonical elementDistribution 计算。
7. `tenGodConcentration` 必须基于 canonical tenGodDistribution 计算。
8. 不得修改 canonical features 的 engine/rule/mapping versions。
9. Interpretation 自己只负责 personality `mapping_version`。
10. `dimensionDetails` 继续 module-local；不改 shared `PersonalityDimension`。
11. 测试接入 `npm run test:interpretation`，且 root `npm test` 能跑到它。

推荐 API 方向：

```ts
interpretBaziCalculation(
  input: Pick<BaziCalculationResult, "chart" | "derivedFeatures">
): InterpretationResult
```

或语义等价的 `BaziChart + BaziDerivedFeatures` 输入；关键是不能重算 canonical traditional facts。

## 7. 08 Supabase 最小返工

目标 branch：`feature/supabase-core-v1`

必须：

1. 同步 03 / 02 shared Contract 后的最新 `main`。
2. Birth migration 新增：
   - `resolved_birth_instant timestamptz null`
   - `utc_offset_minutes_at_birth integer null`
3. `BirthProfileRow` / mapper / create / update 完整 round-trip 两字段。
4. Bazi chart migration 新增：
   - `relations jsonb not null default '[]'::jsonb`
   - `luck jsonb not null`
5. `ChartRow` 与 mapper 使用 shared `BaziCalculationContext`。
6. `saveChart()` 改为保存 context，或新增语义明确的 `saveCalculationContext()`；必须保存 metadata + relations + luck。
7. `getById()` 改为返回 context，或新增 `getCalculationContextById()`；必须能够读回 metadata + relations + luck。
8. 增加 `getCalculationResultById()` 或 service-level 等价 read path，把 context 与 canonical derived features 组合成 shared `BaziCalculationResult`。
9. 不允许未来 07 为了拿 luck/relations 自己重算。
10. package/CI conflict 解决时保留统一 root test scripts 与 CI `npm test`。

Backend tests 至少证明：

- Birth resolved instant / offset mapper round-trip
- calculation metadata read path
- relations round-trip
- luck round-trip
- canonical derived features 可与 context 重新组合为 `BaziCalculationResult`

## 8. #2 Visual

本 Contract Integration 不修改 #2 的视觉代码。

#2 可以独立进行视觉验收；最终 merge 前只需同步最新 `main` 并确保统一 CI/test 不被破坏。

## 9. Merge 顺序建议

```text
1. Wave 1 Contract Integration PR
2. #4 Birth normalization
3. #5 Bazi Engine
4. #3 Interpretation
5. #6 Supabase core
6. #2 Visual（视觉验收通过后）
```

每一步都必须：

- 同步当时最新 `main`
- 解决 package/CI/docs 冲突时保留最新 shared integration rules
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- CI green

不得一次性把 #2～#6 无序批量 merge。

## 10. 不在本轮做的事

- 不增加八字算法范围
- 不实现完整支付
- 不实现 AI Prompt
- 不改网页视觉
- 不真实部署 Production
- 不扩大 shared PersonalityDimension

本文件是 Wave 1.5 integration source of truth。
