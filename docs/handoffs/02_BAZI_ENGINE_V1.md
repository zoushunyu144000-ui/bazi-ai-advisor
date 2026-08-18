# HANDOFF — 02号 / Deterministic Bazi Engine v1

日期：2026-08-18
负责窗口：02号 八字确定性排盘 Engine 工程师
相关分支 / Commit / PR：`feature/bazi-engine-v1` / PR #5

## 1. 本阶段目标

从最新 `main` 建立确定性八字计算 Engine：标准化 `BirthProfile` 输入，经确定性历法与规则计算，产出共享 `BaziChart` 及模块内版本化计算结果；LLM 不参与排盘。

## 2. 已完成

- 从当时最新 `main` `8974161642483cfd7b9fdb0f3a6b99e1cd19fafc` 创建 `feature/bazi-engine-v1`。
- 引入并 Adapter 封装 `tyme4ts@1.5.2`；业务层不暴露第三方原始结构。
- 实现四柱、天干地支、五行阴阳、藏干、十神。
- 实现精确立春年界与十二节月界。
- 实现 IANA 时区 civil-time → instant 解析，明确 DST gap / overlap 行为。
- 实现基础干支关系：天干五合、地支六合、六冲、六害。
- 实现可复现的基础旺衰评分与 `BaziDerivedFeatures`。
- 实现大运方向、相邻节起运、三天折一年、8 个十年运基础结构。
- 所有 Engine 结果通过模块内 `BaziEngineResult` 携带 `engine_version`、`rule_profile_version` 与 `BaziCalculationMetadata`。
- 建立边界与确定性测试，并把 `npm run test` 加入 CI。
- 未修改 `types/domain/**`、`app/**`、`db/**`、`modules/interpretation/**`、支付、AI、UI 代码。

## 3. 修改文件

核心：
- `modules/bazi/engine.ts` — Engine 编排与共享 `BaziChart` 输出
- `modules/bazi/adapters/tyme4ts-adapter.ts` — 第三方历法唯一 Adapter 边界
- `modules/bazi/timezone.ts` — IANA 时区与 DST 确定性解析
- `modules/bazi/rules.ts` — 十神、柱构造、干支序列、年月时柱规则
- `modules/bazi/relations.ts` — 基础干支关系
- `modules/bazi/derived.ts` — 基础旺衰与分布特征
- `modules/bazi/luck.ts` — 大运基础结构
- `modules/bazi/constants.ts` / `types.ts` / `id.ts` — 版本、映射、模块私有类型、确定性 ID
- `modules/bazi/RULES.md` — v1 规则档案与流派边界
- `modules/bazi/index.ts` — 对外 Engine 边界

测试：
- `tests/bazi/engine.test.ts`
- `tests/bazi/rules.test.ts`
- `tests/bazi/timezone.test.ts`
- `tests/bazi/helpers.ts`
- `tests/bazi/tsconfig.json`

工程验证所需：
- `package.json` / `package-lock.json` — 锁定 `tyme4ts@1.5.2`，增加 `test` script
- `.github/workflows/ci.yml` — 增加 Test 步骤

## 4. 当前真实状态

Engine 可接受当前共享 Contract 的 `BirthProfile`，并返回模块内 `BaziEngineResult`：

- `chart: BaziChart`
- `calculationMetadata: BaziCalculationMetadata`
- `derivedFeatures: BaziDerivedFeatures`
- `relations`
- `luck`
- 顶层 `engine_version`
- 顶层 `rule_profile_version`

确定性约束：相同 `BirthProfile` 输入产生相同结果。由于当前 `BaziChart.calculatedAt` 是必填字段，v1 使用输入的 `BirthProfile.updatedAt` 作为稳定审计时间戳，而不是调用时钟。

## 5. 重要决定

本轮没有修改共享 `docs/08_DECISION_LOG.md`，由 00 号在合并后统一决定是否升格长期决策。

v1 当前规则档案：`civil-local-jieqi-v1`。

