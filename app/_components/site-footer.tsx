import Link from "next/link";

const FOOTER_LINKS = [
  ["十怪人格", "/"],
  ["开始测试", "/birth"],
  ["人格档案", "/result"],
  ["报告预览", "/report"],
  ["AI 顾问", "/advisor"],
  ["本地账户", "/account"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="editorial-frame grid gap-8 px-5 py-10 text-sm text-muted md:grid-cols-[1fr_1.25fr] md:px-8">
        <div>
          <p className="font-display text-2xl font-black tracking-tight text-ink">八字人格俱乐部</p>
          <p className="mt-2 font-semibold text-soft">里面认真算，外面认真发疯。</p>
          <p className="mt-5 max-w-md text-xs leading-6">底层结果来自确定性排盘与规则映射，仅供文化与自我探索参考，不构成医疗、投资或人生决策建议。</p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
          {FOOTER_LINKS.map(([label, href]) => <Link key={href} href={href} className="bg-surface px-4 py-3 text-xs font-bold text-soft hover:bg-mustard hover:text-ink">{label} →</Link>)}
        </div>
      </div>
    </footer>
  );
}
