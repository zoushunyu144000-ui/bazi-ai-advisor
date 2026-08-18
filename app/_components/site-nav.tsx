import Link from "next/link";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/birth", label: "排盘" },
  { href: "/report", label: "人格报告" },
  { href: "/advisor", label: "AI 顾问" },
  { href: "/account", label: "账户" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-cinnabar font-display text-lg font-bold text-white transition-transform group-hover:-rotate-6">
            八
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            八字顾问
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-soft transition-colors hover:text-cinnabar"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
