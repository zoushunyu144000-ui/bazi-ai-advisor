# 10 — Roadmap

状态：**V1 Release Freeze — Fixed 10-IP P0 Release Closure**  
最后更新：2026-08-22

## 0. Roadmap boundary / Source of Truth

本文件只描述：**接下来做什么**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
5. older docs / experiments / historical research

## 1. V1 Release Freeze objective

V1 的唯一目标：让陌生用户完整走通：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ 10 Public Personalities
→ full Personality Dossier
→ 10 fixed official Character IPs
→ Share Card
→ friend can open the website and test
```

V1 必须是完整产品体验，不是 prototype。

Payment、AI Advisor、Supabase Live、八字人格光谱 checkout 等未来能力不作为首发阻塞项。

## 2. P0 — Release closure sequence

当前严格按以下顺序执行：

1. Documentation / Source of Truth sync
2. Refactor legacy gender-based Character contract
3. 10 / 10 formal Character Masters
4. Homepage Character integration QA
5. Result Character integration QA
6. Share Card real-image QA
7. mobile browser QA
8. full CI
9. PR #16 Ready
10. merge main
11. Vercel Production
12. final public smoke test

当前最大 Release Blocker：

**legacy gender contract refactor + 10 / 10 fixed Character Masters + final QA**。

## 3. P0.1 — Fixed 10-IP Contract Refactor

状态：**NEXT / BLOCKER**。

2026-08-22 Product Owner 已正式锁定：

> **10 Public Personality = 10 个固定官方 IP。**

旧逻辑：

```text
{ten_god}-male.webp
{ten_god}-female.webp
用户性别 → Character asset
```

新逻辑：

```text
{ten_god}.webp
Public Personality → 唯一固定 Character asset
```

执行要求：

- 移除代码中的 male / female character filename routing；
- Birth 若仍收集用户性别，只保留 deterministic Bazi calculation 语义；
- UI 不再把性别描述为角色选择；
- Result Hero 只按 dominant personality 选择固定角色；
- secondary personality 也只按 personality key 选择固定角色；
- Share Card 只按 personality key 选择固定角色；
- tests / manifests / types / docs 全部同步；
- 不得保留“缺固定角色时回退到 gender asset”的双轨逻辑。

## 4. P0.2 — 10 / 10 formal Character Masters

状态：**BLOCKER**。

正式目录：`public/characters/v1/`

正式资产：

```text
bi_jian.webp        # 犟种 · 固定女角色
jie_cai.webp        # 撒币 · 固定男角色
shi_shen.webp       # 享乐主义 · 固定男角色
shang_guan.webp     # 天生反骨 · 固定女角色
zheng_cai.webp      # 抠抠搜搜 · 固定女角色
pian_cai.webp       # 搞钱圣体 · 固定男角色
zheng_guan.webp     # 老干部 · 固定女角色
qi_sha.webp         # 狠人 · 固定男角色
zheng_yin.webp      # 活菩萨 · 固定男角色
pian_yin.webp       # 道长 · 固定女角色
```

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

当前正式 binary 状态：**0 / 10**。

## 5. P0.3 — Character integration QA

### Homepage

- 10 personality cards 使用固定正式 Character；
- 缩小后人格识别度足够；
- 不出现 fallback / gender alternate；
- 首屏加载策略正常。

### Birth

- 用户性别若保留，仅作为排盘数据；
- 不出现“选择男 / 女角色”产品语义；
- 不因为用户性别改变最终 Character。

### Result

- dominant personality Hero 正确；
- secondary personality Character 正确；
- 同人格所有用户看到同一个固定 Character；
- reload / back / error state 不出现 placeholder。

### Share Card

- 1080 × 1350 feed card；
- 1080 × 1920 Story / XHS card；
- 固定 Hero Character 清晰；
- Web Share / PNG fallback / copy result；
- 缺图必须显式失败。

## 6. P0.4 — Mobile / browser QA

至少完成：390px / 430px / 768px / 1440px。

完整走查：

```text
Homepage → Birth → Result → Share Card → public return URL
```

同时覆盖 unknown birth time、invalid/custom location、reload、back、navigation 与 share fallback。

## 7. P0.5 — Full CI / PR / Production

最终 asset-integrated HEAD 必须通过：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

通过后：

```text
PR #16 Draft
→ Ready for review
→ merge main
→ Vercel Production
→ final public smoke test
```

## 8. 完整产品方向 — 已设计，不阻塞 V1

`docs/17_PRODUCT_DESIGN_REPORT_V1.md` 已定义完整产品终局：

```text
10 fixed Public Personality IPs
→ 免费完整 Personality Dossier
→ Share Loop
→ Bazi Personality Spectrum / 八字人格光谱
→ 轻付费深度报告
→ AI Advisor / 后续顾问能力
```

八字人格光谱采用：

```text
1 主人格
+ 1–2 副人格 / 次级动力
+ N deterministic 八字结构修正因子
```

任何比例 / 纯度 / 权重不得由 LLM 自行编造。

## 9. Post-V1 / V1.1 Parking Lot

当前 PARKED：

- 双人人格关系 / compatibility
- referral / invitation challenge
- AI Advisor / AI Chat
- payment / ¥9.9 report checkout
- Bazi Personality Spectrum implementation
- Supabase Live / Auth / Account
- Analytics full system
- ranking / rarity
- new personality types
- new Character Style
- 用神 / 流月 / 流日
- complex Traditional Pattern expansion
- community / gamification

这些可以继续设计，但不得改变当前 P0 执行顺序。

## 10. V1 release rule

**不扩 Scope，不降质量。**

V1 的完整性标准是：当前发布闭环中的每一环都是真实、正式、可用、可分享、无 placeholder；不是把所有未来商业功能一次性塞进首发。
