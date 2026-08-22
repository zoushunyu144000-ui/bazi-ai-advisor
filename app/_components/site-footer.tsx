export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-ink">八字人格 · Bazi Personality</p>
          <p>里面认真算，外面认真发疯。</p>
        </div>
        <p className="mt-4 leading-relaxed text-muted/80">
          底层结果来自确定性排盘与规则映射，仅供文化与自我探索参考，不构成医疗、投资或人生决策建议。
        </p>
      </div>
    </footer>
  );
}
