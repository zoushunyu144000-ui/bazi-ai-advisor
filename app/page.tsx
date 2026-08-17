import { ButtonLink, Eyebrow, MetricBar, SectionIntro, SiteShell, Tag } from "@/app/_components/design-system";
import { personality } from "@/app/_components/mock-personality";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero-section container">
        <div className="hero-copy">
          <Eyebrow>BAZI × MODERN PSYCHOLOGY</Eyebrow>
          <h1>看懂你的行为模式，<br />不必把自己交给“玄学答案”。</h1>
          <p>从出生信息生成一份现代人格图谱：你如何做决定、承受压力、处理关系，以及什么环境更容易让你发挥。</p>
          <div className="hero-actions">
            <ButtonLink href="/birth">开始免费测试 <span>→</span></ButtonLink>
            <span className="microcopy">约 2 分钟 · 免费查看核心结果</span>
          </div>
          <div className="trust-row">
            <span>确定性排盘</span><span>现代行为语言</span><span>不制造恐惧</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="人格图谱示例">
          <div className="orbit-word orbit-one">自主</div>
          <div className="orbit-word orbit-two">结构</div>
          <div className="orbit-word orbit-three">表达</div>
          <div className="portrait-disc"><span>序</span><small>PERSONALITY<br />MAPPING</small></div>
          <div className="hero-score-card"><small>自主倾向</small><strong>86</strong><div><span style={{ width: "86%" }} /></div></div>
        </div>
      </section>

      <section className="soft-band">
        <div className="container editorial-grid">
          <SectionIntro eyebrow="你会得到什么" title="不是一句“你是什么人”，而是一张可以使用的人格地图。" />
          <div className="value-list">
            {[["01","人格核心","理解你稳定的行为底色"],["02","压力状态","看见失衡时会发生什么"],["03","关系与工作","找到更适合你的互动方式"],["04","行动建议","把洞察变成下一步"]].map(([no,title,copy]) => (
              <article key={no}><span>{no}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="container sample-section">
        <SectionIntro eyebrow="免费结果示例" title="第一眼就能读懂，也值得截图保存。" copy="传统结构留在计算层，页面只呈现与你生活有关的现代语言。" />
        <div className="sample-card">
          <div className="sample-head"><div><Eyebrow>人格原型 01</Eyebrow><h3>{personality.title}</h3></div><span className="mini-seal">SAMPLE</span></div>
          <div className="tag-row">{personality.tags.slice(0, 4).map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
          <div className="sample-metrics">
            {personality.metrics.slice(0, 3).map(([label,value,note]) => <MetricBar key={label} label={label} value={value} note={note} />)}
          </div>
          <ButtonLink href="/result" secondary>看看完整结果页示例</ButtonLink>
        </div>
      </section>

      <section className="container how-section">
        <SectionIntro eyebrow="HOW IT WORKS" title="三步，把传统命盘翻译成现代可读结果。" />
        <div className="step-grid">
          {[["01","填写出生信息","日期、时间与出生地点用于确定性排盘。"],["02","生成行为图谱","系统把结构化特征映射为统一人格维度。"],["03","继续深挖","免费查看核心结果，¥9.9 解锁完整报告。"]].map(([n,t,c]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}
        </div>
      </section>

      <section className="container final-cta">
        <Eyebrow>START WITH YOURSELF</Eyebrow>
        <h2>你不需要“相信八字”。<br />先看看它能不能准确描述你。</h2>
        <ButtonLink href="/birth">免费生成我的人格图谱 →</ButtonLink>
      </section>
    </SiteShell>
  );
}
