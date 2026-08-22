# 09 — Current State

状态：**V1 Release Freeze — TraditionalPatternResult Spec READY FOR REVIEW / Implementation NOT STARTED**  
最后更新：2026-08-23

## 0. Source of Truth

优先级：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/18_TRADITIONAL_BAZI_TRANSLATION_CONTRACT.md`
3. `docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`
4. `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`（当前 Proposed / Review）
5. `docs/09_CURRENT_STATE.md`
6. `docs/10_ROADMAP.md`
7. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

项目执行流程：`docs/21_AI_PROJECT_OPERATING_SYSTEM.md`。

本文件只记录当前真实状态。

## 1. 当前产品方向

产品正式定义为：

**传统八字判断 + 现代人格翻译 + 10 固定官方 IP + 免费完整 Dossier + 分享传播 + 后续专业付费报告。**

最高原则：

> **传统命理负责判断，现代产品负责翻译。**

## 2. Repository / PR

- Branch：`release/v1-personality-rc`
- Draft PR：`#16 release: V1 public personality experience`
- Base：`main`
- Production：`bazi-ai-advisor.vercel.app`

PR 继续保持 Draft，直到传统判断链、固定 Character IP、最终 QA 均完成。

## 3. 已完成 Gate

### Traditional Bazi Rule Audit

```text
DONE
```

Source：`docs/20_TRADITIONAL_BAZI_RULE_AUDIT.md`。

核心结论继续有效：legacy `support_ratio`、0.58 / 0.42、month ×1.5、52/18/22/8 candidate ranking 均不得承担正式 Traditional Pattern authority。

### Traditional Bazi Rule Profile V1

```text
rule_profile_version = ziping-v1.0.0
status = LOCKED / ACTIVE
```

Source：`docs/22_TRADITIONAL_BAZI_RULE_PROFILE_V1.md`。

Owner Approval OA-01 ～ OA-07 已冻结：

```text
YEAR_BOUNDARY = EXACT_LICHUN_INSTANT
MONTH_BOUNDARY = EXACT_JIE_INSTANT
DAY_BOUNDARY = LOCAL_CIVIL_MIDNIGHT_00_00
LATE_ZI = NIGHT_ZI / ZI_ZHENG_SPLIT_PROFILE
TIME_STANDARD = HISTORICAL_IANA_CIVIL_TIME
TRUE_SOLAR_TIME = NOT_AUTO_APPLIED_IN_V1

MONTH_HOST_BASE = month branch
→ ordered hidden qi (main > middle > residual)
→ exposure
→ base Pattern Host

YANGREN = FIVE_YANG_STEMS_ONLY
DAY_MASTER_STRENGTH = QUALITATIVE_EVIDENCE_PROFILE
FOLLOW FINAL = STRICT_FOLLOW_WEALTH + STRICT_FOLLOW_KILLING
```

## 4. TraditionalPatternResult Spec — READY FOR REVIEW

本轮已新增：

`docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`

状态：

```text
TraditionalPatternResult Spec = READY FOR REVIEW / PROPOSED
Implementation = NOT STARTED
```

Spec 提议：

- Owner：`modules/bazi/traditional-pattern/**`；
- Shared Contract：未来 `types/domain/traditional-pattern.ts`；
- Input：`BirthProfile + BaziChart + BaziCalculationMetadata + BaziRelation[]`；
- `BaziDerivedFeatures` 不进入 Traditional Pattern authority input；
- `pattern_schema_version = traditional-pattern-result/1.0.0`；
- Pattern Status 支持 clear / primary+secondary / mixed / no-stable / follow / ambiguous；
- Pattern enum 只包含 `ziping-v1.0.0` 可 final 的传统结构；
- Evidence / Counter Evidence / Ambiguity first-class；
- Strength 只用 qualitative evidence；
- directional combinations 保留 Host direction；
- strict Follow Wealth / Follow Killing 才可 confirmed final；
- legacy `personality-map/0.2.0` 采用 shadow migration，不立即删除。

Spec 中 TP-01 ～ TP-07 为 **Proposed architecture decisions**，需要 Review / Owner Approval 后才能 Freeze Spec。

## 5. Current Implementation Reality / Gaps

当前 production 仍是：

```text
Birth
→ calculateBazi (civil-local-jieqi-v1)
→ BaziDerivedFeatures
→ Interpretation
→ personality-map/0.2.0
→ ArchetypeCandidate
→ Public Personality
```

当前尚未实现 `TraditionalPatternResult`。

当前代码与 `ziping-v1.0.0` implementation 的关键差距：

