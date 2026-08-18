import { RoadmapPage } from "@/app/_components/roadmap-page";

export default function ResultPage() {
  return (
    <RoadmapPage
      tag="免费结果"
      title="你的免费命盘"
      intro="免费排盘已在「排盘」页实时生成，包含四柱干支、五行分布、十神格局与干支关系。下方为后续将开放的深度结果。"
      items={[
        { title: "格局总论", desc: "基于日主强弱与五行流转，给出整体运势基调的定性描述。" },
        { title: "流年提示", desc: "结合大运与流年干支，标注关键转折年份（规划中）。" },
      ]}
    />
  );
}
