import type { TenGod } from "@/types/domain";

/**
 * Personality accent palette — V1 Mobile UI Pilot.
 *
 * Maps each locked 10-IP Public Personality to its editorial accent.
 * Tones are intentionally low-saturation, ink-press friendly, and tuned to
 * stay legible on cool-white backgrounds. They must read as "a single editorial
 * brand system" when shown side by side (do NOT pick brighter / louder
 * alternatives without re-doing the 10-way side-by-side check).
 *
 * Source-of-truth alignment: docs/16_CHARACTER_BATCH_PRODUCTION_V1.md §4.
 */
export interface PersonalityAccent {
  ink: string;
  soft: string;
  paper: string;
  hairline: string;
}

export const PERSONALITY_ACCENT: Record<TenGod, PersonalityAccent> = {
  bi_jian:    { ink: "oklch(0.50 0.16 28)",  soft: "oklch(0.94 0.04 28)",  paper: "oklch(0.97 0.02 28)",  hairline: "oklch(0.84 0.06 28)"  }, // Brick Red  · 犟种
  jie_cai:    { ink: "oklch(0.62 0.14 55)",  soft: "oklch(0.95 0.04 55)",  paper: "oklch(0.97 0.025 55)", hairline: "oklch(0.86 0.06 55)"  }, // Muted Orange · 撒币
  shi_shen:   { ink: "oklch(0.60 0.13 85)",  soft: "oklch(0.96 0.05 85)",  paper: "oklch(0.98 0.03 85)",  hairline: "oklch(0.87 0.06 85)"  }, // Mustard · 享乐主义
  shang_guan: { ink: "oklch(0.46 0.14 252)", soft: "oklch(0.94 0.04 252)", paper: "oklch(0.97 0.02 252)", hairline: "oklch(0.85 0.06 252)" }, // Cobalt Blue · 天生反骨
  zheng_cai:  { ink: "oklch(0.50 0.08 158)", soft: "oklch(0.94 0.03 158)", paper: "oklch(0.97 0.02 158)", hairline: "oklch(0.84 0.04 158)" }, // Sage Green · 抠抠搜搜
  pian_cai:   { ink: "oklch(0.50 0.10 198)", soft: "oklch(0.94 0.03 198)", paper: "oklch(0.97 0.02 198)", hairline: "oklch(0.84 0.04 198)" }, // Teal · 搞钱圣体
  zheng_guan: { ink: "oklch(0.38 0.10 252)", soft: "oklch(0.94 0.03 252)", paper: "oklch(0.96 0.02 252)", hairline: "oklch(0.84 0.04 252)" }, // Navy · 老干部
  qi_sha:     { ink: "oklch(0.45 0.13 18)",  soft: "oklch(0.94 0.04 18)",  paper: "oklch(0.97 0.02 18)",  hairline: "oklch(0.84 0.06 18)"  }, // Deep Maroon · 狠人
  zheng_yin:  { ink: "oklch(0.60 0.10 6)",   soft: "oklch(0.95 0.03 6)",   paper: "oklch(0.97 0.02 6)",   hairline: "oklch(0.86 0.04 6)"   }, // Dusty Pink · 活菩萨
  pian_yin:   { ink: "oklch(0.52 0.10 308)", soft: "oklch(0.94 0.03 308)", paper: "oklch(0.97 0.02 308)", hairline: "oklch(0.84 0.04 308)" }, // Muted Purple · 道长
};

export function accentFor(tenGod: TenGod): PersonalityAccent {
  return PERSONALITY_ACCENT[tenGod];
}

/**
 * Returns the style variable strings for an accent, usable as inline CSS
 * `style` values. This keeps the slot/pill components free of Tailwind
 * color utilities that would otherwise need a runtime theme extension per
 * personality.
 */
export function accentStyle(tenGod: TenGod): React.CSSProperties {
  const accent = accentFor(tenGod);
  return {
    "--p-ink": accent.ink,
    "--p-soft": accent.soft,
    "--p-paper": accent.paper,
    "--p-hairline": accent.hairline,
  } as React.CSSProperties;
}
