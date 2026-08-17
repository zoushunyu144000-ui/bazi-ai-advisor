# BaZi Open Source Benchmark — 2026-08-18

Status: benchmark gate before the next major BaZi engine change.

This document intentionally treats existing `modules/bazi/**` code as replaceable. The project keeps its own Domain Contract, Adapter boundary, rule profiles, versioning and regression tests even when calculation responsibilities move to an upstream library.

## Evidence legend

- **✅T** — capability found in source and backed by relevant upstream tests.
- **✅C** — capability verified in source; focused upstream test was not located in this review.
- **◐** — partial, indirect, generic-calendar support, or integration caveat.
- **—** — not found / not provided for this use case.

Maintenance dates below are repository/default-branch evidence observed on 2026-08-18, not a promise of future maintenance.

## Capability matrix

| Candidate | License / maintenance | Tests | Solar terms | Four pillars | Ten Gods | Da Yun | DST / IANA | True solar time | China historical time | Liu Nian / Liu Yue | Stem/branch relations | Role recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `tyme4ts@1.5.2` (`6tail/tyme4ts`) | MIT; pushed 2026-08-17; mature adoption | ✅T Mocha; dedicated `EightCharTest` | ✅T astronomical solar-term API, ShouXing/sxwnl-derived implementation | ✅T | ✅T | ✅T child-limit / decade-fortune tests | — library uses civil `SolarTime`; no IANA/DST API found | — | — | Liu Nian ✅T; dedicated Liu Yue ◐ | ◐ combinations/harm and broad traditional objects, but not chosen as the relation authority here | **Keep as traditional BaZi reference / optional calculation provider behind Adapter.** Do not let it own timezone semantics. |
| `mingyu-core@0.1.29` (`Brhiza/mingyu`) | MIT at `packages/core/LICENSE`; pushed 2026-08-17 | ✅T extensive core test runner; boundary, luck, true-solar and time-policy tests present | ✅T, but primary BaZi calendrical dependency includes `tyme4ts`; also has independent astronomical evidence paths | ✅T | ✅T | ✅T | ✅T runtime IANA resolver with gap/overlap diagnostics | ✅T | ✅T dedicated China DST 1986–1991 plus historical-timezone module | ✅T year/month/day selection and Jie timing | ✅T 五合/冲/六合/刑/害/破 and trigger analysis | **Best high-level product benchmark, not an independent oracle versus tyme4ts.** Reuse ideas selectively; avoid binding the commercial Domain to the whole monorepo. |
| `@4n6h4x0r/stem-branch@0.8.0` (`h4x0r/stem-branch`) | Apache-2.0; repo pushed 2026-08-16; small/young project | ✅T Vitest; timezone, true-solar and astronomy tests | ✅T VSOP87D-based exact terms; project documents JPL validation | ✅T | ✅T | ✅T major/minor luck APIs | ✅T embedded IANA transitions for 78 zones (1900–2026) + Intl fallback | ✅T | ✅T explicitly covers PRC DST 1986–1991, Taiwan/HK/Japan/Singapore historical changes | ◐ generic sexagenary/calendar support; no dedicated Liu Yue product API confirmed | ✅T 五合/冲、六合/六冲/三合/三会/刑/害/破/暗合 etc. | **Strongest candidate to replace/augment our custom astronomy + historical-time layer, behind our Adapter. Also an independent pillar oracle.** |
| `@stillnessdao/bazi-engine@0.9.0` (`David88666/bazi-engine`) | MIT; last commit 2026-07-23; very new, 0-star/0-fork at review | ◐ only four basic Node tests located | ✅C low-order apparent-solar-longitude solver; weaker evidence than stem-branch/tyme4ts | ✅C / basic test | ✅C | ✅C | ◐ uses runtime `Intl` IANA data; no explicit gap/overlap policy found | ✅T basic Urumqi test | ◐ inherited from runtime IANA; no dedicated China historical policy | ✅C both `annualFlow` and `monthlyFlow` exist in result schema/source | ◐ interaction keys / compatibility logic exist, but not as comprehensively evidenced | **Secondary independent sanity reference only for now.** Do not use as primary calendar authority without much stronger golden tests. |
| `manseryeok@2.0.0` (`yhj1024/manseryeok`) | MIT; repo pushed 2026-08-01; 35 stars / 23 forks at review | ✅T Vitest + golden + cross-validation tests | ✅T precomputed precision term data (1800–2300) and astronomy helpers | ✅T | ✅T | ✅T | ✅T for its historical-time/true-solar pipeline, primarily Korea-oriented | ✅T | ◐ historical rules are Korea-focused; not a China historical-time authority | — / — dedicated flow APIs not found | — comprehensive relation suite not found | **Useful independent core-pillar oracle, especially for explicit Zi-hour rule profiles. Not a complete replacement for our China/overseas product needs.** |

## Important independence note

`mingyu-core` is feature-rich, but its package directly depends on `tyme4ts`. Therefore `mingyu-core` and `tyme4ts` must **not** be counted as two independent calendrical authorities when validating the same Four Pillars boundary.

For reference vectors, prefer combinations such as:

1. `tyme4ts` + `stem-branch`, or
2. `stem-branch` + `manseryeok`,

with `David88666/bazi-engine` as an additional low-confidence sanity reference where useful.

## Executed reference vectors

A temporary GitHub Actions benchmark ran on Node 22 with `TZ=Asia/Shanghai` and pinned:

- `tyme4ts@1.5.2`
- `@4n6h4x0r/stem-branch@0.8.0`
- `manseryeok@2.0.0`

The raw evidence was posted by GitHub Actions to PR #5. These are observed outputs, not copied README examples.

