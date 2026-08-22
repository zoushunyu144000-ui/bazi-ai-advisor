import Link from "next/link";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/birth", label: "开始测试" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 py-1">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-deep font-display text-base font-bold leading-none text-paper transition group-hover:-rotate-6">
            八
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight text-ink-deep sm:text-lg">
              八字人格
            </span>
            <span className="hidden text-[10px] tracking-[.22em] text-muted sm:block">BAZI PERSONALITY</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/"
                  ? "hidden text-soft hover:text-ink-deep sm:inline-flex sm:min-h-[44px] sm:items-center sm:px-3"
                  : "inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ink-deep px-4 py-2.5 font-semibold leading-none text-paper transition hover:bg-ink"
              }
            >
              {item.label}
              {item.href === "/birth" && <span aria-hidden>→</span>}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
