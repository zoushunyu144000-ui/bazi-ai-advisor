# 07 — Business Rules

状态：V1 pricing approved at concept level; Wave 2 billing contract frozen; real payment provider implementation TBD.

## 1. 第一阶段商业漏斗

免费测试
→ ¥9.9 等值价格：完整人格报告
→ ¥29.9 等值价格：10 次 AI 顾问

第一阶段目标：逐步达到月收入人民币 10,000 元以上。

## 2. 产品与权益

### Free Test

价格：免费。

交付：基础命盘/人格摘要与部分免费结果。

目的：让用户在付款前感受到结果的相关性与价值。

### Full Personality Report

基准价格：人民币 ¥9.9 等值价格。

正式 ProductCode：`personality_report`。

权益：解锁一个 concrete report resource 的完整人格报告。

技术权限 authority：first-class `ReportEntitlement`，稳定 identity 为：

```text
(user_id, personality_report, report_id)
```

不得只依赖 Purchase JSONB 或 Browser 状态判断付费权限。

仍待产品确认：
- entitlement 在退款后是否立即 revoke，以及历史访问策略：TBD
- 是否允许同一用户购买多个不同命盘报告：TBD（架构允许不同 report resource 独立 entitlement）

### AI Advisor 10 Credits

基准价格：人民币 ¥29.9 等值价格。

正式 ProductCode：`advisor_10`。

权益：每 `quantity = 1` 的 verified Purchase grant exactly `+10` integer advisor credits。

Wave 2 已冻结：

- 一次成功、已验证并成功 commit 的 Advisor request 固定消费 `1` credit。
- Advisor 在 AI 调用前先 reserve `1` credit。
- AI/provider timeout、provider error、invalid structured output、server failure 等 terminal failure 必须 release reservation，不得造成永久 credit loss。
- Reservation 不是 committed ledger debit；release 不产生补偿 `+1` ledger。
- Retry 必须复用稳定 Advisor request idempotency identity，不能重复扣 credit。

仍待产品确认：
- credits 是否设过期时间：TBD
- 是否允许无限叠加购买：TBD
- 已消费部分 credits 后发生全额退款时的余额/人工审核策略：TBD；当前 Wallet Contract 不允许负余额

## 3. 海外定价

产品面向海外华人用户，未来需支持“等值价格”而非只显示人民币。

具体策略待验证：
- 固定本地化价格点 vs 实时汇率：TBD
- 支持币种：TBD
- 税费处理：TBD

原则：价格展示必须在付款前清楚说明币种和最终金额。

ProductCode 不编码价格；历史订单必须保存真实 `currency + amount_minor`。

## 4. 支付

真实支付供应商：TBD / 尚未进入 Production implementation。

实现必须满足：

- Browser success / return page 不是 fulfillment authority
- 服务端验证支付事件
- Provider webhook/event 使用 durable `(provider, provider_event_id)` inbox 幂等
- Order / Purchase / Entitlement / Credit Grant 分层
- 支付失败不得错误发放权益
- 重复 Webhook / retry 不得重复 Purchase、entitlement 或 credit grant
- 金额使用 integer minor units
- 所有敏感写入走 trusted server-side path

详细事务、幂等与 ownership Contract 见 `docs/14_BILLING_CONTRACT_INTEGRATION.md`。

## 5. 转化原则

禁止用虚假倒计时、虚构库存或恐吓式命理解读强迫付费。

允许通过：
- 锁定章节预览
- 示例内容
- 免费/完整报告对比
- 清晰解释 AI 顾问价值
来推动转化。

## 6. 核心商业指标（建议）

V1 上线后至少观察：
- 首页 → 开始测试转化率
- 开始测试 → 完成出生信息率
- 完成测试 → 完整报告购买率
- 完整报告购买 → AI 顾问购买率
- 顾问使用率
- 顾问次数耗尽后的复购率
- 支付失败率
- 单用户平均收入

指标工具与埋点方案：TBD。

## 7. 价格变更规则

后续价格实验不得直接覆盖历史事实，也不得通过改 ProductCode 表达新价格。

价格发生重大变化时：
1. 更新本文件
2. 在 `08_DECISION_LOG.md` 记录日期、旧价格、新价格和原因
3. 确认代码/支付后台同步
4. 历史 Order / Purchase 保留原币种与金额

最后更新：2026-08-18
