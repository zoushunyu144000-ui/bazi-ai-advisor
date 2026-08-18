import Link from "next/link";

interface RoadmapPageProps {
  tag: string;
  title: string;
  intro: string;
  items: { title: string; desc: string }[];
}

export function RoadmapPage({ tag, title, intro, items }: RoadmapPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">
        {tag}
      </p>
      <h1 className="display-lg mt-3">{title}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-soft">{intro}</p>

      <div className="mt-10 space-y-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
            <div>
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-soft">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-paper p-6 text-center">
        <p className="text-sm text-muted">
          这一阶段已开放：免费四柱排盘。立即体验核心功能。
        </p>
        <Link href="/birth" className="btn-primary mt-4">
          去排盘 →
        </Link>
      </div>
    </main>
  );
}
