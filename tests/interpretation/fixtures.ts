import type { BaziChart, BaziDerivedFeatures, FiveElement, TenGod } from "../../types/domain";

export const canonicalChart: BaziChart = {
  id: "22222222-2222-4222-8222-222222222222",
  birthProfileId: "11111111-1111-4111-8111-111111111111",
  pillars: {
    year: { stem: "bing", branch: "zi", stemElement: "fire", stemPolarity: "yang", branchElement: "water", hiddenStems: [] },
    month: { stem: "xin", branch: "mao", stemElement: "metal", stemPolarity: "yin", branchElement: "wood", hiddenStems: [] },
    day: { stem: "jia", branch: "chen", stemElement: "wood", stemPolarity: "yang", branchElement: "earth", hiddenStems: [] },
    hour: { stem: "ji", branch: "si", stemElement: "earth", stemPolarity: "yin", branchElement: "fire", hiddenStems: [] },
  },
  dayMaster: { stem: "jia", element: "wood", polarity: "yang" },
  calculatedAt: "2026-08-18T00:00:00.000Z",
};

export const canonicalDerived: BaziDerivedFeatures = {
  id: "44444444-4444-4444-8444-444444444444",
  chartId: canonicalChart.id,
  engine_version: "bazi-engine/0.2.0",
  rule_profile_version: "civil-local-jieqi-v1",
  mapping_version: "bazi-derived/0.2.0",
  dayMasterStrength: "balanced",
  elementDistribution: [
    { element: "wood", score: 28 }, { element: "fire", score: 22 }, { element: "earth", score: 20 },
    { element: "metal", score: 16 }, { element: "water", score: 14 },
  ],
  tenGodDistribution: [
    { tenGod: "bi_jian", score: 13 }, { tenGod: "jie_cai", score: 8 }, { tenGod: "shi_shen", score: 14 },
    { tenGod: "shang_guan", score: 18 }, { tenGod: "pian_cai", score: 11 }, { tenGod: "zheng_cai", score: 9 },
    { tenGod: "qi_sha", score: 8 }, { tenGod: "zheng_guan", score: 6 }, { tenGod: "pian_yin", score: 7 }, { tenGod: "zheng_yin", score: 6 },
  ],
  seasonalContext: "canonical-fixture",
  structuralTags: ["fixture"],
  confidence: 0.88,
  derivedAt: "2026-08-18T00:00:00.000Z",
};

export const unknownHourChart: BaziChart = {
  ...canonicalChart,
  id: "55555555-5555-4555-8555-555555555555",
  pillars: { ...canonicalChart.pillars, hour: null },
};

export const unknownHourDerived: BaziDerivedFeatures = {
  ...canonicalDerived,
  id: "66666666-6666-4666-8666-666666666666",
  chartId: unknownHourChart.id,
  confidence: 0.68,
};

const TEN_GODS: TenGod[] = ["bi_jian", "jie_cai", "shi_shen", "shang_guan", "pian_cai", "zheng_cai", "qi_sha", "zheng_guan", "pian_yin", "zheng_yin"];
const ELEMENTS: FiveElement[] = ["wood", "fire", "earth", "metal", "water"];

export function dominantTenGodFixture(tenGod: TenGod): BaziDerivedFeatures {
  const remainder = 36 / (TEN_GODS.length - 1);
  return {
    ...canonicalDerived,
    id: `fixture-${tenGod}`,
    tenGodDistribution: TEN_GODS.map((item) => ({ tenGod: item, score: item === tenGod ? 64 : remainder })),
  };
}

export function withElementDistribution(scores: number[]): BaziDerivedFeatures {
  return {
    ...canonicalDerived,
    elementDistribution: ELEMENTS.map((element, index) => ({ element, score: scores[index] ?? 0 })),
  };
}
