# 10 — Roadmap

状态：**V1 Release Freeze — P0 Release Closure Only**  
最后更新：2026-08-21

## 0. Roadmap boundary / Source of Truth

本文件只描述：**接下来做什么**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. older docs / experiments / historical research

如果本文件与 Personality IP Bible 冲突，以 `docs/13_PERSONALITY_IP_BIBLE.md` 为准。

Roadmap 不重新定义 Public Personality 名称、Character Style 或 V1 核心产品方向。

## 1. V1 Release Freeze objective

V1 的唯一目标：让陌生用户完整走通：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ 10 Public Personalities
→ full Personality Dossier
→ formal Character
→ Share Card
→ friend can open the website and test
```

只要这条链路成立并通过最终 QA，就允许发布 V1。

不以 AI、Payment、Supabase、Advisor、Relationship feature 是否完成作为首发条件。

## 2. P0 — Release closure sequence

当前只按以下顺序执行：

1. Documentation / Source of Truth sync
2. 20 / 20 formal Character Assets
3. Homepage Character integration QA
4. Result Character integration QA
5. Share Card real-image QA
6. mobile browser QA
7. full CI
8. PR #16 Ready
9. merge main
10. Vercel Production
11. final public smoke test

当前最大的 Release Blocker：

**20 / 20 formal Character Assets + final QA**。

不是 AI，不是 Payment，不是 Supabase，不是 Advisor，也不是 Relationship feature。

## 3. P0.1 — Documentation / Governance Sync

状态：**本轮执行**。

要求：

- Personality IP Bible 保持最高产品 Source of Truth；
- `shi_shen` 正式公网人格只使用 **享乐主义**；
- 旧名称“好吃懒做”保持 retired；
- Current State 只写当前事实；
- Roadmap 只写下一步；
- Character Style 状态统一为 **LOCKED → formal Character Production**；
- 新想法只进 Post-V1 / V1.1 Parking Lot。

完成后不再继续做治理扩写，直接进入 Character Production。

## 4. P0.2 — 20 / 20 formal Character Assets

状态：**NEXT / BLOCKER**。

正式 Character contract：

```text
public/characters/v1/{ten_god}-male.webp
public/characters/v1/{ten_god}-female.webp
```

10 personalities × male/female = **20 formal assets**。

正式人格：

| Machine key | Public personality |
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

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

Style selection 已完成。不得重新做 3 套 Style Pilot，不得重新选画风，不得使用“好吃懒做”作为正式 Character identity。

`docs/16_CHARACTER_BATCH_PRODUCTION_V1.md` 中的 Production Pilot / pair gate 只负责验证锁定风格的一致性，不是 Style Exploration。

正式角色缺失时不得回退 CSS / SVG / placeholder / silhouette / legacy 25 archetype character。

当前正式资产状态：**0 / 20**。

## 5. P0.3 — Character integration QA

20 / 20 到位后，按顺序验证：

### Homepage Character integration QA

- 10 personality cards 使用正式图片；
- 缩小后识别度；
- 不出现 fallback character；
- 首屏加载策略正常。

### Result Character integration QA

- dominant personality Hero 正确；
- male / female contract 正确；
- secondary personality 使用正式资产；
- reload / back / error state 不出现 placeholder。

### Share Card real-image QA

- 1080 × 1350 feed card；
- 1080 × 1920 Story / XHS card；
- 正式 Hero Character 清晰；
- Web Share / PNG fallback / copy result；
- 缺图必须显式失败。

## 6. P0.4 — Mobile / browser QA

至少完成：

- 390px
- 430px
- 768px
- 1440px

完整走查：

Homepage → Birth → Result → Share Card → public return URL。

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

通过后严格执行：

```text
PR #16 Draft
→ Ready for review
→ merge main
→ Vercel Production
→ final public smoke test
```

只有 public smoke test 通过，V1 才算发布完成。

## 8. Post-V1 / V1.1 Parking Lot

以下项目当前全部 **PARKED**。可以记录 Recommendation，但不得在 V1 Release Freeze 中实现：

- 双人人格关系
- compatibility / matching
- referral system
- invitation challenge system
- AI Advisor
- AI Chat
- payment
- ¥9.9 report checkout
- Supabase Live
- Auth
- Account
- Analytics full system
- ranking
- rarity percentage
- new personality types
- new Character Style
- new Bazi prediction features
- 用神
- 流月 / 流日
- complex Traditional Pattern expansion
- community
- gamification

如果出现新的产品想法，也只能追加到本 Parking Lot 或后续 Recommendation，不得改变当前 P0 顺序。

## 9. V1 release rule

在 V1 Release Freeze 期间：

**不主动扩 Scope。**

当前 P0 没完成前，不启动新的产品方向、增长系统、AI、支付、关系功能、预测功能或新的视觉体系。