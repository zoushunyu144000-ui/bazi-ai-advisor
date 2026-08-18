import { LockPreview, MetricBar, PersonalityHero, SectionIntro, ShareCards, SiteShell } from "@/app/_components/design-system";
import { personality } from "@/app/_components/mock-personality";

export default function ResultPage() {
  return (
    <SiteShell>
      <div className="container result-page">
        <PersonalityHero share />
        <section className="result-section metric-panel">
          <SectionIntro eyebrow="你的行为维度" title="你更像哪一种运作方式？" copy="0–100 是相对倾向强度，不代表好坏，也不是能力分数。" />
          <div className="metric-list">
            {personality.metrics.map(([label,value,note]) => <MetricBar key={label} label={label} value={value} note={note} />)}
          </div>
        </section>

        <section className="state-grid result-section">
          <article className="state-card state-good"><p className="eyebrow">状态好的时候</p><h2>安静，但判断力很强。</h2><ul>{personality.strengths.map((x) => <li key={x}>{x}</li>)}</ul></article>
          <article className="state-card state-pressure"><p className="eyebrow">压力变大的时候</p><h2>先退出，再处理。</h2><ul>{personality.pressure.map((x) => <li key={x}>{x}</li>)}</ul></article>
        </section>

        <LockPreview />

        <section className="result-section share-section">
          <SectionIntro eyebrow="分享卡" title="把结果分享出去，但保留一点私人空间。" copy="三个方向都不放生日、地点或八字术语，只保留人格关键词。" />
          <ShareCards />
        </section>
      </div>
    </SiteShell>
  );
}
