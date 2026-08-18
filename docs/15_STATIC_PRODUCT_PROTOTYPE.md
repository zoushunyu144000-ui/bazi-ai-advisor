# Static Product Prototype V1

Status: ACTIVE / VISUAL REVIEW ONLY

Branch: `feature/product-loop-v1`

This branch intentionally pauses deeper business wiring and presents a static, fixture-backed visual prototype for user review.

Routes in scope:

- `/`
- `/birth`
- `/result`

Visual direction:

- Eastern Editorial Personality IP
- warm ivory
- ink black
- vermilion
- young modern East-Asian character language
- mobile-first 390px, desktop-safe 1440px

The `/result` page is a long-form Personality Dossier rather than a low-information character poster. It includes identity hero, core drive, A/B modes, dimensions, strengths, pitfalls, work/learning/relationship modes, stress/recovery, Bazi structure, and evidence explanation.

No Supabase Live, Payment, Billing, AI Provider, or production Birth → Bazi → Interpretation wiring should be added until the user explicitly marks the visual prototype APPROVED.

This commit also intentionally refreshes the branch after the Vercel project was linked, so Git integration can create a branch Preview Deployment.
