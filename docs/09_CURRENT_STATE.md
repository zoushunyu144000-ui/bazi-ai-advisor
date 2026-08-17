# 09 — Current State

最后更新：2026-08-18

> 本文件描述“现在真实做到哪里”。只有实际存在于仓库/分支/PR/部署环境或已明确 Approved 的事项才写为已完成。

## 1. Repository

- GitHub：`zoushunyu144000-ui/bazi-ai-advisor`
- Visibility：Private
- Default branch：`main`
- Foundation PR：#1（Merged / Closed）
- Foundation HEAD：`ee37eba0c65a70da13365bbe354954457df2819c`
- Foundation Merge Commit：`f3b0fc9e0590b016d242031ffbcb00c5f7617306`
- Wave 1 shared integration branch：`feature/wave1-contract-integration`

Foundation 已正式进入 `main`。Foundation 后还有项目治理文档提交进入 `main`；因此不得再把 Foundation Merge Commit 误写成“当前 main HEAD”。

## 2. Wave 1 第一轮开发真实状态

当前开放 PR：

- #2 `design/product-visual-v1`
- #3 `feature/interpretation-v1`
- #4 `feature/birth-normalization-v1`
- #5 `feature/bazi-engine-v1`
- #6 `feature/supabase-core-v1`

这些 PR **尚未合并**。

总指挥跨 PR 检查后发现共享测试入口、canonical Bazi facts ownership、DST replay、Bazi relations/luck persistence 与 calculation metadata read path 存在需要统一的 Contract 问题。

因此当前进入 **Wave 1.5 Contract Integration Gate**。

## 3. Wave 1.5 已冻结的共享决定

### Canonical Bazi facts

02 Bazi Engine 是传统命理结构事实唯一来源，负责：

```text
BirthProfile
→ BaziChart
→ canonical BaziDerivedFeatures
```

04 Interpretation 不再独立计算第二套：

- 五行分布
- 十神分布
- 日主强弱
- 季节结构

### Score scale

- `WeightedElementScore.score`：0–100 percentage
- `WeightedTenGodScore.score`：0–100 percentage
- `confidence`：仍为 0–1

### DST replay

`BirthProfile` 已在 integration branch 增加：

- `resolvedBirthInstant?`
- `utcOffsetMinutesAtBirth?`

03 一旦完成 DST overlap disambiguation，02 必须使用 resolved instant，不得再次猜 occurrence。

### Bazi calculation context

shared Domain 已在 integration branch 设计：

- `BaziRelation`
- `BaziLuckStructure`
- `BaziCalculationContext`
- `BaziCalculationResult`

目标是保证 02 → 08 → 04/07 链路不丢 metadata、relations、luck 或 canonical derived features。

### PersonalityDimension

V1 暂不扩大 shared `PersonalityDimension`。

`contributors`、`positiveExpression`、`stressExpression`、`explanationCodes` 继续留在 04 module-local `dimensionDetails`。

## 4. 统一测试入口

integration branch 已定义统一 root scripts：

```text
npm run test:birth
npm run test:bazi
npm run test:interpretation
npm run test:backend
npm test
```

`npm test` 顺序运行四个模块测试。

CI 统一为：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Wave 1 feature PR 最终 merge 前必须吸收这一统一测试入口，不得继续覆盖 root `npm test` 为单模块测试。

## 5. 当前仍未完成

Wave 1.5 integration branch 只负责 shared Contract / integration specification，不代表 #2～#6 已完成返工。

在各 PR 最终 merge 前仍需要：

- #4 Birth：把 resolved instant / UTC offset 写入 shared BirthProfile
- #5 Bazi：使用 resolved instant；canonical distribution 改为 0–100；shared relations/luck/result
- #3 Interpretation：消费 #5 canonical BaziDerivedFeatures；停止重算传统命理事实
- #6 Supabase：持久化 Birth instant/offset、relations/luck，并提供完整 calculation context/result read path
- #2 Visual：按独立视觉验收结论处理，不因 Contract Integration 自动 merge

具体返工清单见 `docs/12_WAVE1_CONTRACT_INTEGRATION.md`。

## 6. 外部服务状态

- Vercel Production：未由本 Contract Integration 部署
- Supabase Production：未由本 Contract Integration 应用 migration
- Payment provider：未接真实支付
- AI Provider / Prompt：本轮未实现
- Analytics：本轮未实现

## 7. 工程边界

Wave 1.5 不新增：

- 八字算法业务扩展
- 支付功能
- AI Prompt / Advisor 业务
- 网页视觉改动
- 新命理品类

本轮只统一 shared contracts、tests、CI 与 integration docs。

## 8. 下一步

1. 合并 Contract Integration PR 到 `main`（需总指挥批准）
2. #4 / #5 / #3 / #6 分别吸收最新 `main` 并做最小返工
3. 每个返工 PR 运行统一 CI + cumulative `npm test`
4. 按依赖顺序逐个 merge，不批量盲合
5. #2 按视觉验收单独决定

最后更新：2026-08-18
