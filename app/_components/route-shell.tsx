import Link from "next/link";

const routes = [
  ["首页", "/"],
  ["出生信息", "/birth"],
  ["结果", "/result"],
  ["完整报告", "/report"],
  ["AI 顾问", "/advisor"],
  ["账户", "/account"],
] as const;

interface RouteShellProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function RouteShell({ title, description, children }: RouteShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <header className="border-b border-[var(--border)] pb-6">
        <p className="text-sm text-[var(--muted-foreground)]">Bazi AI Advisor · MVP Shell</p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {routes.map(([label, href]) => (
            <Link key={href} href={href} className="underline-offset-4 hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <section className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </section>
    </main>
  );
}
