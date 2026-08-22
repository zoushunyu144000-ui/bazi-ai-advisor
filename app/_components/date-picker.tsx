"use client";

import { useCallback, useMemo } from "react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (next: string) => void;
  max?: string; // YYYY-MM-DD
}

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

function buildCalendarGrid(year: number, month0: number): (Date | null)[] {
  const firstWeekday = new Date(year, month0, 1).getDay();
  const total = daysInMonth(year, month0);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month0, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function parseYmd(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return new Date(y, m - 1, d);
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function DatePicker({ value, onChange, max }: DatePickerProps) {
  const current = useMemo(() => parseYmd(value) ?? new Date(1995, 0, 1), [value]);
  const todayIso = useMemo(() => isoDate(new Date()), []);
  const maxIso = max ?? todayIso;

  const viewYear = current.getFullYear();
  const viewMonth = current.getMonth();
  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const shiftMonth = useCallback(
    (delta: number) => {
      const next = new Date(viewYear, viewMonth + delta, 1);
      const target = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : isoDate(next);
      // Preserve day-of-month where possible.
      const fallbackDay = Math.min(parseYmd(target)?.getDate() ?? 15, daysInMonth(next.getFullYear(), next.getMonth()));
      onChange(isoDate(new Date(next.getFullYear(), next.getMonth(), fallbackDay)));
    },
    [viewYear, viewMonth, value, onChange],
  );

  const setDay = useCallback(
    (date: Date) => {
      const iso = isoDate(date);
      if (iso > maxIso) return;
      onChange(iso);
    },
    [maxIso, onChange],
  );

  const monthLabel = `${viewYear} · ${pad(viewMonth + 1)}月`;

  return (
    <div className="rounded-3xl border border-line-strong bg-canvas p-4">
      <div className="flex items-center justify-between pb-3">
        <button
          type="button"
          aria-label="上个月"
          onClick={() => shiftMonth(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-base font-bold text-soft transition hover:border-ink-deep hover:text-ink-deep"
        >
          ←
        </button>
        <div className="font-display text-lg font-bold tracking-tight">{monthLabel}</div>
        <button
          type="button"
          aria-label="下个月"
          onClick={() => shiftMonth(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-base font-bold text-soft transition hover:border-ink-deep hover:text-ink-deep"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[10px] font-bold tracking-[0.15em] text-muted">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} aria-hidden />;
          const iso = isoDate(date);
          const isSelected = iso === value;
          const isFuture = iso > maxIso;
          return (
            <button
              key={iso}
              type="button"
              disabled={isFuture}
              onClick={() => setDay(date)}
              className={`flex min-h-[44px] items-center justify-center rounded-2xl text-sm font-semibold tabular-nums transition ${
                isSelected
                  ? "bg-ink-deep text-paper"
                  : isFuture
                  ? "text-muted/40"
                  : "text-soft hover:bg-dust hover:text-ink-deep"
              }`}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
        <span>最远可选</span>
        <span className="font-mono">{maxIso}</span>
      </div>
    </div>
  );
}
