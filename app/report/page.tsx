import Link from "next/link";

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="text-xs font-bold tracking-[.24em] text-cinnabar">DEEP REPORT · COMING SOON</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">深度人格报告即将开放。</h1>
      <p className="mx-auto mt-5 max-w-2xl leading-8 text-soft">
        今晚的免费人格体验已经完整开放。旧版 25 个 experimental archetypes 已退出公网人格判断，不再通过这个页面生成正式结果；正式付费报告会在支付与 AI 系统完成后再接入。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/birth" className="btn-primary">先测免费人格 →</Link>
        <Link href="/result" className="btn-ghost">查看我的结果</Link>
      </div>
    </main>
  );
}
