import type { EarthlyBranch, HeavenlyStem } from "../../../types/domain";

export const ZIPING_RULE_PROFILE_VERSION = "ziping-v1.0.0" as const;
export const PATTERN_SCHEMA_VERSION = "traditional-pattern-result/1.0.0" as const;

/**
 * ziping-v1.0.0 Jianlu frozen mappings (docs/22 §9.1).
 *
 * JIAN_LU = month branch exactly equals the Day Master's Lu position.
 * 比肩出现 != 建禄; 比肩数量最大 != 建禄.
 * 甲寅 乙卯 丙巳 丁午 戊巳 己午 庚申 辛酉 壬亥 癸子
 */
export const JIANLU_MONTH_BRANCH_BY_STEM: Record<HeavenlyStem, EarthlyBranch> = {
  jia: "yin",
  yi: "mao",
  bing: "si",
  ding: "wu",
  wu: "si",
  ji: "wu",
  geng: "shen",
  xin: "you",
  ren: "hai",
  gui: "zi",
};

/**
 * ziping-v1.0.0 Yangren frozen mappings (docs/22 §10 / OA-05).
 *
 * YANGREN = FIVE_YANG_STEMS_ONLY. 五阴干不自动论"真阳刃".
 * The table intentionally contains only yang stems; yin stems have no entry,
 * so a yin day master can never auto-Yangren.
 * 甲→卯 丙→午 戊→午 庚→酉 壬→子
 */
export const YANGREN_BRANCH_BY_YANG_STEM: Partial<Record<HeavenlyStem, EarthlyBranch>> = {
  jia: "mao",
  bing: "wu",
  wu: "wu",
  geng: "you",
  ren: "zi",
};
