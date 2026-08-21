# 09 — Current State

状态：**V1 Release Freeze — Character Production + Final QA Active**  
最后更新：2026-08-21

## 0. Source of Truth boundary

本文件只描述：**现在真实做到哪里**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. older docs / experiments / historical research

如果本文件与 `docs/13_PERSONALITY_IP_BIBLE.md` 冲突，以 Personality IP Bible 为准。本文件不得重新定义 Public Personality 名称、Character Style 或 V1 产品边界。

## 1. 当前产品与 Release Freeze

产品已正式收敛为：

**八字版 SBTI + 抽象人格 IP + 免费分享传播 + Post-V1 轻付费扩展。**

当前处于：**V1 Release Freeze**。

V1 唯一发布目标：

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

AI、Payment、Supabase、Advisor、Relationship 等系统都不是当前 V1 release blocker。

## 2. Repository / PR baseline

当前工作分支：

`release/v1-personality-rc`

当前 Draft PR：

`#16 release: V1 public personality experience`

PR base：`main`。  
本轮治理同步前 PR HEAD：`5ff76ca5f23f76ec1093db91dc542d8e0bbd4c1e`。

Vercel Production：`bazi-ai-advisor.vercel.app`。

当前 Preview 固定别名：

`bazi-ai-advisor-git-release-v1-personality-rc-zuriel144000.vercel.app`

Preview 可用于 QA；PR #16 在 20 / 20 formal Character assets 与最终 QA 完成前保持 Draft。

## 3. Deterministic Core Chain

已经进入 `main` 的核心事实链保持为：

```text
Birth
→ Bazi Engine
→ Interpretation
```

公网 V1 正式复用：

```text
normalizeBirthProfile()
→ calculateBazi()
→ interpretBaziChart()
→ selectArchetypeCandidate()
```

Presentation Layer 不重新排八字，不随机生成十神，不随机生成 dimensions。

### Birth V1 UX

release branch 已接入：

- 阳历出生日期
- 知道 / 不知道出生时间
- approximate time 支持
- male / female character selection
- V1 真实静态城市表
- IANA timezone resolution
- 手动 city / country / countryCode / lat / lon / timezone fallback
- DST ambiguous / nonexistent time 错误提示

`StaticLocationProvider + IanaHintTimezoneResolver` 被正式复用，因此免费 V1 不依赖 Live Location Provider。

未知出生时间不会偷偷补中午 12:00；系统保留时柱未知的不确定性。

## 4. 10 Public Personalities — LOCKED

公网 V1 只使用以下 10 个锁定人格：

| Machine key | Ten-God | Public personality |
| --- | --- | --- |
| `bi_jian` | 比肩 | 犟种 |
| `jie_cai` | 劫财 | 撒币 |
| `shi_shen` | 食神 | 享乐主义 |
| `shang_guan` | 伤官 | 天生反骨 |
| `zheng_cai` | 正财 | 抠抠搜搜 |
| `pian_cai` | 偏财 | 搞钱圣体 |
| `zheng_guan` | 正官 | 老干部 |
| `qi_sha` | 七杀 | 狠人 |
| `zheng_yin` | 正印 | 活菩萨 |
| `pian_yin` | 偏印 | 道长 |

`shi_shen` 的旧试制名“好吃懒做”已经 retired，不得继续用于正式 Production Task、角色资产或公网文案。

Canonical Registry：`lib/public-personalities.ts`。

当前覆盖：

- Registry：**10 / 10 implemented**
- Complete Public Copy：**10 / 10 implemented**
- six Tags：**10 / 10 implemented**
- Result copy contract：**10 / 10 implemented**
- Share copy contract：**10 / 10 implemented**

### Proxy honesty

完整 `TraditionalPatternResult` 仍未 Production-ready。

因此：

- `bi_jian → 犟种 / 建禄` 是 Presentation Proxy Mapping；
- `jie_cai → 撒币 / 月劫` 是 Presentation Proxy Mapping。

不得把它描述为 Engine 已经正式完成建禄/月劫格局判定。

