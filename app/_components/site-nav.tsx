import Link from "next/link";

const NAV = [
  { href: "/", label: "十种人格" },
  { href: "/birth", label: "开始测试" },
  { href: "/result", label: "我的结果" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-cinnabar font-display text-lg font-bold text-white transition-transform group-hover:-rotate-6">八</span>
          <span><span className="block font-display text-base font-bold tracking-tight sm:text-lg">八字人格</span><span className="hidden text-[10px] tracking-[.16em] text-muted sm:block">BAZI PERSONALITY</span></span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-5">
          {NAV.map((item) => <Link key={item.href} href={item.href} className={item.href === "/birth" ? "rounded-full bg-ink px-4 py-2 font-semibold text-paper transition hover:opacity-85" : "hidden text-soft transition-colors hover:text-cinnabar sm:inline"}>{item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
