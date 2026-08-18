# 13 — Wave 1 Contract Integration

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
6. `resolveBirthInstant()`：如果 `profile.resolvedBirthInstant` 存在，直接使用该 instant；不得再次对同一 DST overlap 默认 earlier occurrence。
7. deterministic canonical input / ID 应包含 `resolvedBirthInstant` 以及必要的 offset 信息。
8. relations / luck 使用 shared types。
9. package conflict 解决时保留统一 root test scripts。
10. 在最终 Merge Gate 前按 `docs/12_REUSE_AND_REFERENCES.md` 对历法/节气/时区/DST实现完成 Reuse First 复核；成熟能力优先通过 Adapter 复用。

## 5. 03 Birth normalization 最小返工

目标 branch：`feature/birth-normalization-v1`

必须：

1. 同步 Contract Integration 后的最新 `main`。
2. `TimezoneResolution.resolvedInstant` 写入 `profile.resolvedBirthInstant`。
3. `TimezoneResolution.offsetMinutes` 写入 `profile.utcOffsetMinutesAtBirth`。
4. unknown time / unresolved instant 时保持字段 absent。
5. DST overlap 经用户 offset disambiguation 后，profile 中必须保留最终 occurrence。
6. 本轮不扩大 shared `BirthPlace` bilingual contract。
7. package conflict 解决时保留统一 root test scripts。
8. 在最终 Merge Gate 前按 `docs/12_REUSE_AND_REFERENCES.md` 复核时区/DST实现，禁止无研究依据继续扩展自研 timezone database/转换逻辑。

## 6. 04 Interpretation 最小返工

目标 branch：`feature/interpretation-v1`

必须：

1. 同步 #5 最终 canonical facts baseline。
2. 停止从 `BaziChart` 独立生成第二套 `BaziDerivedFeatures`。
3. 停止重复 element/Ten-God/day-master/seasonal traditional facts 推导。
4. Personality mapping 必须消费 02 的 canonical `BaziDerivedFeatures`。
5. Interpretation-only signals 可基于 canonical facts 计算。
6. `dimensionDetails` 继续 module-local。
7. 测试接入 `npm run test:interpretation`。

## 7. 08 Supabase 最小返工

目标 branch：`feature/supabase-core-v1`

必须：

1. 同步 03 / 02 shared Contract 后的最新 `main`。
2. Birth migration 增加 resolved instant / birth offset 持久化。
3. Bazi chart migration 增加 relations / luck persistence。
4. Repository 提供 `BaziCalculationContext` / `BaziCalculationResult` 可读回路径。
5. package/CI conflict 解决时保留统一 root test scripts 与 CI `npm test`。
6. Auth / DB 基础能力继续优先使用 Supabase 官方 SDK / SSR / Postgres 能力，不重复实现认证或数据库基础设施。

## 8. #2 Visual

本 Contract Integration 不修改 #2 的视觉代码。

#2 可以独立进行视觉验收；最终 merge 前只需同步最新 `main` 并确保统一 CI/test 不被破坏。常见 UI primitives 优先复用已批准的 shadcn/ui / React / Tailwind 基线。

## 9. Merge 顺序建议

```text
1. Wave 1 Contract Integration PR
2. #4 Birth normalization
3. #5 Bazi Engine
4. #3 Interpretation
5. #6 Supabase core
6. #2 Visual（视觉验收通过后）
```

每一步都必须同步最新 `main`、保留最新 shared rules、运行 lint/typecheck/test/build 并保持 CI green。

## 10. 不在本轮做的事

- 不增加八字算法范围
- 不实现完整支付
- 不实现 AI Prompt
- 不改网页视觉
- 不真实部署 Production
- 不扩大 shared PersonalityDimension

本文件是 Wave 1.5 integration source of truth；外部复用与依赖选型 source of truth 为 `docs/12_REUSE_AND_REFERENCES.md`。