1. `modules/bazi/engine.ts` 仍输出 `civil-local-jieqi-v1`；
2. 23:00–23:59 当前 hour stem 仍按 same civil-day day stem 起时，不是 locked night-Zi split semantics；
3. current `BaziRelationKind` 只有天干合、六合、六冲、六害；
4. 尚缺三合、三会、刑、破、transformation state；
5. 尚缺 Month Host / exposure / root / qualitative strength evaluators；
6. 尚缺 pattern-specific formation / damage / rescue；
7. 尚缺 mixed / strict follow adjudication；
8. `PublicResultBundle` 仍 required `ArchetypeCandidate`；
9. Result authority 仍由 legacy dominant Ten God 驱动。

这些是下一 Build 的 implementation work，不是重新修改 Rule Profile 的理由。

## 6. Spec Review Gate — ACTIVE

当前唯一 P0：

> **Review + Freeze `docs/23_TRADITIONAL_PATTERN_RESULT_SPEC_V1.md`。**

Review 需要确认 TP-01 ～ TP-07：

```text
TP-01 Ownership: Bazi Traditional Layer owns result
TP-02 Input isolation: no BaziDerivedFeatures authority input
TP-03 pattern_schema_version = traditional-pattern-result/1.0.0
TP-04 no UNKNOWN/NONE pattern sentinel; use null + patternStatus
TP-05 categorical evidence sufficiency; no numeric traditional confidence
TP-06 approximate-time ambiguity does not invent ±minute window
TP-07 first phase keeps TraditionalPatternResult independent from required BaziCalculationResult field for shadow migration
```

在 Spec Freeze 之前：

```text
TraditionalPatternResult production Build = BLOCKED
```

## 7. Implementation Plan after Spec Freeze

批准后按：

```text
Phase 1 Contract + profile guard
Phase 2 ziping calendar compatibility + structural evidence
Phase 3 pattern candidates
Phase 4 pattern-specific formation
Phase 5 mixed + strict follow
Phase 6 result assembly + shadow integration
Phase 7 QA / golden cases
```

完成 TraditionalPatternResult implementation Review + Freeze 后，才进入 Public Personality Translation / Authority Cutover。

## 8. Legacy Personality Authority Risk

当前 `personality-map/0.2.0`：

```text
52% canonical Ten-God score
18% family score
22% personality dimension fit
8% strength fit
```

仍属于 `EXPERIMENTAL`。

迁移策略已在 Spec 固定为：

```text
A. TraditionalPatternResult 独立生成
B. Shadow Compare
C. Translation Layer
D. Authority Cutover
E. Legacy retirement
```

切换前不删除旧逻辑；切换后不得在 Traditional result 缺失时静默 fallback 到旧 candidate 作为传统答案。

## 9. 10 Public Personalities — LOCKED

| key | Public Personality |
| --- | --- |
| `bi_jian` | 犟种 |
| `jie_cai` | 撒币 |
| `shi_shen` | 享乐主义 |
| `shang_guan` | 天生反骨 |
| `zheng_cai` | 抠抠搜搜 |
| `pian_cai` | 搞钱圣体 |
| `zheng_guan` | 老干部 |
| `qi_sha` | 狠人 |
| `zheng_yin` | 活菩萨 |
| `pian_yin` | 道长 |

这些名字是现代 Translation labels，不等于 Traditional Pattern enum。

## 10. Character System — LOCKED

```text
10 Public Personality = 10 fixed official Character IPs
public/characters/v1/{ten_god}.webp
```

用户性别不改变 Character identity。

Style Source of Truth：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

## 11. Current Release Blockers

当前顺序：

1. ✅ Traditional Bazi Rule Audit
2. ✅ Rule Profile Research / Owner Approval / Freeze
3. **TraditionalPatternResult Spec Review + Freeze — ACTIVE**
4. TraditionalPatternResult Build + Golden QA
5. Public Personality authoritative translation
6. isolate / retire legacy engineering authority
7. Character asset / routing completion
8. Result / Share integration QA
9. mobile browser QA
10. full CI
11. PR #16 Ready
12. merge main
13. Vercel Production
14. final public smoke test

## 12. Current Out of Scope

仍 PARKED：

- Payment；
- AI Advisor / Chat；
- Supabase Live；
- Auth / Account；
- compatibility；
- referral；
- ranking / rarity；
- community / gamification；
- 流月 / 流日等进一步预测功能。

Rule Profile V1 Deferred 继续保持：

- auto true-solar-time authority；
- exact commander-day table authority；
- 假从 final；
- 从儿 / 从势 / 专旺 final；
- 完整化气；
- 外格 / 奇格全集；
- 神煞 / 纳音格局；
- 独立调候 / 盲派 profile。

## 13. Project Operating Rule

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

当前阶段：

```text
Rule Profile = LOCKED
→ TraditionalPatternResult Spec = READY FOR REVIEW
→ Spec Freeze
→ Implementation
```

## 14. Product Integrity Rule

> **命理判断来源讲得清楚，现代人格翻译讲得好看。**

不扩 Scope，不降质量，不自造命理，不使用实验数学权重填补规则空白。
