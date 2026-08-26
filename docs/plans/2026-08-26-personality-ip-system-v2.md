# Personality IP System V2 Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `Executing Plans` task-by-task. Apply `Test-Driven Development` to every behavior or contract change and `Verification Before Completion` before any completion claim.

**Goal:** Replace the incomplete V1 presentation layer with a production-ready ten-character Bazi personality website whose illustration language strictly follows the user-approved “City Observation Editorial” reference.

**Architecture:** Keep deterministic Birth → Bazi → Traditional Pattern → Interpretation boundaries unchanged. Add a versioned presentation registry that maps each Ten God to exactly one canonical character, one V2 asset, visual metadata, and public copy. Rebuild the App Router pages around a shared editorial design system; preserve honest feature gates for live AI, payment, auth, and Supabase services that are not configured.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner, Canvas share-card export, generated transparent PNG/WebP character assets.

---

## Locked visual direction

- Single visual anchor: the user-provided `Bazi Personality Character Style Bible V1` image, copied into `docs/assets/character-style-master-v2.png` for project-local reproducibility.
- Adult urban editorial characters; elongated but believable proportions; simple varied faces; restrained ink outlines; angular flat color blocks; opaque warm ivory paper; subtle print grain; everyday city props.
- Reference-level saturation only. No neon, candy palette, muddy low-contrast wash, anime gloss, 3D, childish chibi, hyper-detailed rendering, religious costume clichés, gangster props, or embedded text.
- Exactly ten canonical IPs, one per public personality. Birth gender remains domain input where calculation needs it but never swaps the canonical character art.
- Canonical cast: 犟种女、撒币男、享乐主义男、天生反骨女、抠抠搜搜女、搞钱圣体男、老干部女、狠人男、活菩萨男、道长女。
- 七杀/狠人 must read as fierce and decisive through a low, forward, square silhouette, narrowed eyes, compressed brows, heavy grounded hands, and a deep burgundy geometric seat—never through weapons, gang styling, or rage caricature.

### Task 1: Freeze V2 design and repository decisions

**Files:**
- Add: `docs/assets/character-style-master-v2.png`
- Add: `docs/24_CHARACTER_STYLE_LOCK_V2.md`
- Modify: `docs/08_DECISION_LOG.md`
- Modify: `docs/09_CURRENT_STATE.md`
- Modify: `docs/10_ROADMAP.md`
- Modify: `.gitignore`
- Modify: `eslint.config.mjs`

**Steps:**
1. Copy the approved user reference into the repository without editing it.
2. Document the palette, line treatment, paper texture, body-vector rules, canonical gender, props, and negative prompts for all ten IPs.
3. Record a decision that V2 supersedes the V1 20-variant asset contract while leaving deterministic domain calculations untouched.
4. Add `/.tmp/` to Git ignore and ESLint global ignores so generated test output cannot poison source lint.
5. Verify with `npm run lint` before and after running `npm test`.

### Task 2: Replace the 20-variant manifest with ten canonical assets (TDD)

**Files:**
- Modify: `tests/interpretation/public-personalities.test.ts`
- Add: `tests/interpretation/character-assets.test.mjs`
- Modify: `scripts/run-test-suite.mjs`
- Modify: `lib/public-personalities.ts`
- Modify: `app/_components/character-art.tsx`
- Modify: all `CharacterArt` call sites under `app/`

**Steps:**
1. Write failing tests asserting exactly ten unique `/characters/v2/<ten-god>.png` paths, fixed canonical genders, required visual metadata, valid PNG signatures, non-trivial dimensions, RGB paper mode, warm-ivory corners, and manifest checksums.
2. Run `npm run test:interpretation` and confirm failure for the missing V2 contract/assets.
3. Add `canonicalGender`, `accent`, `bodyVector`, `heroProp`, and `assetPath` fields to the public registry; bump presentation and visual versions.
4. Change `CharacterArt` to use the canonical asset independent of birth gender and render with `next/image`.
5. Run the focused tests and confirm the registry portion passes while asset existence remains red until Task 3.

### Task 3: Generate and quality-control ten complete IP assets

