# 13 — Personality IP Bible V1

状态：**V1 Release Freeze / Product LOCKED / Character Style LOCKED**  
最后更新：2026-08-21

## 0. Governance / Source of Truth precedence

V1 项目治理优先级固定为：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. older docs / experiments / historical research

如果旧文档、试制记录、历史研究与本文件冲突，**以 Personality IP Bible 为准**。

文档职责固定：

- Personality IP Bible：锁定产品定义、人格体系、Character contract 与 V1 边界；
- Current State：只描述**现在真实做到哪里**；
- Roadmap：只描述**接下来做什么**；
- older docs / experiments：只作为历史上下文，不得重新覆盖已锁定决策。

除非 Product Owner 明确发布新的正式版本，不得由其他文档重新定义 Public Personality 名称、Character Style 或 V1 核心产品方向。

## 1. 产品定位

V1 是 **八字版 SBTI**，不是传统命理专业站，也不是复杂预测平台。

核心体验：

```text
出生信息
→ deterministic Birth normalization
→ deterministic Bazi Engine
→ Interpretation personality-map/0.2.0
→ 10 Public Personalities
→ Personality Dossier
→ formal Character
→ Share Card
```

产品语气：**里面认真算，外面认真发疯。**

第一反应应该是“这什么鬼”，第二反应是“好像真有点像我”，最后愿意截图或生成卡片发给朋友。

## 2. 10 Public Personalities — LOCKED

| Machine Ten-God | Public name | Public traditional label |
| --- | --- | --- |
| `bi_jian` | 犟种 | 比肩型人格 · V1 展示代理「建禄」 |
| `jie_cai` | 撒币 | 劫财型人格 · V1 展示代理「月劫」 |
| `shi_shen` | 享乐主义 | 食神型人格 |
| `shang_guan` | 天生反骨 | 伤官型人格 |
| `zheng_cai` | 抠抠搜搜 | 正财型人格 |
| `pian_cai` | 搞钱圣体 | 偏财型人格 |
| `zheng_guan` | 老干部 | 正官型人格 |
| `qi_sha` | 狠人 | 七杀型人格 |
| `zheng_yin` | 活菩萨 | 正印型人格 |
| `pian_yin` | 道长 | 偏印型人格 |

以上 display name 在 V1 公网期间禁止自行改名。

`shi_shen → 享乐主义` 已替代旧试制名“好吃懒做”。旧名称已 **retired**，不得继续出现在 Current State、Roadmap、正式 Production Task、正式角色资产或公网文案中。

正式文案与视觉必须表达会享受、生活感、体验优先、审美、松弛和快乐恢复力；不得把食神塑造成废宅、懒汉、肥胖或不上进。

### Proxy boundary

当前完整 `TraditionalPatternResult` 尚未进入 Production。

因此：

- `bi_jian → 犟种 / 建禄` 只是 Presentation Proxy Mapping；
- `jie_cai → 撒币 / 月劫` 只是 Presentation Proxy Mapping；
- 不得描述为 Engine 已经正式完成建禄/月劫格局判定。

## 3. 公网人格机器边界

公网人格唯一输入来自现有确定性链路：

```text
normalizeBirthProfile()
→ calculateBazi()
→ interpretBaziChart()
→ selectArchetypeCandidate()
```

主人格使用：

`archetype_seed.dominant_ten_god`

第二人格使用：

`archetype_seed.secondary_ten_god`

Personality Dimensions 继续消费 `personality-map/0.2.0` 的真实 15 个 dimensions，不允许 Presentation 随机造数。

`lib/personality-archetypes.ts` 的 5 Elements × 5 Families = 25 archetypes 正式归类为 **experimental / legacy presentation experiment**，V1 公网人格判断不再消费。

## 4. Public Copy Contract

每个 Public Personality 必须完整提供：

- `display_name`
- `traditional_label`
- `anchor_quote`
- `one_line_roast`
- `short_description`
- 6 × Tags
- `friend_view`
- `positive_mode`
- `flip_mode`
- `work_mode`
- `learning_mode`
- `relationship_mode`
- `conflict_mode`
- `stress_mode`
- `recovery_mode`
- `decision_mode`
- `money_mode`
- `growth_advice`
- `secondary_personality_copy`
- `share_card_copy`
- `paid_report_teaser`

