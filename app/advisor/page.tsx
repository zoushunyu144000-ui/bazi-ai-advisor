import { RoadmapPage } from "@/app/_components/roadmap-page";

export default function AdvisorPage() {
  return (
    <RoadmapPage
      tag="付费 · 即将上线"
      title="AI 顾问"
      intro="AI 顾问只负责解释与建议，不参与排盘——命盘结构由确定性引擎生成，确保每次咨询都基于你的真实命盘。"
      items={[
        { title: "结构化上下文", desc: "顾问会话携带你的命盘与历史记忆，回答更贴合你本人。" },
        { title: "次数制", desc: "以整数次数计费，账户余额清晰可追溯（规划中）。" },
        { title: "现代语言转译", desc: "把古典术语转译为可理解、可行动的现代建议。" },
      ]}
    />
  );
}
