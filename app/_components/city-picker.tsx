"use client";

import { useMemo, useState } from "react";
import { BIRTHPLACE_PRESETS, type BirthplacePreset } from "@/lib/birth-presets";

interface CityPickerProps {
  value: string; // providerLocationId or "custom"
  onChange: (id: string) => void;
}

function groupPresets(): Array<{ code: string; label: string; items: BirthplacePreset[] }> {
  const items = BIRTHPLACE_PRESETS;
  const cn = items.filter((p) => p.countryCode === "CN");
  const hkmt = items.filter((p) => ["HK", "TW", "MO"].includes(p.countryCode));
  const asia = items.filter((p) => ["JP", "KR", "SG", "MY"].includes(p.countryCode));
  const west = items.filter((p) => ["GB", "FR", "US", "AU"].includes(p.countryCode));
  return [
    { code: "CN", label: "中国大陆", items: cn },
    { code: "HK", label: "中国港澳台", items: hkmt },
    { code: "ASIA", label: "亚洲城市", items: asia },
    { code: "WEST", label: "欧美澳", items: west },
  ];
}

export function CityPicker({ value, onChange }: CityPickerProps) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => groupPresets(), []);

  function matches(item: BirthplacePreset): boolean {
    if (!query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return (
      item.label.toLowerCase().includes(needle) ||
      (item.city.zhHans?.toLowerCase().includes(needle) ?? false) ||
      (item.city.en?.toLowerCase().includes(needle) ?? false) ||
      (item.country.zhHans?.toLowerCase().includes(needle) ?? false) ||
      (item.country.en?.toLowerCase().includes(needle) ?? false) ||
      (item.aliases ?? []).some((alias) => alias.toLowerCase().includes(needle))
    );
  }

  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter(matches) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <label className="relative block">
        <span className="sr-only">搜索城市</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索城市 · 例如 武汉 / Penang"
          className="input-base w-full pr-12"
          autoComplete="off"
          inputMode="search"
        />
        <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-muted">⌕</span>
      </label>
      <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-3xl border border-line-strong bg-canvas p-4 no-scrollbar">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">没有匹配的城市。试试切换关键字，或向下选择「其他城市」。</p>
        )}
        {filtered.map((group) => (
          <div key={group.code}>
            <p className="px-2 pb-1.5 text-[11px] font-bold tracking-[0.22em] text-muted">{group.label}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((item) => {
                const selected = value === item.providerLocationId;
                return (
                  <button
                    key={item.providerLocationId}
                    type="button"
                    onClick={() => onChange(item.providerLocationId)}
                    aria-pressed={selected}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                      selected
                        ? "border-ink-deep bg-ink-deep text-paper"
                        : "border-line bg-paper text-soft hover:border-ink-deep hover:text-ink-deep"
                    }`}
                  >
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${selected ? "bg-paper/15 text-paper" : "bg-dust text-muted"}`}>
                      {item.countryCode}
                    </span>
                    <span className="truncate">{item.city.zhHans ?? item.city.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
