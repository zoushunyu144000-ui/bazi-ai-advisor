import { ButtonLink, Eyebrow, SiteShell, Tag } from "@/app/_components/design-system";
import { personality, reportSections } from "@/app/_components/mock-personality";

export default function ReportPage() {
  return (
    <SiteShell>
      <div className="container report-layout">
        <aside className="report-aside">
          <Eyebrow>PERSONAL REPORT</Eyebrow>
          <h2>{personality.title}</h2>
          <nav aria-label="报告章节">{reportSections.map(([n,t]) => <a key={n} href={`#section-${n}`}><span>{n}</span>{t}</a>)}</nav>
          <div className="report-price"><small>完整报告</small><strong>¥9.9</strong><p>示例界面 · 支付尚未接入</p></div>
        </aside>
        <article className="report-document">
          <header className="report-cover">
            <Eyebrow>你的完整人格报告 · PREVIEW</Eyebrow>
            <h1>{personality.title}</h1>
            <p>{personality.summary}</p>
            <div className="tag-row">{personality.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
          </header>
          <section className="report-chapter" id="section-01"><span className="chapter-no">01</span><Eyebrow>核心人格</Eyebrow><h2>你真正需要的，是“自己想明白之后再行动”。</h2><p>你并不是天然抗拒规则，而是对“未经理解就被要求执行”这件事比较敏感。只要方向被你理解并认可，你通常会比外界预期更稳定。</p><blockquote>对你来说，自主不是叛逆，而是建立投入感的前提。</blockquote><p>这也解释了为什么你在学习、工作或关系里，往往更喜欢先观察结构：谁在决定、为什么这样做、这件事最后要去哪里。</p></section>
          <section className="report-chapter" id="section-02"><span className="chapter-no">02</span><Eyebrow>优势与天赋</Eyebrow><h2>复杂问题，反而容易让你进入状态。</h2><div className="insight-grid"><article><strong>01</strong><h3>抽象整理</h3><p>容易从杂乱信息里寻找规律，而不是只记住表面答案。</p></article><article><strong>02</strong><h3>独立判断</h3><p>群体意见会被你参考，但通常不会直接替代自己的判断。</p></article><article><strong>03</strong><h3>深度投入</h3><p>一旦认同方向，比起短时冲刺，你更适合持续迭代。</p></article></div></section>
          <section className="report-locked" id="section-03">
            <div className="locked-paper"><Eyebrow>03 / 盲点与压力</Eyebrow><h2>你不是没有情绪，只是常常先把情绪变成分析。</h2><p>当环境开始失控时，你最常见的第一反应是……</p><div className="blur-lines"><i /><i /><i /><i /><i /></div></div>
            <div className="unlock-box"><span>完整报告剩余 4 章</span><h3>解锁你在关系、工作与压力中的具体模式</h3><p>一次购买，查看完整人格报告与可执行建议。</p><div className="price-line"><strong>¥9.9</strong><span>等值本地价格</span></div><ButtonLink href="/report">解锁完整报告</ButtonLink><small>当前为 Visual Mock，06 号工程窗口将接入真实支付与权限。</small></div>
          </section>
        </article>
      </div>
    </SiteShell>
  );
}
