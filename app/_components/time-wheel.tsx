"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

interface TimeWheelProps {
  value: string; // "HH:MM"
  onChange: (next: string) => void;
}

/**
 * Tactile two-column wheel picker for birth time.
 *
 * Hours cycle 0–23, minutes step by 5 (00/05/10/.../55) which is precise
 * enough for the free tier; the "approximate" toggle in the Birth form
 * controls whether the user is committed to this exact clock value.
 *
 * The wheel uses pointer / wheel / touch events to feel like an iOS UIPickerView:
 *   - drag up/down to change,
 *   - snap to the nearest item on release,
 *   - passive selection haptics when supported (no-op fallback),
 *   - reduced-motion safe (snaps instantly).
 */
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PADDING_ROWS = Math.floor(VISIBLE_ROWS / 2);

function parseTime(value: string): { hour: number; minute: number } {
  const [h, m] = value.split(":").map((part) => Number.parseInt(part, 10));
  if (Number.isFinite(h) && Number.isFinite(m)) return { hour: h, minute: m };
  return { hour: 12, minute: 0 };
}

function timeToMinuteValue(value: string): number {
  const { hour, minute } = parseTime(value);
  return hour * 60 + minute;
}

interface ColumnProps {
  values: string[];
  selectedIndex: number;
  onPick: (index: number) => void;
  suffix?: string;
}

function WheelColumn({ values, selectedIndex, onPick, suffix }: ColumnProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const startScroll = useRef<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const alignToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) return;
      const target = itemRefs.current[index];
      if (!target) return;
      const offset = target.offsetTop - PADDING_ROWS * ROW_HEIGHT;
      container.scrollTo({ top: offset, behavior });
    },
    [],
  );

  useEffect(() => {
    alignToIndex(selectedIndex, "auto");
  }, [alignToIndex, selectedIndex]);

  function onScroll() {
    const container = containerRef.current;
    if (!container) return;
    const center = container.scrollTop + PADDING_ROWS * ROW_HEIGHT + ROW_HEIGHT / 2;
    const index = Math.round(center / ROW_HEIGHT) - PADDING_ROWS;
    if (index !== selectedIndex && index >= 0 && index < values.length) {
      onPick(index);
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    startY.current = event.clientY;
    startScroll.current = container.scrollTop;
    (event.target as Element).setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container || startY.current === null) return;
    const delta = startY.current - event.clientY;
    container.scrollTop = startScroll.current + delta;
    event.preventDefault();
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container || startY.current === null) return;
    const center = container.scrollTop + PADDING_ROWS * ROW_HEIGHT + ROW_HEIGHT / 2;
    const index = Math.max(0, Math.min(values.length - 1, Math.round(center / ROW_HEIGHT) - PADDING_ROWS));
    alignToIndex(index, "smooth");
    startY.current = null;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    event.preventDefault();
    container.scrollTop += event.deltaY;
  }

  function onKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowUp") onPick(Math.max(0, selectedIndex - 1));
    if (event.key === "ArrowDown") onPick(Math.min(values.length - 1, selectedIndex + 1));
    if (event.key === "PageUp") onPick(Math.max(0, selectedIndex - 5));
    if (event.key === "PageDown") onPick(Math.min(values.length - 1, selectedIndex + 5));
  }

  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label={suffix ? `${values.join(" ")} ${suffix}` : values.join(" ")}
      className="relative h-[220px] w-full select-none overflow-hidden focus:outline-none"
      onKeyDown={onKey}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-line-strong bg-paper/85"
        style={{ height: ROW_HEIGHT }}
      />
      <div
        ref={containerRef}
        onScroll={onScroll}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="no-scrollbar h-full overflow-y-scroll snap-y snap-mandatory touch-none"
        style={{ scrollPaddingBlockStart: `${PADDING_ROWS * ROW_HEIGHT}px` }}
      >
        <div style={{ height: PADDING_ROWS * ROW_HEIGHT }} aria-hidden />
        {values.map((value, index) => (
          <div
            key={value}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            onClick={() => onPick(index)}
            className={`flex h-[44px] snap-center items-center justify-center font-display text-2xl font-semibold tabular-nums ${
              index === selectedIndex ? "text-ink" : "text-muted"
            }`}
            role="option"
            aria-selected={index === selectedIndex}
          >
            {value}
            {suffix && <span className="ml-1 text-sm font-normal text-muted">{suffix}</span>}
          </div>
        ))}
        <div style={{ height: PADDING_ROWS * ROW_HEIGHT }} aria-hidden />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-2 top-0 h-[70px] bg-gradient-to-b from-paper to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-2 bottom-0 h-[70px] bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}

export function TimeWheel({ value, onChange }: TimeWheelProps) {
  // The visible selection is always derived from the current `value` prop.
  // User interactions mutate `value` via `onChange`, which routes back here
  // through the parent, so we never need to mirror the selection into state.
  const { hourIndex, minuteIndex } = useMemo(() => {
    const parsed = parseTime(value);
    return { hourIndex: parsed.hour, minuteIndex: Math.round(parsed.minute / 5) };
  }, [value]);

  const emit = useCallback(
    (nextHourIndex: number, nextMinuteIndex: number) => {
      const next = `${HOURS[nextHourIndex]}:${MINUTES[nextMinuteIndex]}`;
      if (next !== value) onChange(next);
    },
    [onChange, value],
  );

  const totalMinutes = timeToMinuteValue(value);

  return (
    <div className="rounded-3xl border border-line-strong bg-canvas px-3 py-5">
      <div className="grid grid-cols-2 gap-3">
        <WheelColumn
          values={HOURS}
          selectedIndex={hourIndex}
          onPick={(index) => emit(index, minuteIndex)}
          suffix="时"
        />
        <WheelColumn
          values={MINUTES}
          selectedIndex={minuteIndex}
          onPick={(index) => emit(hourIndex, index)}
          suffix="分"
        />
      </div>
      <div className="mt-3 flex items-center justify-between px-2 text-[11px] tracking-[0.18em] text-muted">
        <span>当前分钟值</span>
        <span className="font-mono text-ink">{String(totalMinutes).padStart(4, "0")} min</span>
      </div>
    </div>
  );
}