### Consensus vectors

| Local civil input | tyme4ts | stem-branch | manseryeok | Conclusion |
|---|---|---|---|---|
| 2005-12-23 08:37 | 乙酉 戊子 辛巳 壬辰 | 乙酉 戊子 辛巳 壬辰 | 乙酉 戊子 辛巳 壬辰 | 3-way exact agreement |
| 1992-02-02 12:00 (pre-Li-Chun) | 辛未 辛丑 戊申 戊午 | 辛未 辛丑 戊申 戊午 | 辛未 辛丑 戊申 戊午 | 3-way exact agreement |
| 2000-02-29 12:00 (leap day) | 庚辰 戊寅 丁巳 丙午 | 庚辰 戊寅 丁巳 丙午 | 庚辰 戊寅 丁巳 丙午 | 3-way exact agreement |

These are safe golden candidates for our current civil-time rule profile.

### Deliberately disputed vector: late Zi hour

Input: **1988-02-15 23:30**

| Provider / profile | Output |
|---|---|
| tyme4ts 1.5.2 | 戊辰 甲寅 辛丑 戊子 |
| manseryeok `jasi` | 戊辰 甲寅 辛丑 戊子 |
| stem-branch 0.8.0 | 戊辰 甲寅 庚子 戊子 |
| manseryeok `splitJasi` | 戊辰 甲寅 庚子 戊子 |
| manseryeok `midnight` | 戊辰 甲寅 庚子 丙子 |
| this project `civil-local-jieqi-v1` | expected to follow the `midnight` semantics: day does not advance and hour stem derives from the same civil-day stem |

This is **not an accuracy failure**. It is direct evidence that late-Zi treatment is a school/rule-profile choice. We must never silently change it because another library uses a different convention.

### Historical China timezone vector

For `Asia/Shanghai`, local `1990-06-01 12:00`, `stem-branch@0.8.0` returned **UTC offset +540 minutes (UTC+9)**, correctly reflecting PRC daylight-saving time in 1990.

This capability is materially stronger and more explicit than our current `modules/bazi/timezone.ts`, which resolves through runtime `Intl.DateTimeFormat` and has good gap/overlap behavior but does not pin its own tzdata version or expose historical-rule provenance.

## Replacement / reuse decision

### 1. Do not replace the project Domain Contract

Keep:

- `types/domain/**`
- `BaziEngineResult` normalization
- project-owned `engine_version` and `rule_profile_version`
- deterministic IDs / metadata
- project regression fixtures

Third-party objects must continue to stop at Adapter boundaries.

### 2. Highest-priority replacement candidate: time + astronomy foundation

Before extending our custom timezone / solar-term code, prototype a **second provider Adapter** around `@4n6h4x0r/stem-branch` for:

- IANA local time ↔ UTC
- historical DST / standard-time rules
- solar-term instants
- optional true solar time

Why: it already carries deterministic embedded IANA transitions and explicit East Asian historical coverage, plus a substantially stronger astronomy validation story than our current handwritten time layer.

Do **not** immediately delete the current provider. Run both against shared reference vectors first, then switch a rule profile/provider version only after equivalence is proven for non-disputed cases.

### 3. Reuse traditional primitives rather than re-implementing more tables

For future hidden stems, Ten Gods, branch/stem relation expansion, and Da Yun details, evaluate delegating to `stem-branch` and/or `tyme4ts` through normalization adapters. Do not grow additional handwritten mapping tables unless the rule profile genuinely differs from upstream behavior.

### 4. Keep school-dependent interpretation in our rule layer

Do not outsource as a single opaque truth:

- late-Zi convention
- true-solar-time enable/disable policy
- Da Yun start-age school choices when variants differ
- element-strength weighting
- 格局 / 调候 / 用神 adjudication

Those belong to explicit `rule_profile_version` semantics and project tests.

### 5. `mingyu-core` is a benchmark, not the foundation dependency

It is currently the broadest TypeScript implementation reviewed and is valuable for feature parity, boundary handling, fortune-layer and relation design. But because it is a fast-moving multi-metaphysics monorepo and itself depends on `tyme4ts`, importing the whole stack would increase coupling without giving us a second independent calendar authority.

### 6. `David88666/bazi-engine` is not yet strong enough for primary production authority

Its API shape is relevant and it demonstrates true-solar/luck/monthly-flow concepts, but the repository is very new and the located automated test suite is too small. Keep it as a reference implementation until its validation corpus and maintenance history mature.

## Gate for the next major Engine change

Before any major replacement or feature expansion:

1. Add/keep consensus golden vectors in `tests/bazi/**`.
2. Add disputed vectors tagged with the intended rule profile rather than forcing cross-library equality.
3. Prototype upstream provider changes behind Adapter interfaces.
4. Cross-run at least two independent implementations at Li Chun/Jie boundaries, late Zi, DST gaps/overlaps and historical China DST cases.
5. Only then change `engine_version` / `rule_profile_version` and migrate production behavior.

## Reviewed upstream revisions

- `6tail/tyme4ts`: `9e776099e164c43fd932684875057fe345773241`
- `Brhiza/mingyu`: `9838996a959e15eb86208a037ccbfeeb4e9c9a3b`
- `h4x0r/stem-branch`: `154f232c96930d12c5c4031e4cc1ecbdac440755`
- `David88666/bazi-engine`: `ee8fac7c336ff7ba471fde6f4c5e8bfa0e86e141`
- `yhj1024/manseryeok`: `fba3253d7305b8b61189bd78318a7a27ed8c9b09`

Re-run the benchmark before relying on newer upstream versions.
