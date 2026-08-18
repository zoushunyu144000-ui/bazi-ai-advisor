# HANDOFF — 02号 / Open Source BaZi Benchmark

日期：2026-08-18
相关分支 / PR：`feature/bazi-engine-v1` / PR #5

## 1. 本阶段目标

在下一次重大八字算法修改前暂停继续自研扩展，审计成熟 TypeScript 实现，建立 capability matrix 与独立 reference vectors，并判断现有自研部分是否应被替换。

## 2. 已完成

- 审计 `tyme4ts@1.5.2`、`mingyu-core@0.1.29`、`@4n6h4x0r/stem-branch@0.8.0`、`@stillnessdao/bazi-engine@0.9.0`。
- 增补高相关候选 `manseryeok@2.0.0`。
- 按 License、维护、测试、节气、四柱、十神、大运、DST、真太阳时、中国历史时间、流年流月、干支关系建立 capability matrix。
- 实际通过 GitHub Actions / Node 22 固定版本运行 `tyme4ts`、`stem-branch`、`manseryeok` reference vectors，而不是只采信 README。
- 三个普通/边界样本取得三实现完全一致结果，并写入 `tests/bazi/reference-vectors.test.ts`。
- 晚子时样本明确识别出 `jasi` / `splitJasi` / `midnight` 三套规则，不做多数票裁决；当前 `civil-local-jieqi-v1` 保持 `midnight` 语义。
- 增加中国 1990 夏令时回归：`Asia/Shanghai` 1990-06-01 12:00 = UTC+9。
- 临时 benchmark workflow 已删除；原始运行证据保留在 PR #5 评论。

## 3. 核心产物

- `modules/bazi/OPEN_SOURCE_BENCHMARK.md` — capability matrix、reference vectors、替换建议与下一阶段 gate。
- `tests/bazi/reference-vectors.test.ts` — 外部多实现共识 + 明确争议规则回归。
- `tests/bazi/timezone.test.ts` — 增补 PRC 1990 historical DST vector。

## 4. 关键结论

1. **不要因已有自研代码产生 sunk cost。**
2. `@4n6h4x0r/stem-branch` 在历史 IANA/DST、真太阳时、节气天文验证和完整干支关系方面明显强于当前手写基础层，是下一步最值得做 Adapter PoC 的候选。
3. `tyme4ts` 的传统八字对象、十神和大运测试成熟，继续适合作为传统排盘 provider/reference，但其本身不应负责海外 IANA 时区语义。
4. `mingyu-core` 功能覆盖最广，尤其历史时区、真太阳时、流年流月、关系层值得参考；但其 calendar/BaZi 依赖 `tyme4ts`，不能与 tyme4ts 一起算作两个独立历法 oracle，也不建议整个商业项目直接绑定其大型 monorepo。
5. `manseryeok` 是很好的独立核心四柱/子时流派 reference，但历史时间规则偏韩国，不适合作为中国/海外华人时间层唯一来源。
6. `David88666/bazi-engine` API 能力广，但项目非常新且定位测试仅少量，暂只作为低权重 sanity reference。

## 5. 下一步建议

下一次重大修改不要先扩功能，应优先：

1. 新增 `stem-branch` **第二 Provider Adapter PoC**，先只接 time/solar-term/true-solar 能力，不改 Domain Contract。
2. 用现有共识 vectors + Li Chun/Jie ±1s + DST gap/overlap + PRC historical DST 做双 provider 对拍。
3. 若 equivalence 和边界精度通过，再决定是否让 `stem-branch` 替代当前 `timezone.ts` 与部分 solar-term plumbing，并提升 `engine_version`。
4. 隐藏干、十神、刑冲合害破和大运等传统基础表，优先比较 upstream normalization 后复用，避免继续手写扩表。
5. 旺衰、真太阳时开关、晚子时、起运流派等继续由项目 `rule_profile_version` 拥有，不把流派争议藏进第三方默认值。

## 6. Contract / 协作边界

本 benchmark 没有修改 `types/domain/**`，也没有修改 app、DB、interpretation、支付、AI、UI。原 Contract Change Request 继续有效。

00号在 PR 合并后再统一同步 `CURRENT_STATE` / `ROADMAP` / Architecture；本轮不碰共享状态文件。
