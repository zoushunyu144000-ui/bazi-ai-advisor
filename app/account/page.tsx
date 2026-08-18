import { RoadmapPage } from "@/app/_components/roadmap-page";

export default function AccountPage() {
  return (
    <RoadmapPage
      tag="即将上线"
      title="账户与订单"
      intro="账户体系将管理身份、订单、余额与顾问次数。当前阶段排盘完全免费、且仅在本机浏览器计算，无需注册。"
      items={[
        { title: "身份与档案", desc: "保存多份出生档案，一键复排历史命盘。" },
        { title: "订单与账本", desc: "整数 minor units 计价、整数次数账本，金额清晰可审计。" },
        { title: "隐私优先", desc: "敏感出生信息默认本地处理，云端仅存必要账户数据。" },
      ]}
    />
  );
}