公网语言必须年轻、具体、有生活场景、有损但不恶毒；禁止 AI 心理报告腔和传统命理套话。

Canonical implementation：`lib/public-personalities.ts`。

## 5. Character Visual System V1

### 5.1 Hard release gate

正式公网不接受：

- CSS 小人
- 几何 SVG 人物
- 程序自动 silhouette
- placeholder character
- 旧 25 archetype 临时人物
- 20 张彼此无统一世界观的随机 AI 图

角色必须是 18–28 岁视觉年龄的年轻东方人，有人格、互联网感、生活感与 Editorial 感。

角色不是十神职业 cosplay：

- 道长 ≠ 道袍；
- 老干部 ≠ 中年干部；
- 活菩萨 ≠ 和尚；
- 狠人 ≠ 黑帮；
- 搞钱圣体 ≠ 拿人民币。

人格优先通过姿态、表情、动作、服装细节、轮廓和视觉张力表达。

### 5.2 Character Style — LOCKED

Style Pilot / Style selection 阶段已经完成。Product Owner 已锁定唯一 V1 母版与风格：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`
- 主风格：**Bold Graphic Character / Flat Editorial Character**
- 世界观：**City Observation Editorial / 城市观察体**

硬规则：**pose may be redesigned; style may not be reinterpreted.**

当前阶段是：**Style LOCKED → formal Character Production**。

不得重新开启 3 套 Style Pilot，不得等待新的 Character Style 选择，不得用旧试制名“好吃懒做”作为正式生产身份。

正式生产可按 `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md` 的 Production Pilot / identity-pair gate 执行，但这些 gate 只验证锁定画风的一致性，**不是重新选画风**。

### 5.3 Asset contract

正式资产目录：`public/characters/v1/`

命名：

```text
{ten_god}-male.webp
{ten_god}-female.webp
```

共 10 personalities × male/female = **20 formal assets**。

必须 20 / 20 到位后才能解除 Production Visual Gate。

Character code 不允许在正式资产缺失时回退到 CSS / SVG / placeholder / silhouette / legacy 25 archetype character。

## 6. Result Dossier Contract

V1 Result 至少包含：

1. 你到底是什么东西
2. 朋友眼里的你
3. 你的 A 面
4. 你的翻车面
5. 你的第二人格
6. Personality Dimensions
7. 工作中的你
8. 学习中的你
9. 关系里的你
10. 冲突中的你
11. 压力大的你
12. 你的回血方式
13. 你的决策方式
14. 你的金钱模式
15. 你最容易卡在哪里
16. 成长建议
17. 为什么会得到这个结果
18. 专业八字依据折叠区

传统内容不得抢占第一体验。

## 7. Share Loop V1

至少提供：

- 主分享卡：1080 × 1350
- Story / 小红书版：1080 × 1920
- 生成 / 保存图片
- Web Share API（支持时）
- 下载 fallback
- 复制结果

分享卡必须包含人格大名、正式 Hero Character、锚点句、3–5 Tags、毒舌总结、品牌和回流 URL。

正式 Character asset 缺失时，Share Card 生成必须失败并提示，不允许静默放 placeholder。

## 8. Free / Paid boundary

免费 V1 体验必须完整爽，不做残缺诱导付费。

免费至少包含：主人格、朋友视角、A 面、翻车面、第二人格、Dimensions、主要生活场景、八字依据、Share Card。

支付未接前，付费区只允许显示：**深度报告即将开放**。

不得伪造支付成功。

## 9. V1 Release Freeze

当前正式进入：**V1 Release Freeze**。

V1 唯一发布目标是让陌生用户完整完成：

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

### Post-V1 / V1.1 Parking Lot

以下全部禁止进入本次 V1 实现，只允许记录为后续 Recommendation：

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

发现新的产品想法时，只允许进入 Parking Lot，不得在 V1 Release Freeze 中实现。

## 10. Definition of Done

```text
陌生用户打开
→ 被角色和名字吸引
→ 愿意填出生信息
→ 真实排盘与 Interpretation
→ 得到唯一主人格 + 第二人格
→ 看完完整 Dossier
→ 看见正式 Character
→ 生成真的好看的分享卡
→ 发给朋友
→ 朋友打开网站继续测
```

只有完整闭环成立，才算 V1 Release Candidate 完成。Build success 本身不等于完成。