明确的流派选择：
- 年界：精确 `立春` 瞬间。
- 月界：精确十二 `节` 瞬间。
- 日柱：出生地 IANA 时区的民用日期。
- 晚子时：23:00–23:59 **不换日**；这是 v1 流派选择，不宣称唯一正确。
- 真太阳时：v1 不做经度校正。
- 起运：阳男阴女顺、阴男阳女逆；相邻节距离按“三天折一年”。
- 旺衰：仅作为版本化 baseline structural score，不等同于完整格局/用神判定。

## 6. 测试 / 验证

已执行（GitHub Actions CI）：
- `npm ci --no-audit --no-fund`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

在提交 `3032fc26cac64a73a4698fbaae0d0a2cb39f8688` 上上述步骤全部通过；本 Handoff 提交后仍需以最新 PR HEAD CI 为最终合并门槛。

测试覆盖重点：
- 立春前后 / 精确边界
- 惊蛰节界
- 23:00 晚子时
- 午夜换日
- 公历跨年但未立春
- 闰年 2 月 29 日
- IANA 多时区
- DST 不存在时间 / 重复时间
- 未知出生时间
- 相同输入确定性
- 大运顺逆与基础结构

## 7. 遗留问题 / 风险

### 命理规则未实现

- 真太阳时 / 经度修正及独立 rule profile
- 地支刑、破及更复杂组合
- 条件性合化、冲合强弱裁决
- 完整格局、调候、用神体系
- 多流派晚子时配置
- 多流派起运折算配置
- 更严格的传统权威金样本（golden fixtures）交叉验证

### Contract Change Request

当前 `types/domain/` 不足以完整表达 Engine 输出，本轮按协作规则没有私自修改。建议 00 号协调后单独处理：

1. `BaziChart` 本身缺少 `engine_version`、`rule_profile_version` 与 `calculation metadata` 承载位；目前由模块内 `BaziEngineResult` wrapper 承载。
2. 共享 Contract 没有 `BaziRelation` / `BaziLuckStructure`（大运）类型；目前暂存于 `modules/bazi/types.ts`。
3. `BaziChart.calculatedAt` 把“真实计算事件时间”与“相同输入必须得到完全确定输出”的目标混在一起。建议将事件时间与 deterministic result identity/fingerprint 分离，或明确 `calculatedAt` 是否允许不参与确定性比较。
4. 如果后续产品要支持真太阳时，需要为 `rule_profile_version` 明确是否/如何使用 `BirthPlace.coordinates`。

### 共享文档陈旧状态（交由 00 号统一同步）

- 本轮开始时 `docs/04_TECH_ARCHITECTURE.md` 顶部仍写 Foundation PR #1 尚未合并，已与 GitHub 真实状态冲突。
- 本轮开始时 `docs/09_CURRENT_STATE.md` 中记录的 `main` HEAD 仍是 Foundation merge commit，而实际创建本分支时 `main` HEAD 已为 `8974161642483cfd7b9fdb0f3a6b99e1cd19fafc`。
- 按并行协作规则，本轮没有修改这些共享状态文件，请 00 号在 PR 合并后统一同步。

## 8. 下一步

1. 以 PR #5 最新 HEAD 的 CI 全绿作为合并前提。
2. 00 号 / 架构窗口评审 Contract Change Request，并决定共享类型升级方式。
3. 增加经外部权威万年历/历法实现确认的 golden fixtures，特别是历史时区、极端节气边界与争议流派样本。
4. 合并后由 00 号同步 `CURRENT_STATE` / `ROADMAP` / 必要 Decision Log 与 Tech Architecture。

## 9. 不要破坏的约束

- LLM 永远不得从原始生日自由计算四柱。
- 第三方历法库必须继续藏在 Adapter 后，业务层不得依赖其对象结构。
- 同一 rule profile + 同一输入必须可复现。
- 流派争议必须由 `rule_profile_version` 显式表达，不能静默改变历史结果。
- 不应为了本 Engine 擅自改动支付、AI、UI、DB 或解释层。

## 10. 需要下一窗口首先读取

默认：
- `AGENTS.md`
- `docs/00_PROJECT_INDEX.md`
- `docs/09_CURRENT_STATE.md`

本模块额外：
- `modules/bazi/RULES.md`
- `modules/bazi/engine.ts`
- `modules/bazi/types.ts`
- `types/domain/bazi.ts`
- `types/domain/birth.ts`
- PR #5
