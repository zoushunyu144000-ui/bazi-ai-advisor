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
- Wave 1.5 Contract Integration PR：#7（**Merged / Closed**）
- PR #7 reviewed HEAD：`9553f606bdda8281e255dddd27b1dc0efcd738ea`
- PR #7 Merge Commit：`c67bc8f1ab30ab177b30dd29511602f93b35c890`

**Wave 1.5 shared Contract、统一测试入口与 REUSE FIRST 治理规则已经正式进入 `main`。**

## 2. Wave 1 当前 PR 状态

以下业务 PR 仍然开放，且本次没有合并：

- #2 `design/product-visual-v1`
- #3 `feature/interpretation-v1`
- #4 `feature/birth-normalization-v1`
- #5 `feature/bazi-engine-v1`
- #6 `feature/supabase-core-v1`

PR #7 合并后，02 / 03 / 04 / 08 对应窗口不得继续以 PR #7 之前的 `main` 或旧 feature baseline 作为最终适配基线。

当前阶段从“Contract Integration Gate”进入 **Wave 1 adaptation / cumulative integration**。

## 3. 已进入 main 的共享 Contract

### Canonical Bazi facts

02 Bazi Engine 是传统命理结构事实唯一来源：

```text
BirthProfile
→ BaziChart
→ canonical BaziDerivedFeatures
```

04 Interpretation 不得重新建立第二套：

- 五行分布
- 十神分布
- 日主强弱
- 季节结构

### Score scale

- `WeightedElementScore.score`：0–100 percentage
- `WeightedTenGodScore.score`：0–100 percentage
- `BaziDerivedFeatures.confidence`：0–1

### DST replay

Shared `BirthProfile` 已包含：

- `resolvedBirthInstant?`
- `utcOffsetMinutesAtBirth?`

03 一旦完成 DST overlap disambiguation，02 必须使用已解析 instant，不得再次猜 occurrence。

### Bazi calculation context

Shared Domain 已包含：

- `BaziRelation`
- `BaziLuckStructure`
- `BaziCalculationContext`
- `BaziCalculationResult`

目标是保证：

```text
02 计算
→ 08 持久化
→ 04 / 07 读取
```

时不丢失 calculation metadata、relations、luck 或 canonical derived features。

### PersonalityDimension

V1 暂不扩大 shared `PersonalityDimension`。

`contributors`、`positiveExpression`、`stressExpression`、`explanationCodes` 继续留在 04 module-local `dimensionDetails`。

## 4. 统一测试入口已进入 main

Root scripts：

```text
npm run test:birth
npm run test:bazi
npm run test:interpretation
npm run test:backend
npm test
```

CI 标准顺序：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

PR #7 最终 reviewed HEAD `9553f606bdda8281e255dddd27b1dc0efcd738ea` 的 GitHub Actions 已验证：

- Install dependencies：success
- Lint：success
- Typecheck：success
- Test：success
- Build：success

所有 Wave 1 业务 PR 最终 merge 前必须吸收最新 `main` 并保留统一 root test / CI contract。

## 5. REUSE FIRST 已进入 main

项目级规则：**Research Before Build / Reuse First**。

重要模块开发或替换依赖前必须调查：

1. GitHub / npm / API / MCP / skill / 平台原生能力
2. License 与商业使用条件
3. 维护活跃度
4. 测试与文档
5. 边界规则
6. Adapter 可行性
7. 风险与替代方案

优先级：

```text
成熟可靠库直接复用
>
Adapter 封装成熟实现
>
参考成熟实现补齐少量业务逻辑
>
最后才自行从零实现
```

长期登记表：`docs/12_REUSE_AND_REFERENCES.md`。

Wave 1.5 详细返工规范：`docs/13_WAVE1_CONTRACT_INTEGRATION.md`。

聊天窗口不得仅凭记忆选择重要依赖。

## 6. 当前仍需完成的最小适配

- #4 Birth：把 resolved instant / UTC offset 写入 shared BirthProfile；同时按 REUSE FIRST 复核 DST 基础能力。
- #5 Bazi：使用 resolved instant；canonical distribution 改为 0–100；使用 shared relations/luck/result；继续通过 Adapter 复用成熟历法能力。
- #3 Interpretation：消费 #5 canonical `BaziDerivedFeatures`，停止重算传统命理事实。
- #6 Supabase：持久化 Birth instant/offset、relations/luck，并提供完整 calculation context/result read path。
- #2 Visual：独立视觉验收；不得因 #7 合并而自动 merge。

## 7. 外部服务状态

- Vercel Production：本轮未部署
- Supabase Production：本轮未应用 migration
- Payment provider：未接真实支付
- AI Provider / Prompt：本轮未实现
- Analytics：本轮未实现

## 8. 下一步

推荐主线适配 / Merge 顺序：

```text
#4 Birth
→ #5 Bazi
→ #3 Interpretation
→ #6 Supabase
→ #2 Visual（视觉验收通过后）
```

每个 PR 必须先同步 PR #7 后的最新 `main`，完成最小返工，再运行：

```text
npm run lint
npm run typecheck
npm test
npm run build
```

并要求 GitHub CI green 后才进入下一 Merge Gate。

不得批量盲合 #2～#6。
