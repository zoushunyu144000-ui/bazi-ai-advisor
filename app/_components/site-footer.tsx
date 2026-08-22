export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl font-bold text-ink-deep">八字人格</p>
            <p className="mt-1 text-xs tracking-[0.22em] text-muted">BAZI PERSONALITY</p>
          </div>
          <div className="text-sm text-soft">
            <p className="font-display text-base font-semibold text-ink-deep">里面认真算，外面认真发疯。</p>
            <p className="mt-1 leading-relaxed text-muted">
              底层结果来自确定性排盘与规则映射，仅供文化与自我探索参考，
              <br />
              不构成医疗、投资或人生决策建议。
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-[11px] tracking-[0.16em] text-muted sm:flex-row sm:justify-between">
          <span>© BAZI PERSONALITY · MOBILE UI PILOT V1</span>
          <span>Character 10/10 · Style Locked · Translation Doctrine Locked</span>
        </div>
      </div>
    </footer>
  );
}
