# 17 — Product Design Report V1

状态：**APPROVED PRODUCT DESIGN / 2026-08-22**  
项目：**八字人格 / Bazi Personality**  
适用：V1 完整公网体验 + Post-V1 付费产品架构

> 本报告用于解释完整产品怎么成立。若与 `docs/13_PERSONALITY_IP_BIBLE.md` 冲突，以 Personality IP Bible 为最高 Source of Truth。

## 1. 产品总定义

产品不是传统算命站，也不是把十神换成十个网络梗。

完整产品由三层组成：

```text
真实八字事实层
→ 人格解释层
→ 传播 / 商业产品层
```

核心原则：

> **里面认真算，外面认真发疯。**

免费层负责“我是谁、为什么有点像、我愿不愿意分享”；付费层负责“为什么我和同一人格的人仍然不同、我的真实命盘结构怎样影响我”。

## 2. Character IP 架构 — 10 个固定官方 IP

### 2.1 核心决策

**10 个 Public Personality = 10 个固定官方 Character IP。**

不再生产“每个人格男版 + 女版”双角色系统。

角色代表的是人格本身，不代表用户本人。用户性别不得改变 Character identity。

例如：

```text
任何用户测出 shang_guan
→ 都看到同一个「天生反骨」官方角色
```

出生性别若 deterministic Bazi Engine 仍需要，可继续作为排盘输入；它不得承担“选择男角色 / 女角色”的视觉功能。

### 2.2 官方 10 角色

| Machine key | Public Personality | Canonical Character |
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

整体保持 5 男 + 5 女，但性别只属于 Character 设定，不属于用户映射规则。

### 2.3 为什么这样做

固定角色带来四个产品价值：

1. **识别度**：看见角色就知道人格，不需要记 20 张脸。
2. **IP 资产积累**：一个人格长期由同一角色承载，能发展表情、动作、场景与故事。
3. **传播效率**：分享卡、小红书、首页、人格图鉴统一使用同一视觉记忆点。
4. **生产集中**：把精力从“多画一倍”转为“把 10 个角色真正做成品牌资产”。

### 2.4 Character Master 与延展

V1 每个人格只需要 1 个正式 Character Master，共 10 张。

后续扩展不是“男女版”，而是同一角色的状态 / 场景 Variant：

```text
Character Master
├── Homepage Hero / Card crop
├── Result Hero
├── Share Card
├── Avatar
├── 表情 / reaction
├── 工作状态
├── 恋爱状态
├── 压力状态
└── 社交内容插图
```

## 3. 免费人格产品 — Public Personality Layer

免费产品不是付费版残缺预览，必须本身完整、爽、可分享。

用户完成出生信息后，deterministic chain 输出：

```text
Birth normalization
→ Bazi Engine
→ Interpretation personality-map/0.2.0
→ dominant personality
→ secondary personality
→ 15 personality dimensions
```

免费结果至少包含：

- 唯一主人格
- 固定官方 Character
- 锚点句 / 一句话毒舌
- 6 Tags
- 朋友眼里的你
- A 面 / 翻车面
- 第二人格
- Personality Dimensions
- 工作 / 学习 / 关系 / 冲突 / 压力 / 恢复 / 决策 / 金钱
- 成长建议
- 为什么会得到这个结果
- 专业八字依据折叠区
- Share Card

免费层回答：

> **“我是什么人？”**

## 4. 传播设计 — 《疯传》原则落地

传播不是功能附加，而是产品结构的一部分。

### Social Currency / 社交货币

人格名必须让用户愿意说：

- “我是搞钱圣体。”
- “你居然是活菩萨。”
- “我就知道你是老干部。”

### Emotion / 情绪

结果需要制造：好笑、被说中、反差、想吐槽朋友的情绪，不做平淡心理测评腔。

### Public / 公开性

每个固定角色、人格名、配色、Share Card 都必须具备远距离辨识度。

### Triggers / 触发

工作、恋爱、花钱、冲突、压力、社交等日常场景持续让用户想起人格标签。

### Practical Value / 实用价值

免费结果必须真正提供可用的自我理解，而不是只有梗。

### Stories / 故事

通过“朋友眼中的你 / 真正的你 / 翻车时的你 / 第二人格”形成可讲述的个人故事。

