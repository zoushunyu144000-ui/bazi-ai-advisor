# 10 — Roadmap

状态：**V1 Product Convergence — Tonight Release Candidate Active**  
最后更新：2026-08-20

## North Star

当前优先级正式调整为：

**八字版 SBTI → 人格 IP → 免费分享传播 → 后续轻付费深度报告 / 成长建议。**

V1 不再以“全功能 AI 算命平台”作为首发 Definition of Done。

## Phase 0 — Foundation / Core Technical Chain

状态：**Completed / Merged**

已进入 `main`：

```text
Birth normalization
→ Bazi Engine
→ Interpretation personality-map/0.2.0
→ Supabase Core code layer
```

核心 deterministic fact ownership 不变；LLM 永远不能重新排八字。

## Phase 1 — Tonight Free Personality RC

目标：一个陌生用户能完整走通：

```text
首页
→ Birth
→ deterministic Bazi
→ Interpretation
→ 10 Public Personalities
→ full Result Dossier
→ Share Card
→ friend referral
```

### 1A. Product Registry / Copy

状态：**Implemented on `release/v1-personality-rc`**

- 10 locked public personalities
- complete public copy contract
- six tags per type
- real dominant Ten-God mapping
- real secondary Ten-God mapping
- 25 experimental archetypes removed from public result flow
- honest bi_jian / jie_cai Presentation Proxy boundary

验收：10 / 10 Registry。

### 1B. Homepage / Birth / Result

状态：**Implemented on release branch / QA active**

Homepage：

- SBTI positioning
- 10 personality preview
- how it works
- result/share preview
- CTA loop

Birth：

- `normalizeBirthProfile()`
- static truthful birth-city records
- IANA timezone resolver
- custom manual location/timezone fallback
- exact/approximate/unknown birth time
- `calculateBazi()`
- `interpretBaziChart()`
- `selectArchetypeCandidate()`

Result：

- 18-section Personality Dossier
- real second personality
- real 15 dimensions
- work / learning / relationship / conflict / stress / recovery / decision / money
- growth advice
- evidence explanation
- professional Bazi fold

### 1C. Share Loop

状态：**Implementation complete / real-asset QA pending**

- 1080 × 1350 feed card
- 1080 × 1920 Story / XHS card
- Web Share when supported
- PNG fallback
- copy result
- return URL

正式 Character asset 缺失时 share generation 必须显式失败，不允许 placeholder。

### 1D. Character Visual System V1

状态：**BLOCKER / Product Owner selection required**

先完成 3 套正式 Style Pilot，每套只画：

- 好吃懒做 male
- 天生反骨 female
- 狠人 male
- 道长 female

三套必须在比例、线条、上色、五官、动作语言、Editorial / internet 感上明显不同。

选择后：

```text
freeze Character Style Bible V1
→ generate 10 × male/female
→ compress to WebP
→ commit 20 / 20
→ Homepage / Result / Share integration QA
```

禁止：CSS 小人、几何 SVG、silhouette、temporary placeholder、廉价十神 cosplay。

### 1E. Final QA / Release

状态：**Pending**

最终 HEAD 必须：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

浏览器必须检查：390 / 430 / 768 / 1440。

还必须验证：

- Homepage
- Birth
- unknown birth time
- invalid/custom location error
- Result Hero
- long Result
- 10 personality registry mapping
- male/female character rendering
- Share Card feed/story
- save/share/copy fallback
- reload/back/navigation
- public URL smoke

所有 gate 通过后：

```text
PR #16 Draft
→ Ready for review
→ merge main
→ Vercel Production
→ final public smoke test
```

## Phase 2 — Paid Full Personality Report

状态：**Deferred until free loop launches**

商业候选：¥9.9 等值。

后续需要：

- final report schema
- AI provider boundary
- ContextAssembler consuming deterministic facts
- structured output validation
- ReportEntitlement
- verified payment fulfillment
- locked/unlocked UI
- retry / recovery

免费 V1 不能为了等支付而延期。

## Phase 3 — AI Advisor

状态：**Deferred**

商业候选：¥29.9 / 10 credits。

研究与 Billing Contract 可以保留，但今晚不接公网免费链路。

后续继续遵守：

```text
reserve
→ AI
→ commit
failure → release
```

## Phase 4 — Supabase Live / Auth / Account

状态：**Deferred**

Supabase Core code layer 已存在，但真实 Project link / migration / RLS / Auth / live CRUD 仍需后续验收。

免费人格 RC 当前使用浏览器 session handoff，不依赖 Supabase env 才能打开。

## Phase 5 — Traditional Pattern Production

状态：**Research exists / production algorithm pending**

完整 `TraditionalPatternResult` 未来必须由 deterministic Bazi layer 产生并带 explicit rule profile。

在此之前：

- `bi_jian → 建禄` 不得伪装成正式格局判定；
- `jie_cai → 月劫` 不得伪装成正式格局判定。

V1 Presentation Proxy 会在 UI / docs 中明确标记。

## Phase 6 — Analytics / Conversion

状态：**Deferred**

免费分享闭环公开后再接：

- start-test conversion
- Birth completion
- result share rate
- share referral
- paid report conversion
- payment failure
- Advisor usage / repurchase

## Phase 7 — Stable Commercial Launch

在免费 V1 已验证传播后，再逐步补齐：

- Supabase Live
- Auth / Account
- production payment
- ReportEntitlement
- AI report
- Advisor credits
- permissions / RLS
- privacy / terms
- monitoring
- analytics

## Scope guard

当前产品仍只做：**八字人格**。

在免费人格传播与商业转化得到数据验证前，不提前扩张紫微、奇门、塔罗、面相、手相、风水、社区或真人大师平台。