**Files:**
- Add: `public/characters/v2/bi_jian.png`
- Add: `public/characters/v2/jie_cai.png`
- Add: `public/characters/v2/shi_shen.png`
- Add: `public/characters/v2/shang_guan.png`
- Add: `public/characters/v2/zheng_cai.png`
- Add: `public/characters/v2/pian_cai.png`
- Add: `public/characters/v2/zheng_guan.png`
- Add: `public/characters/v2/qi_sha.png`
- Add: `public/characters/v2/zheng_yin.png`
- Add: `public/characters/v2/pian_yin.png`
- Add: `public/characters/v2/manifest.json`
- Add: `public/characters/v2/README.md`

**Steps:**
1. Use the approved reference as the image-generation reference for every asset; generate one isolated full-body character per call, seamless warm-ivory paper background, no text/logo/watermark.
2. Keep a shared prompt spine and vary only the fixed face, silhouette, clothing accents, pose, and one everyday prop.
3. Inspect every image at original resolution; reject clipped feet/hands, costume clichés, duplicate faces, palette drift, checkerboard backgrounds, weak silhouette, and any embedded glyphs.
4. Save accepted originals under the exact manifest paths and record dimensions, checksum, canonical gender, palette, and prompt revision.
5. Run `node --test tests/interpretation/character-assets.test.mjs` and require green.

### Task 4: Build the shared City Observation Editorial design system

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/_components/site-nav.tsx`
- Modify: `app/_components/site-footer.tsx`
- Add: `app/_components/editorial/*`

**Steps:**
1. Write component/DOM contract tests for landmark labels and accessible navigation where practical.
2. Replace the generic cream/red theme with reference-matched warm ivory, ink black, deep burgundy, muted navy, sage, teal, mustard, dusty pink, and muted purple tokens.
3. Add subtle CSS paper grain, thin editorial rules, asymmetric grids, restrained shadows, and consistent focus/reduced-motion behavior.
4. Build reusable eyebrow, section rule, dossier card, personality badge, character stage, evidence strip, and status components.
5. Run lint, typecheck, and focused tests.

### Task 5: Rebuild the complete public journey

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/birth/page.tsx`
- Modify: `app/result/page.tsx`
- Modify: `app/report/page.tsx`
- Modify: `app/advisor/page.tsx`
- Modify: `app/account/page.tsx`
- Modify: relevant components under `app/_components/`

**Steps:**
1. Add failing route/content tests for the promised states: landing, birth entry, loading, deterministic result, long report preview, advisor gate, and account/history empty state.
2. Rebuild the landing page as an editorial club directory with the ten complete IPs, not ten repetitive generic cards.
3. Rebuild birth entry with a calm guided form, honest privacy copy, timezone/unknown-hour handling, and mobile-first error states.
4. Rebuild result as a collectible personality dossier: dominant IP, secondary personality, behavior dimensions, evidence disclosure, and Canvas share poster.
5. Turn report/advisor/account placeholders into coherent product surfaces with honest local/demo or unavailable states when live providers are absent; do not fake purchases or AI answers.
6. Verify keyboard navigation, responsive layout, empty/error/loading states, and copy consistency.

### Task 6: Documentation, visual QA, and final verification

**Files:**
- Modify: `docs/00_PROJECT_INDEX.md`
- Modify: `docs/03_DESIGN_SYSTEM.md`
- Modify: `docs/09_CURRENT_STATE.md`
- Modify: `docs/10_ROADMAP.md`
- Modify: `docs/12_REUSE_AND_REFERENCES.md`
- Add: `docs/handoffs/2026-08-26-personality-ip-system-v2.md`

**Steps:**
1. Update documentation to reflect what is implemented versus still feature-gated.
2. Run the app locally and capture desktop/mobile screenshots of `/`, `/birth`, and a deterministic `/result` flow.
3. Compare the ten-character page against the approved reference for proportions, line quality, saturation, palette relationships, and urban-editorial mood.
4. Run the latest complete verification suite: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. Record exact command results, remaining provider prerequisites, asset manifest checksums, branch name, and commit list in the handoff.