## 5. Public experience implementation

### Second Personality / Dimensions

Second Personality 正式消费 `archetype_seed.secondary_ten_god`。

Personality Dimensions 正式消费 `personality-map/0.2.0` 的真实 15 项 machine output，只在公网做年轻化 label 翻译。

`lib/personality-archetypes.ts` 中 5 Elements × 5 Families = 25 的体系状态为：**experimental / legacy presentation experiment**，不参与新 Public Result。

### Homepage

release branch 已实现：

- 首屏定位与 CTA
- 10 人格预览
- 确定性工作方式说明
- Personality Dossier Preview
- Share Card Preview
- 再次 CTA

### Result

已实现完整 18 段 Personality Dossier，并展示真实 second personality、15 dimensions 与专业八字依据折叠区。

### Share Loop

已实现：

- 1080 × 1350 feed card Canvas rendering
- 1080 × 1920 Story / XHS card Canvas rendering
- Web Share files（支持时）
- PNG download fallback
- copy result
- stable production return URL

正式 Character asset 缺失时 Share Card 必须显式失败，不允许回退 placeholder。

## 6. Character Visual System V1 — LOCKED / PRODUCTION ACTIVE

Character Style selection 已完成，不再等待画风选择，也不再做 3 套 Style Pilot。

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

正式资产 contract：

`public/characters/v1/{ten_god}-{gender}.webp`

共 10 personalities × male/female = **20 assets**。

当前仓库真实状态：`public/characters/v1/` 只有 `README.md`，因此正式 Character binary 数量是：**0 / 20**。

正式角色缺失时不得回退：

- CSS person
- SVG character
- placeholder
- silhouette
- legacy 25 archetype character

当前最大 Release Blocker：**20 / 20 formal Character Assets + final QA**。

## 7. 当前 V1 P0 执行顺序

严格按以下顺序收尾，不主动扩 Scope：

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

本轮 Documentation / Source of Truth sync 完成后，唯一下一阶段工作应进入 **20 / 20 formal Character Assets**。

## 8. CI / QA 当前状态

本轮治理同步前 PR HEAD：`5ff76ca5f23f76ec1093db91dc542d8e0bbd4c1e`。

该 HEAD 已确认：

- GitHub Actions `ci` run #237：**success**
- Vercel status：**success**

最终 Character assets 接入后的 HEAD 仍必须重新通过完整 CI：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

不得通过 skip、降断言或 production personality mock 绕过 gate。

## 9. Browser acceptance pending

最终合并前仍需真实浏览器验收：

- 390px
- 430px
- 768px
- 1440px

重点检查：Homepage、Birth、Result Hero、Long Result、formal Characters、Share Card、Save / Share、Navigation、Reload、Back、Error、Unknown birth time。

当前没有 20 张正式 Character binary，因此 real-image integration QA 尚未开始。

## 10. Post-V1 / V1.1 Parking Lot

V1 Release Freeze 期间禁止新增以下功能，只允许记录：

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

新的产品想法只进入 Post-V1 / V1.1 Recommendation，不得在本次 Release Freeze 中实现。

## 11. Production release gate

已完成：

- [x] Source of Truth hierarchy established
- [x] 10 / 10 Public Registry
- [x] 10 / 10 complete Public Copy
- [x] `shi_shen = 享乐主义` locked
- [x] deterministic Birth → Bazi → Interpretation → Public mapping
- [x] real secondary personality
- [x] real dimensions
- [x] full Result Dossier implementation
- [x] Share rendering implementation
- [x] Character Style selected and LOCKED

仍阻塞发布：

- [ ] 20 / 20 formal Character assets
- [ ] Homepage Character integration QA
- [ ] Result Character integration QA
- [ ] Share Card real-image QA
- [ ] mobile / viewport browser QA
- [ ] full CI on final asset-integrated HEAD
- [ ] PR #16 Ready / merge main
- [ ] Vercel Production
- [ ] final public smoke test

**AI、Payment、Supabase、Advisor、Relationship feature 均不是 V1 blocker。**