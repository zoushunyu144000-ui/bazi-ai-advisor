import Link from "next/link";
import { CharacterSlot } from "@/app/_components/character-slot";
import {
  PUBLIC_PERSONALITIES,
  PUBLIC_PERSONALITY_ORDER,
} from "@/lib/public-personalities";
import { accentStyle } from "@/lib/personality-accent";

type Step = {
  no: string;
  title: string;
  body: string;
  featured?: boolean;
};

const STEPS: ReadonlyArray<Step> = [
  {
    no: "01",
    title: "填一下出生信息",
    body: "日期、时间、出生地。进入确定性 Birth → Bazi Engine → Interpretation，不需要做几十道人格选择题。",
  },
  {
    no: "02",
    title: "认真算底层",
    body: "八字引擎先排盘：月令、十神、透藏根气、格局候选，都走规则版本化的传统核心。",
    featured: true,
  },
  {
    no: "03",
    title: "认真发疯的输出",
    body: "一个固定官方人格 IP、一个副倾向、一份能发出去的档案。不是抽签，也不让 AI 重新排盘。",
  },
];

const SAMPLE_HOMEPAGE_HERO_KEY = "shang_guan";
const SAMPLE_HOMEPAGE_PREVIEW_KEY = "qi_sha";

export default function HomePage() {
  const heroKey = SAMPLE_HOMEPAGE_HERO_KEY;
  const previewKey = SAMPLE_HOMEPAGE_PREVIEW_KEY;
  const preview = PUBLIC_PERSONALITIES[previewKey];

  return (
    <main className="overflow-hidden">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* HERO                                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="relative" style={accentStyle(heroKey)}>
        <div aria-hidden className="pointer-events-none absolute right-[-12%] top-[-10%] h-72 w-72 rounded-full bg-[var(--p-soft,oklch(0.94_0.04_60))] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-72 w-72 rounded-full bg-[var(--p-soft,oklch(0.94_0.04_60))] blur-3xl opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-14 pt-10 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:pb-20 md:pt-14">
          <div className="reveal">
            <p className="eyebrow text-[var(--p-ink,var(--color-ink-deep))]">Bazi · City Observation</p>
            <h1 className="mt-5 display-xl text-ink-deep">
              你八字里，
              <br />
              到底住着
              <br />
              什么东西？
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-soft">
              把传统八字排盘，翻译成你真正看得懂、愿意分享的人格语言。
              <br />
              <span className="font-semibold text-ink-deep">里面认真算，外面认真发疯。</span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/birth" className="btn-accent">
                测测我是什么
              </Link>
              <Link href="#ten-types" className="btn-ghost">
                先看 10 种怪人 ↓
              </Link>
            </div>
            <p className="mt-4 text-[11px] tracking-[0.22em] text-muted">
              免费 · 本机计算 · 不需要登录
            </p>
          </div>

          <div className="reveal relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
              <CharacterSlot tenGod={heroKey} className="h-full w-full" />
            </div>
            <div className="absolute -left-2 -top-3 hidden rounded-2xl border border-paper bg-paper px-3 py-2 text-[11px] tracking-[0.16em] text-soft shadow-[0_18px_40px_-20px_rgba(0,0,0,0.4)] sm:block">
              <span className="font-bold text-ink-deep">PROFILE · 04 / 10</span>
              <span className="ml-2 text-muted">本月主推</span>
            </div>
          </div>
        </div>

        <div className="border-y border-line bg-paper/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 text-[11px] tracking-[0.18em] sm:px-8">
            <span className="text-muted">10 个固定官方 IP</span>
            <span className="text-muted">确定性排盘 · 规则版本化</span>
            <span className="text-muted">不制造伪精确人格比例</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MARQUEE — editorial personality strip                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-paper py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-cinnabar">Personality 01–10</p>
              <p className="mt-3 font-display text-xl font-bold text-ink-deep sm:text-2xl">
                横向滑动看看。每一种都是同一个世界里的官方 IP。
              </p>
            </div>
            <Link href="#ten-types" className="hidden whitespace-nowrap text-xs tracking-[0.18em] text-soft hover:text-cinnabar sm:inline">
              完整列表 ↓
            </Link>
          </div>
        </div>
        <div className="marquee mt-6 flex overflow-hidden">
          <div className="marquee-track flex shrink-0 gap-5 pr-5">
            {[...PUBLIC_PERSONALITY_ORDER, ...PUBLIC_PERSONALITY_ORDER].map((key, index) => {
              const item = PUBLIC_PERSONALITIES[key];
              return (
                <Link
                  key={`${key}-${index}`}
                  href="#ten-types"
                  className="flex w-[68vw] shrink-0 items-center gap-4 rounded-3xl border border-line bg-canvas p-4 sm:w-[420px]"
                  style={accentStyle(key)}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                    <CharacterSlot tenGod={key} variant="minimal" showMeta={false} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-bold tracking-[0.28em] text-[var(--p-ink,var(--color-ink-deep))]">
                      {String(PUBLIC_PERSONALITY_ORDER.indexOf(key) + 1).padStart(2, "0")} · CITY OBSERVATION
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-[var(--p-ink,var(--color-ink-deep))]">
                      {item.display_name}
                    </p>
                    <p className="text-xs text-soft">「{item.anchor_quote.replace(/[“”]/g, "")}」</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TEN PERSONALITIES — non-uniform editorial grid             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="ten-types" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <p className="eyebrow text-cinnabar">The 10 types</p>
            <h2 className="mt-3 display-lg text-ink-deep">十种怪人，先认领一个。</h2>
            <p className="mt-4 leading-7 text-soft">
              公网 V1 永远只认这 10 个核心人格。第二人格只负责加味，不会凭空长出第 11 种。
            </p>
          </div>
          <span className="text-xs tracking-[0.18em] text-muted">滑动 / hover / 点按</span>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {PUBLIC_PERSONALITY_ORDER.map((key, index) => {
            const item = PUBLIC_PERSONALITIES[key];
            const span =
              index === 0
                ? "lg:col-span-3"
                : index === 1
                ? "lg:col-span-3"
                : index === 2
                ? "lg:col-span-2"
                : index === 3
                ? "lg:col-span-2"
                : index === 4
                ? "lg:col-span-2"
                : "lg:col-span-2";
            const cardHeight =
              index === 0 || index === 1
                ? "min-h-[360px] sm:min-h-[400px]"
                : "min-h-[280px] sm:min-h-[300px]";
            return (
              <Link
                key={key}
                href="/birth"
                className={`group relative overflow-hidden rounded-[1.6rem] border border-line bg-canvas p-5 transition-transform duration-200 hover:-translate-y-0.5 ${span} ${cardHeight}`}
                style={accentStyle(key)}
                aria-label={`用 ${item.display_name} 测一次`}
              >
                <div className="absolute inset-0 -z-10 bg-[var(--p-paper,oklch(0.97_0.02_60))]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--p-ink,var(--color-ink-deep))]">
                      {String(index + 1).padStart(2, "0")} · {key.toUpperCase()}
                    </p>
                    <p className="text-[10px] tracking-[0.2em] text-[var(--p-ink,var(--color-ink-deep))] opacity-70">
                      {item.traditional_label.split(" · ")[0]}
                    </p>
                  </div>
                  <div className="my-4 h-44 overflow-hidden rounded-2xl sm:h-56">
                    <CharacterSlot tenGod={key} variant="compact" showMeta={false} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[var(--p-ink,var(--color-ink-deep))] sm:text-3xl">
                      {item.display_name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-soft">「{item.anchor_quote.replace(/[“”]/g, "")}」</p>
                    <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.16em] text-[var(--p-ink,var(--color-ink-deep))] opacity-80 transition group-hover:opacity-100">
                      用这个测一次 ↗
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HOW IT WORKS                                               */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-canvas py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-cinnabar">How it works</p>
              <h2 className="mt-3 display-md text-ink-deep">不是抽签，也不是 AI 瞎编。</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-soft">
              V1 先做传统命理判断，再做人格翻译。每一段可信的来源都能在专业依据区展开查看。
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.no}
                className={`relative flex flex-col rounded-[1.6rem] border p-7 transition ${
                  step.featured
                    ? "border-ink-deep bg-ink-deep text-paper"
                    : "border-line bg-paper text-ink-deep"
                }`}
              >
                <p className={`font-mono text-[11px] font-bold tracking-[0.32em] ${step.featured ? "text-paper/55" : "text-cinnabar"}`}>
                  {step.no}
                </p>
                <h3 className="mt-6 font-display text-2xl font-bold">{step.title}</h3>
                <p className={`mt-3 text-sm leading-7 ${step.featured ? "text-paper/80" : "text-soft"}`}>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* RESULT PREVIEW — dark editorial block                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow text-cinnabar">Result · editorial dossier</p>
            <h2 className="mt-3 display-lg text-ink-deep">免费也能看完一整份人格档案。</h2>
            <p className="mt-5 max-w-xl leading-8 text-soft">
              主标签 + 副倾向 + 15 项行为维度 + 八个生活场景卡 + 一张能直接发出去的卡。
              <br />
              <span className="text-muted">不做残缺诱导付费。</span>
            </p>
            <ul className="mt-7 grid grid-cols-2 gap-y-3 text-sm text-soft">
              {[
                "朋友眼里的你",
                "A 面 / 翻车面",
                "副倾向 + 锚点",
                "15 项行为维度",
                "8 张真实生活场景卡",
                "专业八字依据可展开",
                "1 张 1080×1350 分享卡",
                "1 张 1080×1920 Story 卡",
              ].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-line text-[10px] text-cinnabar">+</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <article
            className="relative overflow-hidden rounded-[2rem] p-7 sm:p-10"
            style={accentStyle(previewKey)}
          >
            <div className="absolute inset-0 bg-[var(--p-soft,oklch(0.94_0.04_60))] -z-10" />
            <p className="eyebrow text-[var(--p-ink,var(--color-ink-deep))] opacity-70">share card preview</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-sm text-soft">我的八字人格</p>
                <h3 className="mt-2 font-display text-5xl font-bold text-[var(--p-ink,var(--color-ink-deep))] sm:text-6xl">{preview.display_name}</h3>
                <p className="mt-3 font-display text-xl text-[var(--p-ink,var(--color-ink-deep))]">「{preview.anchor_quote.replace(/[“”]/g, "")}」</p>
                <p className="mt-5 max-w-sm text-sm leading-7 text-soft">{preview.share_card_copy}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {preview.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-[var(--p-hairline,var(--color-line))] px-3 py-1.5 text-xs text-[var(--p-ink,var(--color-ink-deep))]">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="mx-auto h-56 w-44 sm:h-64 sm:w-48">
                <CharacterSlot tenGod={previewKey} variant="compact" showMeta={false} />
              </div>
            </div>
            <p className="mt-8 border-t border-paper/15 pt-4 text-[11px] tracking-[0.18em] text-muted">
              测测你是什么东西 · BAZI PERSONALITY
            </p>
          </article>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* FINAL CTA                                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-canvas">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-20 text-center sm:px-8">
          <p className="eyebrow text-cinnabar">Final scene</p>
          <h2 className="display-lg text-ink-deep">准备好认领你的怪人身份了吗？</h2>
          <p className="text-base leading-7 text-soft">
            出生信息一填，看看八字到底把你分到了哪一桌。
          </p>
          <Link href="/birth" className="btn-primary mt-2 px-8 text-base">
            测测我是什么 →
          </Link>
        </div>
      </section>
    </main>
  );
}
