# 13 — Personality IP Bible V1

状态：**V1 Release Freeze / Product LOCKED / Character Style LOCKED**  
最后更新：2026-08-22

## 0. Governance / Source of Truth precedence

V1 项目治理优先级固定为：

1. `docs/13_PERSONALITY_IP_BIBLE.md`
2. `docs/09_CURRENT_STATE.md`
3. `docs/10_ROADMAP.md`
4. `docs/17_PRODUCT_DESIGN_REPORT_V1.md`
5. older docs / experiments / historical research

如果旧文档、试制记录、历史研究与本文件冲突，**以 Personality IP Bible 为准**。

文档职责：

- Personality IP Bible：锁定产品定义、人格体系、Character contract 与 V1 边界；
- Current State：只描述现在真实做到哪里；
- Roadmap：只描述接下来做什么；
- Product Design Report：解释完整产品、传播与付费架构；
- older docs / experiments：只作为历史上下文。

## 1. 产品定位

V1 是 **八字版 SBTI + 固定人格 IP + 完整免费人格 Dossier + 分享传播闭环**。

核心体验：

```text
出生信息
→ deterministic Birth normalization
→ deterministic Bazi Engine
→ Interpretation personality-map/0.2.0
→ 10 Public Personalities
→ Personality Dossier
→ fixed official Character IP
→ Share Card
```

产品语气：**里面认真算，外面认真发疯。**

第一反应应该是“这什么鬼”，第二反应是“好像真有点像我”，最后愿意截图或生成卡片发给朋友。

V1 必须是完整可用产品，不是低质量 prototype；但 payment / AI Advisor / 深度付费报告仍可按 Roadmap 延后，不得因此降低免费 V1 的完整度。

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

`shi_shen → 享乐主义` 已替代旧试制名“好吃懒做”。旧名称已 **retired**。

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

主人格使用 `archetype_seed.dominant_ten_god`。

第二人格使用 `archetype_seed.secondary_ten_god`。

Personality Dimensions 继续消费 `personality-map/0.2.0` 的真实 15 个 dimensions，不允许 Presentation 随机造数。

`lib/personality-archetypes.ts` 的 5 Elements × 5 Families = 25 archetypes 归类为 **experimental / legacy presentation experiment**，V1 公网人格判断不再消费。

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

## 5. Character Visual System V1 — FIXED 10-IP CONTRACT

### 5.1 核心决策

**10 Public Personality = 10 个固定官方 Character IP。**

取消旧的“每个人格 male + female 两个正式角色”产品 contract。

Character 代表人格本身，不代表用户本人。用户性别不得改变 Character identity。

出生性别如果 deterministic Bazi Engine 仍需要，可继续作为排盘输入；但不得再作为角色选择器或角色资产路由条件。

### 5.2 Canonical Character identities

| Machine key | Public personality | Canonical Character |
| --- | --- | --- |
| `bi_jian` | 犟种 | 固定女性角色 |
| `jie_cai` | 撒币 | 固定男性角色 |
| `shi_shen` | 享乐主义 | 固定男性角色 |
| `shang_guan` | 天生反骨 | 固定女性角色 |
| `zheng_cai` | 抠抠搜搜 | 固定女性角色 |
| `pian_cai` | 搞钱圣体 | 固定男性角色 |
| `zheng_guan` | 老干部 | 固定女性角色 |
| `qi_sha` | 狠人 | 固定男性角色 |
| `zheng_yin` | 活菩萨 | 固定男性角色 |
| `pian_yin` | 道长 | 固定女性角色 |

整体 5 男 + 5 女，只用于 Character 世界观平衡，不建立用户性别映射。

### 5.3 Hard release gate

正式公网不接受：

- CSS 小人
- 几何 SVG 人物
- 程序自动 silhouette
- placeholder character
- 旧 25 archetype 临时人物
- 同人格男女双资产依赖
- 彼此无统一世界观的随机 AI 图

角色必须是 18–28 岁视觉年龄的年轻东方人，有人格、互联网感、生活感与 Editorial 感。

角色不是十神职业 cosplay：道长 ≠ 道袍；老干部 ≠ 中年干部；活菩萨 ≠ 和尚；狠人 ≠ 黑帮；搞钱圣体 ≠ 拿人民币。

