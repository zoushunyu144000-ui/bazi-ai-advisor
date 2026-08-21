# Character Visual System V1 — Asset Gate

This directory is intentionally asset-gated. **Do not commit placeholder characters.**

## Locked style

Product Owner has selected and locked the V1 visual direction.

Canonical references:

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

Style: **Bold Graphic Character / Flat Editorial Character** inside the **City Observation Editorial** world.

Hard rule: **pose may be redesigned; style may not be reinterpreted.**

## Required formal assets

The V1 release requires exactly these 20 formal WebP hero assets:

```text
bi_jian-male.webp
bi_jian-female.webp
jie_cai-male.webp
jie_cai-female.webp
shi_shen-male.webp
shi_shen-female.webp
shang_guan-male.webp
shang_guan-female.webp
zheng_cai-male.webp
zheng_cai-female.webp
pian_cai-male.webp
pian_cai-female.webp
zheng_guan-male.webp
zheng_guan-female.webp
qi_sha-male.webp
qi_sha-female.webp
zheng_yin-male.webp
zheng_yin-female.webp
pian_yin-male.webp
pian_yin-female.webp
```

`shi_shen` public identity is **享乐主义**. Do not use the retired pilot name “好吃懒做” in formal assets or public copy.

## Release rules

- 10 / 10 personality identities covered.
- male + female version for every identity.
- same locked face/rendering language across all 20.
- personality must be recognizable primarily by silhouette, body vector and pose.
- web-sized WebP assets; no oversized raw PNG in public routes.
- no text baked into formal hero images.
- no CSS person, geometric SVG, silhouette or temporary AI placeholder fallback.
- only the homepage lead character is eager-loaded; list characters stay lazy-loaded.
- Share Card rendering uses the same formal asset contract and must fail visibly if an asset is missing.

## Production sequence

```text
locked master reference
→ 4 Production Pilots
→ silhouette / face / style consistency review
→ 10 male/female identity pairs
→ WebP export
→ 20 / 20 manifest check
→ Homepage / Result / Share Card QA
```

First four Production Pilots:

1. `shi_shen-male.webp` — 享乐主义 · 男
2. `shang_guan-female.webp` — 天生反骨 · 女
3. `qi_sha-male.webp` — 狠人 · 男
4. `pian_yin-female.webp` — 道长 · 女

Current status: **0 / 20 formal binaries committed — style is LOCKED, Production Visual Gate remains CLOSED until 20 / 20 + QA.**