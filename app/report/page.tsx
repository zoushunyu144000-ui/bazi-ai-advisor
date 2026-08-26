import Link from "next/link";
import { CharacterArt } from "@/app/_components/character-art";

const CHAPTERS = [
  ["01", "人格动力结构", "主人格、第二人格与关键行为维度如何互相拉扯。"],
  ["02", "工作与决策", "在目标、规则、风险和资源面前，你通常怎样启动。"],
  ["03", "关系与冲突", "亲密、边界、表达和压力状态下最容易出现的模式。"],
  ["04", "成长行动清单", "把抽象性格翻译为可执行、可复盘的日常练习。"],
] as const;

export default function ReportPage() {
  return (
    <main data-report-state="preview" className="editorial-frame">
      <section className="grid border-b border-line lg:grid-cols-[.8fr_1.2fr]">
        <div className="border-b border-line px-5 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:py-20">
          <p className="editorial-kicker">DEEP REPORT / PREVIEW</p>
          <h1 className="display-lg mt-6">深度报告，<br />先把目录摊开。</h1>
          <p className="mt-6 max-w-lg leading-8 text-soft">免费人格档案已经完整可用。深度报告会在真实支付与内容生成链路完成后开放；当前页面只展示产品范围，不接受付款。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/birth" className="btn-primary">先测免费人格 →</Link>
            <Link href="/result" className="btn-ghost">打开我的档案</Link>
          </div>
        </div>
        <div className="grid min-h-[31rem] grid-cols-[1fr_.9fr] bg-surface">
          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between border-b border-ink pb-3 text-[10px] font-bold tracking-[.14em]"><span>REPORT SAMPLE</span><span>24—36 PAGES</span></div>
            <p className="mt-8 text-xs font-black text-maroon">七杀型人格 / SAMPLE</p>
            <h2 className="display-lg mt-2">狠人</h2>
            <p className="mt-4 text-xl font-black">高压不是性格，<br />是你的启动按钮。</p>
            <p className="mt-6 text-sm leading-7 text-soft">真正要研究的不是“你够不够狠”，而是强度什么时候帮到你，什么时候开始消耗你。</p>
            <div className="mt-8 border-t border-line pt-3 text-[10px] font-bold text-muted">BAZI PERSONALITY CLUB / 08</div>
          </div>
          <div className="character-paper flex items-end border-l border-line">
            <CharacterArt tenGod="qi_sha" className="h-auto max-h-[31rem] w-full object-contain object-bottom" priority />
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[.55fr_1.45fr]">
        <div className="border-b border-line bg-mustard px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r">
          <p className="text-xs font-black tracking-[.16em]">WHAT WILL BE INSIDE</p>
          <h2 className="display-md mt-4">四章，不灌水。</h2>
          <p className="mt-4 text-sm leading-7">正式报告不会改写排盘，只会在确定性结果上扩展解释深度。</p>
        </div>
        <div className="grid sm:grid-cols-2">
          {CHAPTERS.map(([number, title, copy]) => <article key={number} className="border-b border-line p-6 odd:border-r sm:p-8"><p className="font-display text-3xl font-black text-maroon">{number}</p><h3 className="mt-6 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-7 text-soft">{copy}</p></article>)}
        </div>
      </section>

      <section className="border-t border-ink bg-navy px-5 py-8 text-paper sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <div><p className="text-xs font-black tracking-[.16em] text-mustard">PAYMENT STATE / NOT CONFIGURED</p><p className="mt-2 text-sm leading-6 text-paper/70">支付、订单与报告生成服务均未接入，因此不会出现虚假的购买按钮或成功状态。</p></div>
        <span className="mt-4 inline-flex border border-paper/30 px-4 py-2 text-xs font-bold sm:mt-0">当前仅供预览</span>
      </section>
    </main>
  );
}
