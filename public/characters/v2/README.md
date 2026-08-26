# Character Visual V2

Formal contract: exactly ten canonical portrait PNG assets, one per Public Personality.

- Style source: `docs/assets/character-style-master-v2.png`
- Registry: `lib/public-personalities.ts`
- Manifest: `public/characters/v2/manifest.json`
- Canvas: 1122 × 1402 RGB PNG
- Background: opaque Warm Ivory editorial paper, nominal `#F6F1E6`
- Character identity and gender are fixed; birth sex never selects a different image.

The first image-generation export rendered a fake checkerboard into RGB pixels instead of producing alpha. Those files were rejected by the asset test. The accepted R2 files replace that grid with a seamless warm-ivory paper field, matching the approved Style Bible and the website stage color. The manifest checksums freeze the accepted files.

Do not add `-male` / `-female` variants, crop these into half-body masters, bake text into them, or replace the paper field with a visible checkerboard.
