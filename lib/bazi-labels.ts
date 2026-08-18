import type { FiveElement, TenGod, YinYang } from "@/types/domain";

export const ELEMENT_CHINESE: Record<FiveElement, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export const ELEMENT_FULL: Record<FiveElement, string> = {
  wood: "木 · 仁",
  fire: "火 · 礼",
  earth: "土 · 信",
  metal: "金 · 义",
  water: "水 · 智",
};

export const ELEMENT_COLOR: Record<FiveElement, string> = {
  wood: "oklch(0.58 0.13 145)",
  fire: "oklch(0.62 0.19 35)",
  earth: "oklch(0.72 0.10 75)",
  metal: "oklch(0.74 0.07 85)",
  water: "oklch(0.58 0.12 230)",
};

export const TEN_GOD_CHINESE: Record<TenGod, string> = {
  bi_jian: "比肩",
  jie_cai: "劫财",
  shi_shen: "食神",
  shang_guan: "伤官",
  pian_cai: "偏财",
  zheng_cai: "正财",
  qi_sha: "七杀",
  zheng_guan: "正官",
  pian_yin: "偏印",
  zheng_yin: "正印",
};

export const POLARITY_CHINESE: Record<YinYang, string> = {
  yang: "阳",
  yin: "阴",
};

export const PILLAR_LABEL: Record<string, string> = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

export const DAY_MASTER_STRENGTH: Record<string, { label: string; hint: string }> = {
  strong: { label: "身强", hint: "日主能量充盈，宜泄宜克" },
  balanced: { label: "中和", hint: "阴阳得配，刚柔并济" },
  weak: { label: "身弱", hint: "日主能量偏弱，宜生宜扶" },
  unknown: { label: "待定", hint: "依据现有信息暂无法判定" },
};

export const RELATION_LABEL: Record<string, string> = {
  stem_combination: "天干相合",
  branch_combination: "地支相合",
  branch_clash: "地支相冲",
  branch_harm: "地支相害",
};