### 5.4 Character Style — LOCKED

Canonical references：

- `docs/assets/character-style-master-v1.webp`
- `docs/15_CHARACTER_STYLE_LOCK_V1.md`
- `docs/16_CHARACTER_BATCH_PRODUCTION_V1.md`

主风格：**Bold Graphic Character / Flat Editorial Character**  
世界观：**City Observation Editorial / 城市观察体**

硬规则：**pose may be redesigned; style may not be reinterpreted.**

### 5.5 Asset contract

正式目录：`public/characters/v1/`

正式命名：

```text
{ten_god}.webp
```

V1 共 **10 formal Character Master assets**：

```text
bi_jian.webp
jie_cai.webp
shi_shen.webp
shang_guan.webp
zheng_cai.webp
pian_cai.webp
zheng_guan.webp
qi_sha.webp
zheng_yin.webp
pian_yin.webp
```

必须 10 / 10 到位后才能解除 Production Visual Gate。

同一个 Character Master 可用于 Homepage / Result / Share Card / Avatar 等裁切与排版，不要求重复画人物。

后续扩展优先做同一角色的表情、动作、工作、关系、压力等 Variant，不重新建立男女双角色体系。

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

分享卡必须包含人格大名、固定官方 Hero Character、锚点句、3–5 Tags、毒舌总结、品牌和回流 URL。

正式 Character asset 缺失时，Share Card 必须显式失败，不允许静默 placeholder。

## 8. Free / Paid boundary

### Free V1

免费 V1 必须完整爽，不做残缺诱导付费。

免费至少包含：主人格、固定官方 Character、朋友视角、A 面、翻车面、第二人格、Dimensions、主要生活场景、八字依据、Share Card。

免费层回答：**“我是什么人？”**

### Post-V1 paid design — Bazi Personality Spectrum

付费层方向正式定义为：**八字人格光谱 / Bazi Personality Spectrum**。

它不是给主人格简单加长文，而是解释：

```text
1 个主人格
+ 1–2 个显著副人格 / 次级动力
+ N 个 deterministic 八字结构修正因子
```

可扩展因子包括经过版本化规则验证的：十神权重、日主状态、五行结构、格局清晰度 / 混合度、关键组合关系等。

任何比例、纯度、权重或结构标签必须来自 deterministic engine / versioned rules，LLM 不得自行编造。

付费层回答：**“为什么我是这样，而且为什么我和另一个同人格的人仍然不同？”**

支付未接前，付费区只允许显示“即将开放”，不得伪造支付成功。

完整产品说明见 `docs/17_PRODUCT_DESIGN_REPORT_V1.md`。

## 9. 传播原则

增长设计参考《疯传》类传播框架，但不把传播做成外挂功能。

核心必须同时满足：

- 社交货币：人格名值得说出口；
- 情绪：好笑、被说中、反差；
- 公开性：固定角色与分享卡可识别；
- 触发：工作、关系、金钱、压力等生活场景；
- 实用价值：免费结果本身有自我理解价值；
- 故事：朋友眼中的你 / 真正的你 / 翻车面 / 第二人格形成可讲述结构。

## 10. V1 Release Freeze

V1 唯一发布目标：

```text
Homepage
→ Birth
→ deterministic Bazi
→ Interpretation
→ 10 Public Personalities
→ full Personality Dossier
→ 10 fixed formal Characters
→ Share Card
→ friend can open the website and test
```

当前 release 不要求 payment / AI Advisor / Bazi Personality Spectrum checkout 已实现，但这些未来能力不得破坏当前 deterministic architecture。

## 11. Definition of Done

```text
陌生用户打开
→ 被角色和名字吸引
→ 愿意填出生信息
→ 真实排盘与 Interpretation
→ 得到唯一主人格 + 第二人格
→ 看完完整 Dossier
→ 看见该人格唯一固定 Character
→ 生成真的好看的分享卡
→ 发给朋友
→ 朋友打开网站继续测
```

同时必须满足：

- 10 / 10 Character Master 到位；
- 无 male/female 双角色资产依赖；
- 无 placeholder；
- mobile QA 通过；
- final CI 通过；
- public smoke test 通过。

只有完整闭环成立，才算 V1 Release Candidate 完成。Build success 本身不等于完成。
