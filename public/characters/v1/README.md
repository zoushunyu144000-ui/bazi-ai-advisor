# Character Visual System V1 — Asset Gate

This directory is intentionally asset-gated. **Do not commit placeholder characters.**

## Locked style

Product Owner has selected and locked the V1 visual direction.

Canonical references:

- `docs/assets/character-style-master-v1.webp`
- `docs/13_PERSONALITY_IP_BIBLE.md`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

Style: **Bold Graphic Character / Flat Editorial Character** inside the **City Observation Editorial** world.

Hard rule: **pose may be redesigned; style may not be reinterpreted.**

## Fixed 10-IP contract

As of 2026-08-22:

> **10 Public Personalities = 10 fixed official Character IPs.**

The old male/female dual-asset requirement is retired.

User gender must not select a different character identity. If birth sex/gender remains required by the deterministic Bazi calculation, it is calculation data only.

## Required formal assets

V1 requires exactly these 10 formal WebP Character Masters:

```text
bi_jian.webp
jie_cai.webp
shi_shen.webp
shang_guan.webp
zheng_cai.webp
pian_cai.webp
zheng_guan.webp
qi_sha.webp
zheng_yin.webp
pian_yin.webp
```

Canonical identities:

- `bi_jian` — 犟种 — fixed female character
- `jie_cai` — 撒币 — fixed male character
- `shi_shen` — 享乐主义 — fixed male character
- `shang_guan` — 天生反骨 — fixed female character
- `zheng_cai` — 抠抠搜搜 — fixed female character
- `pian_cai` — 搞钱圣体 — fixed male character
- `zheng_guan` — 老干部 — fixed female character
- `qi_sha` — 狠人 — fixed male character
- `zheng_yin` — 活菩萨 — fixed male character
- `pian_yin` — 道长 — fixed female character

`shi_shen` public identity is **享乐主义**. The retired name “好吃懒做” must not appear in formal assets or public copy.

## Release rules

- 10 / 10 personality identities covered.
- exactly one permanent official character identity per personality.
- same locked face/rendering language across all 10.
- personality recognizable primarily by silhouette, body vector and pose.
- web-sized WebP assets; no oversized raw PNG in public routes.
- no text baked into formal hero images.
- no CSS person, geometric SVG, silhouette or temporary AI placeholder fallback.
- no `{ten_god}-male.webp` / `{ten_god}-female.webp` fallback path.
- Homepage / Result / Share Card use the same fixed Character Master for the same personality.
- Share Card rendering must fail visibly if a formal asset is missing.

## Production sequence

```text
locked master reference
→ 4 Production Pilots
→ silhouette / face / style consistency review
→ complete remaining 6 identities
→ WebP export
→ 10 / 10 manifest check
→ Homepage / Result / Share Card QA
```

First four Production Pilots:

1. `shi_shen.webp` — 享乐主义
2. `shang_guan.webp` — 天生反骨
3. `qi_sha.webp` — 狠人
4. `pian_yin.webp` — 道长

Current status: **0 / 10 formal binaries committed — style and fixed 10-IP architecture are LOCKED; Production Visual Gate remains CLOSED until 10 / 10 + QA.**
