# 03 — Design System

状态：V1 Visual System / Approved by current product direction

最后更新：2026-08-18

## 1. 品牌定位

V1 视觉定位冻结为：

**Contemporary Editorial × Digital Psychology × East Asian Minimalism**

目标感受：年轻、高级、现代、安静、聪明、克制、有辨识度，保留轻微东方文化气质，但不使用廉价玄学视觉语言。

产品在页面上优先被理解为“现代人格观察 / 行为图谱工具”，而不是传统算命站。

## 2. 明确禁止

V1 禁止将以下元素作为品牌主视觉：

- 太极、八卦、符咒、道士、龙、铜钱
- 黑金算命、大红大金
- 廉价紫色宇宙、星空玄学、水晶
- 游戏式法阵、发光命盘、赛博玄学
- 恐吓式灾祸图形或制造虚假权威感的神秘符号

八字结构只作为底层文化来源，不在主页面堆砌术语与传统符号。

## 3. Brand Colors

Light Mode 为 V1 主模式。

### Core

- Paper / 页面底色：`#F4F1EA`
- Surface / 卡片：`#FBFAF7`
- Paper Strong：`#EBE6DC`
- Ink / 主文字：`#17201D`
- Ink Soft：`#39423F`
- Muted：`#6F7772`
- Border：`#D8D4CA`

### Brand

- Mineral Teal / 主品牌色：`#255F56`
- Mineral Teal Strong：`#174940`
- Mineral Teal Soft：`#DCE8E3`

### Accent

- Editorial Terracotta：`#A95F4D`
- Terracotta Soft：`#EFE0DA`

使用原则：暖白与墨色构成约 85% 画面；青绿负责 CTA、指标与状态提示；陶土红仅用于编号、压力状态与少量编辑性强调。

## 4. Typography

不引入远程字体依赖，保证海外网络与首屏稳定。

### Sans / UI 与正文

`Inter, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif`

用于：导航、按钮、标签、输入框、说明文字、聊天 UI、指标。

### Editorial Serif / 大标题与报告阅读

`Iowan Old Style, Songti SC, STSong, serif`

用于：Hero、人格称号、报告章节标题、引用与大数字。

原则：Serif 只承担编辑感与东方文气，不模拟古籍书法。

## 5. Type Scale

- Hero Display：48–76px desktop / 42–56px mobile
- Page Result Display：46–72px / 46px mobile
- Section H2：32–54px / 36px mobile
- Report Chapter H2：40px / 33px mobile
- Body：14–17px，长报告正文使用 15–16px + 2.0 左右行高
- UI Label：9–13px
- Eyebrow：10px，`0.16em` letter-spacing

## 6. Layout / Container / Spacing

- Main container：`1180px`
- Result content：约 `980px`
- Form content：约 `1000px`
- Desktop page horizontal gutter：20px each side minimum
- Mobile gutter：14px each side minimum
- Section vertical spacing：76–120px
- Card internal padding：24–60px，随断点收缩

Mobile First 核心验收宽度：390px / 430px。
Desktop 核心验收宽度：1440px。

## 7. Radius / Border / Shadow

- Small radius：12px
- Medium radius：20px
- Large radius：32px
- Mobile large surface：24px
- Pill：999px
- Border：1px，低对比暖灰
- Shadow：极轻，仅用于 Hero Visual、结果主卡、Paywall、Chat Shell 等重要层级

禁止玻璃拟态滥用和高饱和发光阴影。

## 8. Buttons

### Primary

Mineral Teal 实底 + 白字，圆角 pill。

用途：开始测试、生成结果、解锁报告、购买顾问。

### Secondary

透明底 + 暖灰边框 + Ink 字色。

用途：查看示例、次级导航。

### Ghost

透明底 + 品牌色文字，用于 Header 轻量入口。

CTA 文案优先直接说明行为，不使用恐吓、倒计时、虚假稀缺。

## 9. Inputs

- 白色输入面
- 12px 圆角
- 52px 高度
- Focus 使用 Mineral Teal 边框 + 极弱 focus ring
- 辅助说明放在字段下方，10px muted
- 选择项采用 segmented cards，不使用传统算命表单视觉

## 10. Cards / Tags / Metrics

### Cards

- Warm surface
- 1px border
- 重要卡片可增加 soft shadow
- 信息优先，不靠装饰填满空间

### Tags

- 32px 高 pill
- 低对比边框
- 展示 3–5 个现代人格关键词

### Metrics

人格维度统一展示为 0–100。

组件结构：标签 + 一句现代解释 + 数值 + 4px 进度条。

页面必须明确说明：数值为“倾向强度”，不是能力分数或好坏评价。

## 11. Result Page

`/result` 是 V1 最重要的视觉转化页。

固定结构：

1. 核心人格称号
2. 一句话现代描述
3. 3–5 个标签
4. 现代人格维度
5. 优势状态
6. 压力状态
7. 锁定报告预览
8. ¥9.9 CTA
9. 分享卡

结果主卡不得显示用户具体生日、地点等敏感信息，保证截图分享安全。

## 12. Paywall

Paywall 使用“内容价值预览”，不使用焦虑或恐吓。

结构：

- 一个真实章节标题与开头
- 后续文字柔和模糊
- 明确说明剩余章节
- 明确价格 `¥9.9` / 等值本地价格
- 一次解锁 CTA
- Mock / 未接真实支付时必须在工程界面中可识别

## 13. Report Sections

完整报告采用长阅读 editorial document 结构：

- 章节编号
- Eyebrow
- Serif 章节标题
- 高行高正文
- Editorial quote / callout
- Insight cards
- 桌面 sticky TOC
- 移动端取消侧栏导航，保持单列阅读

## 14. AI Advisor Visual

AI 顾问更接近现代咨询聊天产品：

- 明确显示剩余次数
- 显示已载入的人格上下文
- AI 与用户气泡对比清楚
- 建议问题以小型 pill 呈现
- 输入区固定为轻量 rounded field
- 不出现“在线大师”“测算中”等传统算命话术

## 15. Share Card — V1 三方向

### A. Archetype Card

深墨底 + 人格称号 + 3 个关键词。适合正式、有品牌辨识度的截图。

### B. Metric Card

Mineral Teal Soft 底 + 单一最高维度大数字。适合社交平台快速理解。

### C. Quote Card

暖白底 + 一句高度相关的人格洞察。更像心理测试分享卡。

共同规则：不显示生日、出生地、八字术语或敏感命盘信息。

## 16. Responsive Rules

### 390 / 430 Mobile

- Header 隐藏完整导航，只保留品牌和免费测试 CTA
- Hero 单列
- 结果指标单列
- 优势 / 压力状态单列
- Paywall 从左右双栏变成上下结构
- 分享卡变为纵向卡片
- Report TOC 隐藏
- Advisor context 与聊天区单列

### 1440 Desktop

- 1180px 主容器
- Hero 双栏
- Result 保持约 980px 阅读宽度
- Report 使用 230px sticky TOC + 主文档
- Advisor 使用上下文侧栏 + Chat Shell

## 17. V1 当前实现边界

Visual V1 可以使用 Foundation Mock Fixtures 或页面内 Mock 数据。

本设计阶段不负责接入：

- 真实八字 Engine
- Supabase
- 支付
- AI Provider
- Analytics

后续 06 号产品工程窗口负责把视觉页面接入真实 Domain 数据与业务状态，不得为了接线破坏本文件定义的核心视觉层级。
