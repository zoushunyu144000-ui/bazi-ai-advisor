# Personality Archetype Taxonomy — Machine Contract v0.2

状态：V1 machine taxonomy for Interpretation → Product/Visual binding

Mapping version：`personality-map/0.2.0`

## 1. Purpose

This document defines the stable machine-layer archetype taxonomy produced by `modules/interpretation`.

It exists so downstream product and visual work can bind a stable `archetype_code` to character assets, display names and young-user-facing meme language without putting those presentation choices inside the deterministic personality algorithm.

This is a traditional Bazi structure → modern behavioral interpretation model. It is not MBTI, clinical psychometrics, diagnosis or a scientific personality test.

## 2. Canonical input boundary

Interpretation must consume:

```text
BaziChart
+
canonical BaziDerivedFeatures (owned by 02)
↓
Interpretation Signals
↓
Personality Dimensions
↓
Archetype Candidate
```

04 does **not** independently calculate or replace:

- element distribution
- Ten-God distribution
- day-master strength
- seasonal context
- traditional structural tags

Those are canonical facts owned by the deterministic Bazi Engine.

04 may derive interpretation-only signals from canonical inputs:

- `element_balance`
- `ten_god_concentration`
- `visible_yang_ratio`
- personality contributor scores
- behavior dimensions
- archetype candidate ranking

## 3. Stable machine output

`ArchetypeCandidate` exposes:

```text
archetype_code
archetype_seed
dominant_pattern
secondary_pattern
personality_dimensions
confidence
positive_mode
stress_mode
mapping_version
```

These are machine fields. Final public-facing personality names, internet meme labels, character names, illustration style and copy belong to 05 / product presentation layers.

## 4. Ten-God coverage

Every canonical Ten-God remains individually rankable. No type is omitted.

| Pattern family | Ten-God machine key | Traditional label |
| --- | --- | --- |
| peer | `bi_jian` | 比肩 |
| peer | `jie_cai` | 劫财 |
| output | `shi_shen` | 食神 |
| output | `shang_guan` | 伤官 |
| wealth | `zheng_cai` | 正财 |
| wealth | `pian_cai` | 偏财 |
| authority | `zheng_guan` | 正官 |
| authority | `qi_sha` | 七杀 |
| resource | `zheng_yin` | 正印 |
| resource | `pian_yin` | 偏印 |

**比劫 coverage is mandatory:** `bi_jian` and `jie_cai` are separate candidate patterns. They share the `peer` family for coarse grouping but never collapse into one indistinguishable archetype seed.

## 5. Multi-factor candidate model

A dominant archetype is not selected by a single Ten-God label.

Each of the ten candidate patterns is scored using four inputs:

```text
candidate_score
= 52% canonical Ten-God score
+ 18% family score
+ 22% personality-dimension fit
+  8% day-master-strength fit
```

The exact weights are versioned engineering hypotheses under `personality-map/0.2.0`; they are expected to be calibrated later with real user feedback rather than treated as universal doctrine.

### Pattern families

```text
peer       = 比肩 + 劫财
output     = 食神 + 伤官
wealth     = 正财 + 偏财
authority  = 正官 + 七杀
resource   = 正印 + 偏印
```

Family scores provide context but do not replace individual Ten-God ranking.

### Personality-dimension fit

Examples of machine signatures:

- `bi_jian`: autonomy, competition drive, lower external-validation dependence
- `jie_cai`: competition drive, risk tolerance, conflict directness, autonomy
- `shi_shen`: expression drive, social adaptation, learning orientation
- `shang_guan`: expression drive, novelty seeking, autonomy, lower structure need
- `zheng_cai`: planning, control, social adaptation, structure
- `pian_cai`: risk tolerance, social adaptation, novelty seeking, decision speed
- `zheng_guan`: structure need, planning, external-standard reference, control
- `qi_sha`: competition, decision speed, conflict directness, pressure action
- `zheng_yin`: learning, structure, planning, reflective decision style
- `pian_yin`: learning, novelty, emotional sensitivity, energy variability

The dimensions modify archetype ranking; they do not overwrite canonical traditional facts.

## 6. Stable `archetype_code`

Format:

```text
DM_<DAY_MASTER_ELEMENT>_<PATTERN_FAMILY>_<DOMINANT_TEN_GOD>_<INTENSITY>
```

Examples:

```text
DM_WOOD_OUTPUT_SHANG_GUAN_HIGH
DM_METAL_AUTHORITY_ZHENG_GUAN_HIGH
DM_WATER_PEER_BI_JIAN_MODERATE
DM_FIRE_PEER_JIE_CAI_HIGH
DM_EARTH_RESOURCE_PIAN_YIN_MODERATE
```

Allowed day-master elements:

```text
WOOD / FIRE / EARTH / METAL / WATER
```

Allowed families:

```text
PEER / OUTPUT / WEALTH / AUTHORITY / RESOURCE
```

Allowed dominant Ten-God tokens are the upper-case machine keys of all ten Ten-Gods.

Current intensity rule:

- `HIGH`: dominant family score ≥ 28, or dominant candidate exceeds the secondary candidate by ≥ 8 points.
- otherwise `MODERATE`.

The code deliberately does **not** contain gender, final meme name, locale or asset path.

## 7. `archetype_seed`

The seed keeps enough stable context for future product or visual binding without forcing the display layer to reverse engineer the calculation:

```text
day_master_element
day_master_stem
day_master_strength
dominant_ten_god
secondary_ten_god
dominant_family
dimension_signature (top 4 behavioral dimensions)
```

This means two users can share a coarse family but still have different machine seeds and behavioral signatures.

## 8. Dominant and secondary patterns

`dominant_pattern` and `secondary_pattern` both expose:

```text
family
ten_god
canonical_ten_god_score
family_score
dimension_fit
strength_fit
candidate_score
```

Keeping the runner-up is intentional. It prevents downstream copy and visuals from treating a close result as a pure single-label identity.

## 9. Positive mode and stress mode

`positive_mode` combines:

1. the dominant Ten-God pattern's constructive behavioral expression;
2. the most salient personality dimensions' positive expressions.

`stress_mode` combines:

1. the dominant Ten-God pattern's possible overused/stress expression;
2. the most salient personality dimensions' stress expressions.

These are explanatory behavior modes, not diagnoses or fixed personality claims.

## 10. Gender invariance

There is **no male/female branch in the personality or archetype algorithm**.

The same `BaziChart + BaziDerivedFeatures` must produce the same personality dimensions and archetype candidate regardless of visual gender presentation.

05 may create male, female or other visual variants for the same stable `archetype_code`, for example:

```text
DM_WOOD_OUTPUT_SHANG_GUAN_HIGH
  ├─ character_variant_a
  ├─ character_variant_b
  └─ character_variant_c
```

Those asset variants must not feed back into personality scoring.

## 11. Guidance for 05 / Product

Recommended downstream registry:

```text
archetype_code
→ public personality name / meme name
→ character asset set
→ pose / expression variants
→ optional palette / props
→ localized display copy
```

05 should bind assets to `archetype_code`, not duplicate Ten-God scoring logic in UI code.

If product later wants a simpler public taxonomy, several stable machine codes may map to one public-facing family. The machine code should remain available for analytics, reproducibility and future remapping.

## 12. Versioning and calibration

Changing any of these requires review and normally a `mapping_version` bump:

- candidate scoring weights
- family composition
- Ten-God → dimension signature
- intensity threshold
- personality-dimension weighting
- archetype code semantics

Future calibration should compare machine predictions with real user behavior/self-report feedback and conversion/engagement data. Calibration must not silently mutate historical results produced under an older `mapping_version`.
