import Link from "next/link";

const CONTEXT = ["四柱与日主", "十神分布", "主人格 / 第二人格", "15 项行为维度"];

export default function AdvisorPage() {
  return (
    <main data-provider-state="not-configured" className="editorial-frame">
      <section className="grid min-h-[42rem] lg:grid-cols-[.68fr_1.32fr]">
        <aside className="border-b border-line bg-navy px-5 py-12 text-paper sm:px-8 lg:border-b-0 lg:border-r lg:py-16">
          <p className="text-xs font-black tracking-[.18em] text-mustard">AI ADVISOR / WORKSPACE</p>
          <h1 className="display-lg mt-5">AI 顾问室</h1>
          <p className="mt-5 leading-8 text-paper/70">顾问只负责解释与建议，不参与排盘。它读取的是确定性命盘上下文，而不是重新猜一遍你是谁。</p>
          <div className="mt-9 border border-paper/20">
            <p className="border-b border-paper/20 px-4 py-3 text-[10px] font-black tracking-[.14em] text-paper/50">PLANNED CONTEXT</p>
            {CONTEXT.map((item, index) => <div key={item} className="flex items-center gap-3 border-b border-paper/20 px-4 py-3 text-sm last:border-b-0"><span className="font-mono text-mustard">0{index + 1}</span><span>{item}</span></div>)}
          </div>
          <Link href="/result" className="btn-ghost mt-7 border-paper/40 text-paper hover:text-ink">先查看人格档案</Link>
        </aside>

        <section className="flex min-h-[42rem] flex-col bg-surface">
          <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
            <div><p className="text-xs font-black">新会话</p><p className="mt-1 text-[10px] text-muted">尚未连接模型服务</p></div>
            <span className="border border-maroon bg-cinnabar-soft px-3 py-1.5 text-[10px] font-black text-maroon">PROVIDER 未配置</span>
          </header>
          <div className="grid flex-1 place-items-center px-5 py-12 sm:px-8">
            <div className="w-full max-w-xl border border-line bg-paper p-6 sm:p-8">
              <p className="font-display text-5xl font-black text-dusty-purple">?</p>
              <h2 className="display-md mt-5">顾问还没开门。</h2>
              <p className="mt-4 leading-8 text-soft">当前没有配置模型 Provider、密钥、额度账本或会话存储。为了不伪造回答，输入框保持不可用。</p>
              <div className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-3">
                {["先排盘", "带上下文提问", "回答不改命盘"].map((item, index) => <div key={item} className="bg-surface px-3 py-4 text-center text-xs font-bold"><span className="block text-maroon">0{index + 1}</span><span className="mt-2 block">{item}</span></div>)}
              </div>
            </div>
          </div>
          <div className="border-t border-line p-4 sm:p-6">
            <div className="flex border border-line-strong bg-paper">
              <input aria-label="向 AI 顾问提问" disabled placeholder="模型服务配置后开放提问…" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-muted outline-none disabled:cursor-not-allowed" />
              <button disabled className="border-l border-line bg-line px-5 text-sm font-black text-muted disabled:cursor-not-allowed">发送</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
