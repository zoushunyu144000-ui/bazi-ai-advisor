import type { BaziChart, BirthProfile, PersonalityProfile } from "@/types/domain";

export const mockBirthProfile: BirthProfile = {
  id: "11111111-1111-4111-8111-111111111111",
  label: "虚构测试用户",
  calendar: "gregorian",
  birthDate: "1996-03-18",
  birthTime: "09:30:00",
  birthTimePrecision: "exact",
  timezone: "Asia/Singapore",
  birthPlace: {
    label: "Singapore",
    countryCode: "SG",
    locality: "Singapore",
    coordinates: { latitude: 1.3521, longitude: 103.8198 },
  },
  sexForTraditionalRules: "unspecified",
  createdAt: "2026-08-17T00:00:00.000Z",
  updatedAt: "2026-08-17T00:00:00.000Z",
};

export const mockBaziChart: BaziChart = {
  id: "22222222-2222-4222-8222-222222222222",
  birthProfileId: mockBirthProfile.id,
  pillars: {
    year: {
      stem: "bing",
      branch: "zi",
      stemElement: "fire",
      stemPolarity: "yang",
      branchElement: "water",
      hiddenStems: [{ stem: "gui", weight: 1 }],
    },
    month: {
      stem: "xin",
      branch: "mao",
      stemElement: "metal",
      stemPolarity: "yin",
      branchElement: "wood",
      hiddenStems: [{ stem: "yi", weight: 1 }],
    },
    day: {
      stem: "jia",
      branch: "chen",
      stemElement: "wood",
      stemPolarity: "yang",
      branchElement: "earth",
      hiddenStems: [
        { stem: "wu", weight: 0.6 },
        { stem: "yi", weight: 0.25 },
        { stem: "gui", weight: 0.15 },
      ],
    },
    hour: {
      stem: "ji",
      branch: "si",
      stemElement: "earth",
      stemPolarity: "yin",
      branchElement: "fire",
      hiddenStems: [
        { stem: "bing", weight: 0.6 },
        { stem: "wu", weight: 0.25 },
        { stem: "geng", weight: 0.15 },
      ],
    },
  },
  dayMaster: { stem: "jia", element: "wood", polarity: "yang" },
  calculatedAt: "2026-08-17T00:00:00.000Z",
};

export const mockPersonalityProfile: PersonalityProfile = {
  id: "33333333-3333-4333-8333-333333333333",
  chartId: mockBaziChart.id,
  mapping_version: "personality-map/0.1.0",
  summary: "这是用于界面开发的虚构人格摘要，不代表真实命理解读。",
  dimensions: [
    {
      key: "initiative",
      label: "主动性",
      score: 72,
      confidence: 0.7,
      evidenceKeys: ["fixture-only"],
    },
    {
      key: "adaptability",
      label: "适应性",
      score: 64,
      confidence: 0.65,
      evidenceKeys: ["fixture-only"],
    },
  ],
  strengths: ["愿意主动推进事情", "面对变化时有一定调整能力"],
  growthEdges: ["重大决定前需要加入事实验证步骤"],
  behaviorSuggestions: ["将长期目标拆成每周可验证的小实验"],
  generatedAt: "2026-08-17T00:00:00.000Z",
};
