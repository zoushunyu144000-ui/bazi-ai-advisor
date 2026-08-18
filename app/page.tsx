import Link from "next/link";

const FEATURES = [
  {
    tag: "免费",
    title: "确定性四柱排盘",
    desc: "基于节气与干支的确定性引擎，不依赖大模型自由发挥，结果可复现、可审计。",
  },
  {
    tag: "结构",
    title: "五行 · 十神解码",
    desc: "将命盘翻译为五行强弱、十神分布与干支关系，呈现你能量的底层结构。",
  },
  {
    tag: "进阶",
    title: "大运走势推演",
    desc: "以传统「三天为一岁」之法推演顺逆大运，呈现人生不同阶段的能量流转。",
  },
  {
    tag: "即将上线",
    title: "人格报告与 AI 顾问",
    desc: "低价完整人格报告，叠加有次数限制的 AI 顾问，把古典智慧转译为现代行动建议。",
  },
];

const STEPS = [
  { n: "01", t: "录入出生信息", d: "阳历生日、出生时间（可选）、时区与性别。" },
  { n: "02", t: "引擎排盘", d: "确定性算法换算年、月、日、时四柱及藏干。" },
  { n: "03", t: "结构化解读", d: "五行分布、十神格局、日主强弱与大运一览。" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-cinnabar/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
          <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">
            AI 八字 · 现代行为指导
          </p>
          <h1 className="display-xl mt-4 max-w-3xl">
            读懂你的
            <span className="text-cinnabar">先天能量结构</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soft">
            八字顾问用一套确定性排盘引擎，把你的出生时刻翻译成四柱命盘、
            五行分布与大运走势。不玄学套话，只看结构——帮你更清晰地理解自己。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/birth" className="btn-primary">
              立即免费排盘 →
            </Link>
            <Link href="/report" className="btn-ghost">
              了解人格报告
            </Link>
          </div>
          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              ["4", "柱干支排盘"],
              ["5", "行能量分布"],
              ["8", "步大运推演"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="display-lg text-cinnabar">{num}</dt>
                <dd className="mt-1 text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="rule-accent" />
        <h2 className="display-lg mt-5">我们能为你做什么</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-shadow hover:shadow-[0_14px_40px_-22px_rgba(0,0,0,0.35)]"
            >
              <span className="inline-block rounded-full bg-cinnabar-soft px-3 py-1 text-xs font-semibold text-cinnabar">
                {f.tag}
              </span>
              <h3 className="display-md mt-4">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-soft">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="display-lg">三步，生成你的命盘</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <span className="display-md text-line-strong">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-soft">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/birth" className="btn-primary">
              开始排盘 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
