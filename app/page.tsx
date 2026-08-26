import Link from "next/link";
import { CharacterArt } from "@/app/_components/character-art";
import { PUBLIC_PERSONALITIES, PUBLIC_PERSONALITY_ORDER } from "@/lib/public-personalities";

const HOW = [
  ["01", "填出生信息", "不用做几十道选择题。日期、时间和出生地进入确定性八字链路。"],
  ["02", "认真算底层", "八字引擎先排盘，Interpretation 再把真实十神与行为维度翻译成人格。"],
  ["03", "认真发疯", "最后只给你一个最容易记住的核心人格、一个第二人格和一份能发出去的结果。"],
] as const;

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-line">
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cinnabar/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:pb-24 md:pt-24">
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.28em] text-cinnabar">八字版 SBTI · 免费人格测试</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.06] tracking-[-0.04em] text-ink sm:text-6xl md:text-7xl">
              用八字测测，<br />你到底是个什么东西。
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-soft sm:text-lg">
              不用答几十道题。出生信息一填，看看你是犟种、狠人、活菩萨，还是天生反骨。
              <span className="font-semibold text-ink">里面认真算，外面认真发疯。</span>
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/birth" className="btn-primary px-6 py-3.5 text-base">测测我是什么 →</Link>
              <span className="text-xs leading-5 text-muted">免费 · 本机计算 · 不需要登录</span>
            </div>
          </div>

          <div className="relative min-h-[26rem] sm:min-h-[32rem]">
            <div className="absolute inset-x-4 top-6 rounded-[2rem] border border-line bg-surface p-5 shadow-[0_30px_80px_-52px_rgba(0,0,0,.55)] sm:inset-x-8 sm:p-7">
              <div className="flex items-center justify-between text-xs text-muted"><span>人格结果预览</span><span>NO. 04 / 10</span></div>
              <div className="mt-5 grid grid-cols-[1fr_.9fr] items-end gap-2">
                <div className="pb-4">
                  <p className="text-xs font-semibold tracking-[.18em] text-cinnabar">伤官型人格</p>
                  <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">天生反骨</h2>
                  <p className="mt-3 text-xl font-semibold">“凭什么？”</p>
                  <p className="mt-4 text-sm leading-6 text-soft">规则写了三页，你看完第一反应不是遵守，是找它哪里不合理。</p>
                </div>
                <div className="flex min-h-[18rem] items-end justify-center overflow-hidden rounded-[1.5rem] bg-cinnabar-soft/60">
                  <CharacterArt tenGod="shang_guan" className="h-auto max-h-[20rem] w-full object-contain object-bottom" priority />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{["凭什么", "开麦选手", "脑内重构", "不盲从"].map((tag)=><span key={tag} className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs">{tag}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[.24em] text-cinnabar">THE 10 TYPES</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">十种怪人，先认领一个。</h2>
          <p className="mt-4 leading-7 text-soft">公网 V1 永远只认这 10 个核心人格。第二人格只负责加味，不会凭空长出第 11 种。</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PUBLIC_PERSONALITY_ORDER.map((key, index) => {
            const p = PUBLIC_PERSONALITIES[key];
            return (
              <article key={key} className="group overflow-hidden rounded-[1.35rem] border border-line bg-surface p-4 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex min-h-36 items-end justify-center overflow-hidden rounded-xl bg-paper">
                  <CharacterArt tenGod={key} className="max-h-44 w-full object-contain object-bottom transition-transform duration-200 group-hover:scale-[1.02]" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div><p className="text-[11px] font-semibold text-muted">{p.traditional_label.split("型人格")[0]}</p><h3 className="mt-1 font-display text-2xl font-bold">{p.display_name}</h3></div>
                  <span className="text-xs text-muted">{String(index + 1).padStart(2,"0")}</span>
                </div>
                <p className="mt-2 text-sm font-medium">{p.anchor_quote}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-surface/70">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs font-bold tracking-[.24em] text-cinnabar">HOW IT WORKS</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">不是抽签，也不是 AI 瞎编。</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOW.map(([n,t,d])=><article key={n} className="rounded-[1.35rem] border border-line bg-paper p-6"><span className="text-sm font-bold text-cinnabar">{n}</span><h3 className="mt-6 text-xl font-bold">{t}</h3><p className="mt-3 leading-7 text-soft">{d}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[.24em] text-cinnabar">PERSONALITY DOSSIER</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">不只告诉你一个外号。</h2>
          <p className="mt-4 max-w-xl leading-8 text-soft">免费结果会继续给朋友视角、A 面、翻车面、第二人格、真实行为维度，以及工作、学习、关系、冲突、压力、回血、决策与金钱模式。</p>
          <div className="mt-7 flex flex-wrap gap-2">{["朋友眼里的你","A 面 / 翻车面","第二人格","15 项真实维度","工作 / 关系 / 压力","八字依据可展开"].map(x=><span key={x} className="rounded-full border border-line px-3 py-2 text-sm">{x}</span>)}</div>
        </div>
        <div className="rounded-[1.6rem] border border-line bg-ink p-6 text-paper sm:p-8">
          <p className="text-xs tracking-[.2em] text-paper/60">SHARE CARD PREVIEW</p>
          <div className="mt-12 flex items-end justify-between gap-4">
            <div><p className="text-sm text-paper/60">我的八字人格</p><h3 className="mt-2 font-display text-5xl font-bold">狠人</h3><p className="mt-3 text-xl">“我来。”</p></div>
            <span className="rounded-full border border-paper/25 px-3 py-1.5 text-xs">七杀型人格</span>
          </div>
          <p className="mt-10 max-w-md text-sm leading-7 text-paper/70">平时可以懒，真有硬局的时候身体里会自动弹出一句：我来。</p>
          <div className="mt-8 border-t border-paper/15 pt-4 text-xs text-paper/50">测测你是什么东西 · BAZI PERSONALITY</div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <p className="text-sm font-semibold text-cinnabar">准备好认领你的怪人身份了吗？</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">出生信息一填，看看八字到底把你分到了哪一桌。</h2>
          <Link href="/birth" className="btn-primary mt-8 inline-flex px-7 py-3.5 text-base">测测我是什么 →</Link>
        </div>
      </section>
    </main>
  );
}