## 5. 付费产品 — Bazi Personality Spectrum

### 5.1 核心定义

付费层不再只是“给主人格多写几千字”。

它回答：

> **“为什么我是这样的人，而且为什么我和另一个同人格的人仍然不同？”**

产品名建议：

**八字人格光谱 / Bazi Personality Spectrum**

### 5.2 1 + 2 + N 架构

```text
1 个主人格
+ 1–2 个显著副人格 / 次级动力
+ N 个八字结构修正因子
```

修正因子可来自后续经过验证的 deterministic facts，例如：

- 十神分布与相对权重
- 日主状态 / 身强弱
- 五行结构与偏向
- 格局清晰度 / 混合度
- 关键组合关系
- 冲合刑害
- 寒暖燥湿等经过明确规则定义的结构因素

注意：任何比例、权重、结构标签必须来自 deterministic engine 或明确版本化规则，LLM 不得自行编造数字。

### 5.3 人格纯度 / 结构清晰度

不要强迫所有人都成为“纯型”。

报告可以明确区分：

- 高集中：主人格非常突出
- 中等混合：主人格 + 明显副型
- 高混合：多股动力接近

这解决现实八字“格局不纯、结构复杂”的问题，同时把复杂度转化为付费价值。

### 5.4 付费报告内容

完整付费报告建议包含：

1. 人格 DNA：主型 / 副型 / 隐藏倾向
2. 人格光谱可视化
3. 结构清晰度 / 混合度
4. 核心内在矛盾
5. 优势与代价
6. 工作与职业动力
7. 金钱与资源模式
8. 关系与亲密模式
9. 冲突与边界
10. 压力 / 防御 / 恢复
11. 决策方式
12. 成长建议
13. 真实八字结构解释
14. 专业命理依据附录
15. 未来可扩展的运势上下文（不进入当前 V1 release）

付费层回答：

> **“为什么我会这样？”**

## 6. 免费 → 付费转化逻辑

不能用“免费内容故意砍掉一半”逼付费。

正确路径：

```text
免费主人格很爽、很像、可分享
↓
用户发现自己并非纯型
↓
展示轻量 teaser：
“你虽然是天生反骨，但命盘里还有另外两股很强的动力。”
↓
查看完整「八字人格光谱」
```

建议 CTA 语义：

> **你不只是一种人格。看看你的完整八字人格光谱。**

支付未上线前只能显示“即将开放”，不得伪造购买流程。

## 7. AI 与专业性的边界

正确架构：

```text
Deterministic Bazi facts
→ versioned personality / spectrum rules
→ typed evidence packet
→ LLM narrative generation
→ structured validation
→ report
```

LLM 只负责解释与表达，不重新排盘、不猜格局、不随机造百分比、不覆盖 engine facts。

专业感来自“可追溯依据 + 个体差异”，而不是传统术语堆叠。

## 8. 完整产品终局

```text
免费传播入口
10 固定 Public Personality IP
↓
完整 Personality Dossier
↓
Share Card / 好友回流
↓
八字人格光谱（轻付费）
↓
更深层个体报告
↓
AI Advisor / 后续顾问能力
```

10 个 IP 是品牌层；人格光谱是个性化层；八字事实是专业底座；AI 是解释层。

## 9. V1 完整发布边界

“V1 不做所有未来功能”不等于“V1 做残缺版”。

V1 必须完整交付：

- 10 / 10 固定官方 Character Master
- 完整 Homepage
- 完整 Birth UX
- deterministic Bazi → Interpretation
- 10 / 10 Public Personality
- 完整 Dossier
- 完整分享卡
- 手机端完整 QA
- 所有正式资产真实接入
- 无 placeholder / 临时人物 / 性别双资产残留依赖

V1 可以暂不实现 payment / AI Advisor / 人格光谱 checkout，但必须把未来接口和产品方向设计清楚，不能用临时架构堵死后续。

## 10. 一句话产品模型

> **10 个固定角色负责让人记住我们；免费人格负责让人觉得“这就是我”；八字人格光谱负责解释“为什么我和别人不一样”；专业八字事实负责让用户愿意付钱；分享卡负责把下一个人带进来。**
