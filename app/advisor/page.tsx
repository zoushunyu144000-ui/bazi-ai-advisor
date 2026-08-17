import { ButtonLink, Eyebrow, SiteShell } from "@/app/_components/design-system";

export default function AdvisorPage() {
  return (
    <SiteShell compact>
      <div className="container advisor-page">
        <aside className="advisor-context">
          <Eyebrow>AI ADVISOR</Eyebrow>
          <h1>把报告继续问下去。</h1>
          <p>顾问会自动参考你的命盘结构与已生成报告，不需要每次重新解释自己。</p>
          <div className="credit-card"><span>剩余次数</span><strong>10</strong><small>/ 10 次</small><div><i style={{ width: "100%" }} /></div></div>
          <div className="context-note"><span>已载入</span><p><strong>人格图谱</strong><br />清醒的独立观察者</p></div>
        </aside>
        <section className="chat-shell">
          <header><div><span className="advisor-avatar">序</span><div><strong>知序顾问</strong><small>基于你的报告回答</small></div></div><span className="online-dot">● 在线</span></header>
          <div className="chat-body">
            <div className="chat-date">今天</div>
            <div className="bubble bubble-ai"><p>你可以直接问具体场景。比如：为什么我一被催就不想做？我适合什么样的工作节奏？</p></div>
            <div className="bubble bubble-user"><p>为什么我明明很在意一件事，却经常拖到最后才开始？</p></div>
            <div className="bubble bubble-ai"><p>从你目前的人格维度看，这更像是<strong>“自主权不足时的启动阻力”</strong>，不完全是执行力差。</p><p>你对重要事情通常需要先建立“这是我自己决定要做”的感觉。如果任务只剩外部压力，你会先分析、观望，甚至用拖延重新夺回控制感。</p><div className="chat-callout">可以试试：把任务从“别人要求我完成”改写成“我决定今天先推进哪 20%”。</div></div>
          </div>
          <div className="suggestion-row"><button>工作选择</button><button>关系冲突</button><button>最近状态</button></div>
          <div className="chat-input"><span>输入你现在真正想问的问题…</span><button aria-label="发送">↑</button></div>
          <p className="credit-hint">发送 1 个问题预计消耗 1 次 · 当前为 Mock</p>
        </section>
      </div>
      <section className="container advisor-upsell"><div><Eyebrow>10 次 AI 顾问</Eyebrow><h2>不是重新算一次，而是基于你的报告继续讨论现实问题。</h2></div><div><strong>¥29.9</strong><ButtonLink href="/advisor">购买 10 次顾问</ButtonLink></div></section>
    </SiteShell>
  );
}
