import Link from "next/link";

const NAV = [
  { href: "/", label: "俱乐部" },
  { href: "/birth", label: "出生信息" },
  { href: "/result", label: "人格档案" },
  { href: "/report", label: "深度报告" },
  { href: "/advisor", label: "AI 顾问" },
  { href: "/account", label: "账户" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="editorial-frame flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="八字人格俱乐部首页">
          <span className="grid h-9 w-9 place-items-center border border-ink bg-maroon font-display text-lg font-black text-paper transition-transform group-hover:-rotate-3">八</span>
          <span><span className="block font-display text-sm font-black leading-none tracking-[-.03em] sm:text-base">八字人格俱乐部</span><span className="mt-1 hidden text-[9px] font-bold tracking-[.2em] text-muted sm:block">BAZI PERSONALITY CLUB</span></span>
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4 text-xs font-bold lg:gap-5">
          {NAV.map((item) => <Link key={item.href} href={item.href} className={item.href === "/birth" ? "border border-ink bg-ink px-3 py-2 text-paper hover:bg-maroon" : "hidden text-soft underline-offset-4 hover:text-maroon hover:underline md:inline"}>{item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
