# 09 — Current State

状态：**V1 Release Freeze — Fixed 10-IP Character Production + Final QA Active**  
最后更新：2026-08-22

## 0. Source of Truth boundary

本文件只描述：**现在真实做到哪里**。

Source of Truth precedence：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
5. older docs / experiments / historical research

如果本文件与 `docs/13_PERSONALITY_IP_BIBLE.md` 冲突，以 Personality IP Bible 为准。

## 1. 当前产品与 Release Freeze

产品已正式收敛为：

**八字版 SBTI + 10 个固定人格 IP + 完整免费分享传播 + Post-V1 八字人格光谱 / 轻付费扩展。**

V1 唯一发布目标：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ 10 Public Personalities
→ full Personality Dossier
→ fixed official Character IP
→ Share Card
→ friend can open the website and test
```

AI、Payment、Supabase、Advisor、Relationship 不是当前 V1 release blocker。

## 2. Repository / PR baseline

当前工作分支：`release/v1-personality-rc`  
当前 Draft PR：`#16 release: V1 public personality experience`  
PR base：`main`。

Vercel Production：`bazi-ai-advisor.vercel.app`。

Preview 可用于 QA；PR #16 在 10 / 10 fixed formal Character assets 与最终 QA 完成前保持 Draft。

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
- 用户性别字段
- V1 真实静态城市表
- IANA timezone resolution
- 手动 location / timezone fallback
- DST ambiguous / nonexistent time 错误提示

**重要：2026-08-22 新产品 contract 已取消“用户性别 → 男 / 女 Character”的映射。**

用户性别若仍为 deterministic Bazi Engine 所需，可继续作为排盘数据；但现有 UI / character routing 中任何“male / female character selection”语义都属于 **legacy pending refactor**。

## 4. 10 Public Personalities — LOCKED

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

Canonical Registry：`lib/public-personalities.ts`。

当前覆盖：

- Registry：**10 / 10 implemented**
- Complete Public Copy：**10 / 10 implemented**
- six Tags：**10 / 10 implemented**
- Result copy contract：**10 / 10 implemented**
- Share copy contract：**10 / 10 implemented**

完整 `TraditionalPatternResult` 仍未 Production-ready；`bi_jian → 建禄` 与 `jie_cai → 月劫` 仍只是 Presentation Proxy Mapping。

## 5. Public experience implementation

### Second Personality / Dimensions

Second Personality 正式消费 `archetype_seed.secondary_ten_god`。

Personality Dimensions 正式消费 `personality-map/0.2.0` 的真实 15 项 machine output。

### Homepage

release branch 已实现：首屏定位与 CTA、10 人格预览、确定性工作方式说明、Dossier Preview、Share Card Preview、再次 CTA。

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

正式 Character asset 缺失时 Share Card 必须显式失败，不允许 placeholder。

## 6. Character Visual System V1 — FIXED 10-IP / PRODUCTION ACTIVE

Character Style selection 已完成。

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`
- `docs/17_PRODUCT_DESIGN_REPORT_V1.md`

正式风格：**Bold Graphic Character / Flat Editorial Character**。  
世界观：**City Observation Editorial / 城市观察体**。

硬规则：**pose may be redesigned; style may not be reinterpreted.**

### New formal asset contract

```text
public/characters/v1/{ten_god}.webp
```

共 **10 fixed Character Master assets**。

当前仓库真实状态：`public/characters/v1/` 只有 `README.md`，因此正式 Character binary 数量仍是：**0 / 10**。

旧 `{ten_god}-{gender}.webp` 以及任何用户性别驱动角色选择逻辑，均属于 **legacy pending refactor**，不得继续作为新生产标准。

当前最大 Release Blocker：

**fixed 10-IP contract refactor + 10 / 10 formal Character Masters + final QA**。

## 7. 当前 V1 P0 执行顺序

1. 固定 10-IP contract 文档同步
2. 重构 legacy gender-based Character routing / filenames
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

## 8. 完整产品设计已补齐

`docs/17_PRODUCT_DESIGN_REPORT_V1.md` 已正式定义：

- 10 个固定官方 IP
- 免费完整 Personality Dossier
- 《疯传》传播结构
- Post-V1 `Bazi Personality Spectrum / 八字人格光谱`
- `1 主人格 + 1–2 副人格 + N deterministic 修正因子`
- 人格纯度 / 结构清晰度概念
- 免费 → 付费转化逻辑
- LLM 只解释、不重新排盘、不编造比例的专业边界

这些是完整产品方向，但 payment / spectrum implementation 仍不阻塞当前 V1 发布。

## 9. CI / Browser acceptance pending

最终 asset-integrated HEAD 仍必须通过：

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

最终浏览器验收至少覆盖：390px / 430px / 768px / 1440px。

重点检查 Homepage、Birth、Result Hero、Long Result、fixed Characters、Share Card、Save / Share、Navigation、Reload、Back、Error、Unknown birth time。

## 10. Post-V1 / V1.1 Parking Lot

当前仍 PARKED：

- 双人人格关系 / compatibility
- referral / invitation challenge
- AI Advisor / AI Chat
- payment / ¥9.9 report checkout
- Supabase Live / Auth / Account
- Analytics full system
- ranking / rarity
- new personality types
- new Character Style
- 用神 / 流月 / 流日
- complex Traditional Pattern expansion
- community / gamification

其中 **八字人格光谱** 已完成产品设计，但实现仍属于 Post-V1。

## 11. Production release gate

已完成：

- [x] 10 / 10 Public Registry
- [x] 10 / 10 complete Public Copy
- [x] deterministic Birth → Bazi → Interpretation → Public mapping
- [x] real secondary personality
- [x] real dimensions
- [x] full Result Dossier implementation
- [x] Share rendering implementation
- [x] Character Style selected and LOCKED
- [x] fixed 10-IP product contract approved
- [x] complete product / paid-spectrum design documented

仍阻塞发布：

- [ ] legacy gender-based character routing refactor
- [ ] 10 / 10 formal Character Masters
- [ ] Homepage / Result / Share Card real-image QA
- [ ] mobile / viewport browser QA
- [ ] full CI on final asset-integrated HEAD
- [ ] PR #16 Ready / merge main
- [ ] Vercel Production
- [ ] final public smoke test

**V1 必须完整，但“完整”指当前发布闭环完整，不要求未来所有付费与顾问能力在同一批上线。**
