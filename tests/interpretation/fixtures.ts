import type { BaziChart } from "@/types/domain";

export const knownHourChart: BaziChart = {
  id: "22222222-2222-4222-8222-222222222222",
  birthProfileId: "11111111-1111-4111-8111-111111111111",
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

export const unknownHourChart: BaziChart = {
  ...knownHourChart,
  id: "44444444-4444-4444-8444-444444444444",
  pillars: { ...knownHourChart.pillars, hour: null },
};

export const authorityHeavyChart: BaziChart = {
  id: "55555555-5555-4555-8555-555555555555",
  birthProfileId: "66666666-6666-4666-8666-666666666666",
  pillars: {
    year: {
      stem: "geng",
      branch: "shen",
      stemElement: "metal",
      stemPolarity: "yang",
      branchElement: "metal",
      hiddenStems: [
        { stem: "geng", weight: 0.6 },
        { stem: "ren", weight: 0.25 },
        { stem: "wu", weight: 0.15 },
      ],
    },
    month: {
      stem: "xin",
      branch: "you",
      stemElement: "metal",
      stemPolarity: "yin",
      branchElement: "metal",
      hiddenStems: [{ stem: "xin", weight: 1 }],
    },
    day: {
      stem: "jia",
      branch: "xu",
      stemElement: "wood",
      stemPolarity: "yang",
      branchElement: "earth",
      hiddenStems: [
        { stem: "wu", weight: 0.6 },
        { stem: "xin", weight: 0.25 },
        { stem: "ding", weight: 0.15 },
      ],
    },
    hour: {
      stem: "geng",
      branch: "shen",
      stemElement: "metal",
      stemPolarity: "yang",
      branchElement: "metal",
      hiddenStems: [
        { stem: "geng", weight: 0.6 },
        { stem: "ren", weight: 0.25 },
        { stem: "wu", weight: 0.15 },
      ],
    },
  },
  dayMaster: { stem: "jia", element: "wood", polarity: "yang" },
  calculatedAt: "2026-08-17T00:00:00.000Z",
};
