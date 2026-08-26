import Link from "next/link";
import { CharacterArt } from "@/app/_components/character-art";
import { PUBLIC_PERSONALITIES, PUBLIC_PERSONALITY_ORDER } from "@/lib/public-personalities";

const FEATURED = ["shi_shen", "shang_guan", "qi_sha"] as const;

const METHOD = [
  ["01", "出生信息标准化", "日期、时间、地点与传统排盘所需性别先被标准化；时辰不知道也会如实保留。"],
  ["02", "确定性八字排盘", "同一份有效输入会进入同一条 Birth → Bazi 计算链路，不靠抽签，也不让 AI 猜。"],
  ["03", "十神人格映射", "Interpretation 把十神分布和行为维度排序，最终只从十个固定 IP 中认领主人格。"],
] as const;

export default function HomePage() {
  return (
    <main data-page="club-directory" className="overflow-hidden">
      <section className="editorial-frame border-b border-line">
        <div className="grid lg:grid-cols-[.74fr_1.26fr]">
          <div className="border-b border-line px-5 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:py-20">
            <p className="editorial-kicker">CITY OBSERVATION / 城市观察体</p>
            <h1 aria-label="十怪人格俱乐部" className="display-xl mt-7">十怪人格<br />俱乐部</h1>
            <p className="mt-7 max-w-lg text-lg font-bold leading-8">十个性格，十个住在同一座城市里的普通怪人。</p>
            <p className="mt-4 max-w-lg leading-8 text-soft">不用答几十道选择题。把出生信息交给<strong className="text-ink">确定性八字</strong>链路，看看你被分到了哪一桌。</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/birth" className="btn-primary">认领我的人格 →</Link>
              <Link href="#club-directory" className="btn-ghost">先见见十个怪人</Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 border-y border-line text-center">
              <div className="border-r border-line py-4"><dt className="text-[10px] font-bold tracking-[.15em] text-muted">固定 IP</dt><dd className="mt-1 font-display text-2xl font-black">10</dd></div>
              <div className="border-r border-line py-4"><dt className="text-[10px] font-bold tracking-[.15em] text-muted">测试题</dt><dd className="mt-1 font-display text-2xl font-black">0</dd></div>
              <div className="py-4"><dt className="text-[10px] font-bold tracking-[.15em] text-muted">本机计算</dt><dd className="mt-1 font-display text-2xl font-black">YES</dd></div>
            </dl>
          </div>

          <div className="grid min-h-[32rem] grid-cols-3 bg-surface">
            {FEATURED.map((key, index) => {
              const personality = PUBLIC_PERSONALITIES[key];
              return (
                <article key={key} className="relative flex min-w-0 flex-col border-r border-line last:border-r-0">
                  <div className="px-3 pt-5 sm:px-5">
                    <p className="text-[10px] font-black tracking-[.12em]" style={{ color: personality.accent }}>{String(index + 1).padStart(2, "0")} / PILOT</p>
                    <h2 className="mt-2 font-display text-xl font-black tracking-tight sm:text-3xl">{personality.display_name}</h2>
                    <p className="mt-1 text-[10px] font-bold text-soft sm:text-xs">{personality.traditional_label.split(" · ")[0]}</p>
                  </div>
                  <div className="character-paper mt-auto flex min-h-72 flex-1 items-end">
                    <CharacterArt tenGod={key} className="h-auto max-h-[34rem] w-full object-contain object-bottom" priority />
                  </div>
                  <div className="border-t border-line px-3 py-4 sm:px-5">
                    <p className="text-xs font-black sm:text-sm">“{personality.anchor_quote}”</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="club-directory" className="editorial-frame scroll-mt-20 border-b border-line px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-7 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <div>
            <p className="editorial-kicker">THE 10 RESIDENTS</p>
            <h2 className="display-lg mt-5">同一栋楼里，<br />住着十种怪人。</h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg font-bold leading-8">每个人格只有一个固定角色、固定体态和固定识别色。</p>
            <p className="mt-3 leading-7 text-soft">他们不换脸、不因你的性别改角色，也不会临时长出第十一个人格。你的命盘只决定你最像谁。</p>
          </div>
        </div>

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {PUBLIC_PERSONALITY_ORDER.map((key, index) => {
            const personality = PUBLIC_PERSONALITIES[key];
            return (
              <article key={key} className="group relative flex min-h-[27rem] flex-col bg-surface" style={{ borderTop: `5px solid ${personality.accent}` }}>
                <div className="flex items-start justify-between gap-3 px-4 pt-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[.12em] text-muted">{personality.traditional_label.split(" · ")[0]}</p>
                    <h3 className="mt-1 font-display text-2xl font-black tracking-tight">{personality.display_name}</h3>
                  </div>
                  <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="character-paper mt-3 flex min-h-52 flex-1 items-end border-y border-line">
                  <CharacterArt tenGod={key} className="h-auto max-h-72 w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.025]" />
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm font-black">“{personality.anchor_quote}”</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-soft">{personality.one_line_roast}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="editorial-frame border-b border-line">
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="border-b border-line bg-navy px-5 py-14 text-paper sm:px-8 lg:border-b-0 lg:border-r lg:py-20">
            <p className="text-xs font-black tracking-[.2em] text-mustard">INSIDE: SERIOUS</p>
            <h2 className="display-lg mt-5">不是抽签，<br />不是 AI 瞎编。</h2>
            <p className="mt-6 max-w-md leading-8 text-paper/75">传统计算负责结构，规则映射负责解释，IP 系统负责让结果好记。三层边界清楚，任何一层都不冒充另一层。</p>
          </div>
          <div className="grid sm:grid-cols-3">
            {METHOD.map(([number, title, copy]) => (
              <article key={number} className="border-b border-line p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:p-8">
                <p className="font-display text-4xl font-black text-maroon">{number}</p>
                <h3 className="mt-10 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-soft">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-frame border-b border-line px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="editorial-kicker">PERSONALITY DOSSIER</p>
            <h2 className="display-lg mt-5">不是一个外号，<br />是一份人格档案。</h2>
            <p className="mt-5 max-w-xl leading-8 text-soft">免费档案包含主人格、第二人格、朋友视角、A 面、翻车面、15 项行为维度，以及工作、关系、压力、决策与金钱模式。</p>
            <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line text-sm font-bold">
              {["朋友眼里的你", "A 面 / 翻车面", "第二人格", "15 项行为维度", "八种生活模式", "专业八字依据"].map((item) => <div key={item} className="bg-surface px-4 py-3">✓ {item}</div>)}
            </div>
          </div>
          <div className="border border-ink bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[10px] font-bold tracking-[.14em] text-muted"><span>SAMPLE DOSSIER / 08</span><span>七杀型人格</span></div>
            <div className="grid grid-cols-[1.03fr_.97fr]">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black text-maroon">我的八字人格</p>
                <h3 className="display-lg mt-2">狠人</h3>
                <p className="mt-4 text-2xl font-black">“我来。”</p>
                <p className="mt-5 text-sm leading-7 text-soft">平时未必很凶，真有硬局时，系统会迅速从“怎么办”切到“先干哪一个”。</p>
              </div>
              <div className="character-paper flex min-h-80 items-end border-l border-line">
                <CharacterArt tenGod="qi_sha" className="h-auto max-h-[26rem] w-full object-contain object-bottom" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-frame grid bg-mustard lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="px-5 py-12 sm:px-8">
          <p className="text-xs font-black tracking-[.18em]">READY TO JOIN?</p>
          <h2 className="display-md mt-3 max-w-4xl">把出生信息交出来，看看你住几楼。</h2>
        </div>
        <div className="border-t border-ink px-5 py-8 lg:border-l lg:border-t-0 lg:px-10">
          <Link href="/birth" className="btn-primary whitespace-nowrap">开始认领人格 →</Link>
        </div>
      </section>
    </main>
  );
}
