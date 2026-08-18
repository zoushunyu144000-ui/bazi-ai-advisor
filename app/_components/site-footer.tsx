export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-ink">
            八字顾问 · Bazi AI Advisor
          </p>
          <p>确定性排盘引擎 · 仅供文化与自我探索参考</p>
        </div>
        <p className="mt-4 leading-relaxed text-muted/80">
          本产品内容由确定性算法生成，不构成任何医疗、投资或人生决策建议。
        </p>
      </div>
    </footer>
  );
}
