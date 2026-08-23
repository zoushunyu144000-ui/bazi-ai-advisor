import type {
  BaziPillarPosition,
  EarthlyBranch,
  HeavenlyStem,
  HiddenQiLayer,
  MonthHostKind,
  TenGod,
  TraditionalBaseMonthHost,
  TraditionalEvidenceType,
  TraditionalPattern,
  TraditionalPatternAmbiguity,
  TraditionalPatternEvidence,
  TraditionalPatternInput,
} from "../../../types/domain";
import { HIDDEN_STEMS, STEM_POLARITY } from "../constants";
import { deterministicUuid } from "../id";
import { tenGodFor } from "../rules";
import {
  JIANLU_MONTH_BRANCH_BY_STEM,
  PATTERN_SCHEMA_VERSION,
  YANGREN_BRANCH_BY_YANG_STEM,
  ZIPING_RULE_PROFILE_VERSION,
} from "./constants";
import { assertZipingRuleProfile } from "./profile-guard";

/**
 * ziping-v1.0.0 Base Month Host evaluator (docs/22 §6 / OA-04, docs/23 §13).
 *
 * MONTH_HOST_BASE =
 *   month branch → ordered hidden qi (main > middle > residual) → exposure → base Host
 *
 * Frozen constraints:
 * - `HIDDEN_STEMS` array order defines main > middle > residual. `HiddenStem.weight`
 *   is legacy engineering data and is never read here (no numeric month multiplier).
 * - Exposure checks visible YEAR / MONTH / HOUR stems only; the day stem is never
 *   an exposure position.
 * - Selection: exposed main, else exposed middle, else exposed residual, else the
 *   unexposed main qi as fallback basis. When several layers are exposed the
 *   hierarchy wins and remaining valid alternatives stay in
 *   `competingExposedPatterns`.
 * - The base Host is evidence only: this module never produces a final
 *   `primaryPattern` verdict (docs/22 §6.3). Formation / transformation /
 *   strength adjudication happens in later slices.
 */

/**
 * Deterministic result of the base Month Host slice.
 *
 * `evidence` carries the month-command selection/exposure proof chain with
 * deterministic IDs and `ZP-HOST-*` ruleIds. The shared evidence contract has no
 * numeric weight and no confidence by design.
 */
export interface BaseMonthHostEvaluation {
  /**
   * Nullable by the frozen shared contract. A null host must always be paired
   * with a material/blocking ambiguity; this slice currently uses that path
   * when the selected month-command qi is BiJian but no approved self-rooted
   * mapping applies.
   */
  host: TraditionalBaseMonthHost | null;
  evidence: TraditionalPatternEvidence[];
  ambiguities: TraditionalPatternAmbiguity[];
}

/** Module-local ZP-HOST ruleId namespace (docs/23 §25). */
const RULE_ID = {
  monthCommand: "ZP-HOST-001",
  hiddenQiMain: "ZP-HOST-010",
  hiddenQiMiddle: "ZP-HOST-011",
  hiddenQiResidual: "ZP-HOST-012",
  exposure: "ZP-HOST-020",
  unexposedMainFallback: "ZP-HOST-030",
  jianluMonthBranch: "ZP-HOST-040",
  yuejieMonthCommandPeer: "ZP-HOST-041",
  yangrenFiveYang: "ZP-HOST-042",
  competingExposure: "ZP-HOST-050",
  unresolvedPeerHost: "ZP-HOST-060",
} as const;

const LAYER_ORDER: readonly HiddenQiLayer[] = ["main", "middle", "residual"] as const;

/** Canonical hidden-qi layer index for a branch; missing middle/residual stay absent. */
function layersOfBranch(branch: EarthlyBranch): Partial<Record<HiddenQiLayer, HeavenlyStem>> {
  const ordered = HIDDEN_STEMS[branch];
  const layers: Partial<Record<HiddenQiLayer, HeavenlyStem>> = {};
  LAYER_ORDER.forEach((layer, index) => {
    const stem = ordered[index];
    if (stem) layers[layer] = stem;
  });
  return layers;
}

const HIDDEN_QI_EVIDENCE_TYPE: Record<HiddenQiLayer, TraditionalEvidenceType> = {
  main: "hidden_qi_main",
  middle: "hidden_qi_middle",
  residual: "hidden_qi_residual",
};

const HIDDEN_QI_RULE_ID: Record<HiddenQiLayer, string> = {
  main: RULE_ID.hiddenQiMain,
  middle: RULE_ID.hiddenQiMiddle,
  residual: RULE_ID.hiddenQiResidual,
};

/**
 * Visible exposure positions. The day stem is intentionally excluded:
 * 月令藏干透于年干 / 月干 / 时干 only.
 */
const EXPOSURE_PILLARS: readonly BaziPillarPosition[] = ["year", "month", "hour"] as const;

/** The eight regular patterns map 1:1 from their ten god (docs/22 §8). */
const REGULAR_PATTERN_BY_TEN_GOD: Record<
  Exclude<TenGod, "bi_jian" | "jie_cai">,
  TraditionalPattern
> = {
  shi_shen: "shi_shen",
  shang_guan: "shang_guan",
  pian_cai: "pian_cai",
  zheng_cai: "zheng_cai",
  qi_sha: "qi_sha",
  zheng_guan: "zheng_guan",
  pian_yin: "pian_yin",
  zheng_yin: "zheng_yin",
};

/**
 * Map a competing exposed qi to one of the eight regular patterns only.
 *
 * Peer exposure is deliberately NOT promoted to Yuejie here. The frozen rule
 * says Yuejie requires the month-command JieCai Host / Lu-Jie structure;
 * merely seeing BiJian/JieCai in another exposed layer is context evidence,
 * not a Yuejie candidate.
 */
function regularPatternForCompetingTenGod(tenGod: TenGod): TraditionalPattern | null {
  if (tenGod === "bi_jian" || tenGod === "jie_cai") return null;
  return REGULAR_PATTERN_BY_TEN_GOD[tenGod];
}

/**
 * Resolve the frozen Month Host kind for the selected hidden stem.
 *
 * Precedence:
 * 1. Jianlu — month branch exactly equals the Day Master's Lu position (docs/22 §9.1);
 * 2. Yangren — five yang stems only, exact branch mapping (docs/22 §10 / OA-05);
 *    yin stems have no entry in `YANGREN_BRANCH_BY_YANG_STEM` and never auto-Yangren;
 * 3. Yuejie — the selected month-command Host itself must be JieCai
 *    (docs/22 §9.2 / D-019 clarification carried into the locked profile);
 *    generic JieCai elsewhere is insufficient;
 * 4. BiJian outside exact Jianlu/Yangren has no approved V1 Pattern mapping;
 *    fail closed rather than invent Yuejie;
 * 5. otherwise map to one of the 8 regular patterns.
 */
function resolveMonthHostKind(
  dayMasterStem: HeavenlyStem,
  monthBranch: EarthlyBranch,
  selectedTenGod: TenGod,
): { hostKind: MonthHostKind; patternCandidate: TraditionalPattern } | null {
  if (JIANLU_MONTH_BRANCH_BY_STEM[dayMasterStem] === monthBranch) {
    return { hostKind: "jian_lu", patternCandidate: "jian_lu" };
  }

  const yangrenBranch = YANGREN_BRANCH_BY_YANG_STEM[dayMasterStem];
  if (STEM_POLARITY[dayMasterStem] === "yang" && yangrenBranch === monthBranch) {
    return { hostKind: "yang_ren", patternCandidate: "yang_ren" };
  }

  if (selectedTenGod === "jie_cai") {
    return { hostKind: "yue_jie", patternCandidate: "yue_jie" };
  }

  if (selectedTenGod === "bi_jian") return null;

  return { hostKind: "regular_ten_god", patternCandidate: REGULAR_PATTERN_BY_TEN_GOD[selectedTenGod] };
}

interface EvidenceDraft {
  type: TraditionalEvidenceType;
  effect: TraditionalPatternEvidence["effect"];
  source: TraditionalPatternEvidence["source"];
  target: TraditionalPatternEvidence["target"];
  ruleId: string;
  descriptionCode: string;
}

/**
 * Deterministic evidence ID input per docs/23 §17:
 * chartId + rule_profile_version + pattern_schema_version + ruleId + type +
 * structured source + structured target. No timestamp participates.
 */
function evidenceId(chartId: string, draft: EvidenceDraft): string {
  return deterministicUuid(
    JSON.stringify({
      chartId,
      rule_profile_version: ZIPING_RULE_PROFILE_VERSION,
      pattern_schema_version: PATTERN_SCHEMA_VERSION,
      ruleId: draft.ruleId,
      type: draft.type,
      effect: draft.effect,
      source: draft.source,
      target: draft.target,
      descriptionCode: draft.descriptionCode,
    }),
  );
}

function finalizeEvidence(chartId: string, drafts: EvidenceDraft[]): TraditionalPatternEvidence[] {
  return drafts.map((draft) => ({ id: evidenceId(chartId, draft), ...draft }));
}

function unresolvedPeerHostAmbiguity(
  chartId: string,
  evidenceKeys: string[],
): TraditionalPatternAmbiguity {
  const code = "insufficient_evidence" as const;
  const messageCode = "ZP_HOST_BIJIAN_NON_SELF_ROOTED_UNRESOLVED";
  return {
    id: deterministicUuid(
      JSON.stringify({
        chartId,
        rule_profile_version: ZIPING_RULE_PROFILE_VERSION,
        pattern_schema_version: PATTERN_SCHEMA_VERSION,
        code,
        severity: "blocking",
        affectedFields: ["base_month_host", "primary_pattern"],
        messageCode,
        evidenceKeys,
      }),
    ),
    code,
    severity: "blocking",
    affectedFields: ["base_month_host", "primary_pattern"],
    messageCode,
    evidenceKeys,
  };
}

/**
 * Evaluate the ziping-v1.0.0 Base Month Host for an already-calculated chart.
 *
 * Fails closed on any rule profile other than `ziping-v1.0.0`. Reads only
 * deterministic chart facts: the month branch, the canonical hidden-stem order
 * of that branch, and the visible year/month/hour stems relative to the day
 * master. Legacy derived features are never read.
 */
export function evaluateBaseMonthHost(input: TraditionalPatternInput): BaseMonthHostEvaluation {
  assertZipingRuleProfile(input.calculationMetadata);

  const chart = input.chart;
  const dayMasterStem = chart.dayMaster.stem;
  const monthPillar = chart.pillars.month;
  const monthBranch = monthPillar.branch;

  // Canonical ordering main > middle > residual comes from HIDDEN_STEMS order only.
  const hiddenByLayer = layersOfBranch(monthBranch);

  const exposureByLayer: Partial<Record<HiddenQiLayer, BaziPillarPosition[]>> = {};
  for (const layer of LAYER_ORDER) {
    const stem = hiddenByLayer[layer];
    if (!stem) continue;
    exposureByLayer[layer] = EXPOSURE_PILLARS.filter((position) => {
      if (position === "day") return false; // day stem is never an exposure position
      const pillar = chart.pillars[position];
      return pillar !== null && pillar.stem === stem;
    });
  }

  const exposedLayers = LAYER_ORDER.filter((layer) => (exposureByLayer[layer]?.length ?? 0) > 0);

  // Frozen selection tree (docs/22 §6.2): hierarchy wins among exposed layers,
  // otherwise fall back to the unexposed main qi as base Host basis.
  const fallbackLayer: HiddenQiLayer = "main";
  const selectedLayer: HiddenQiLayer = exposedLayers[0] ?? fallbackLayer;
  const selectedStem = hiddenByLayer[selectedLayer];
  if (!selectedStem) {
    throw new Error(`Month branch ${monthBranch} exposes no hidden stem under ziping-v1.0.0`);
  }
  const exposureState = exposedLayers.length > 0 ? "exposed" : "unexposed_main_fallback";
  const exposurePillars: BaziPillarPosition[] = [...(exposureByLayer[selectedLayer] ?? [])];

  const selectedTenGod = tenGodFor(dayMasterStem, selectedStem);
  const resolvedHost = resolveMonthHostKind(dayMasterStem, monthBranch, selectedTenGod);

  // A non-self-rooted BiJian month-command selection has no approved V1 pattern
  // mapping. Do not coerce it to Yuejie; preserve deterministic evidence and
  // fail closed with a blocking ambiguity instead.
  if (resolvedHost === null) {
    const unresolvedDrafts: EvidenceDraft[] = [
      {
        type: "month_command",
        effect: "context",
        source: { branch: monthBranch },
        target: {},
        ruleId: RULE_ID.monthCommand,
        descriptionCode: "ZP_HOST_MONTH_COMMAND_BASE_UNRESOLVED_PEER",
      },
      {
        type: HIDDEN_QI_EVIDENCE_TYPE[selectedLayer],
        effect: "context",
        source: {
          pillar: "month",
          stem: selectedStem,
          branch: monthBranch,
          hiddenQiLayer: selectedLayer,
        },
        target: {},
        ruleId: RULE_ID.unresolvedPeerHost,
        descriptionCode: "ZP_HOST_BIJIAN_NON_SELF_ROOTED_UNRESOLVED",
      },
    ];

    for (const pillar of exposurePillars) {
      unresolvedDrafts.push({
        type: "visible_stem",
        effect: "context",
        source: { pillar, stem: selectedStem },
        target: {},
        ruleId: RULE_ID.unresolvedPeerHost,
        descriptionCode: "ZP_HOST_BIJIAN_VISIBLE_WITHOUT_APPROVED_HOST_MAPPING",
      });
    }

    const evidence = finalizeEvidence(chart.id, unresolvedDrafts);
    const ambiguity = unresolvedPeerHostAmbiguity(
      chart.id,
      evidence.map((item) => item.id),
    );
    return { host: null, evidence, ambiguities: [ambiguity] };
  }

  const { hostKind, patternCandidate } = resolvedHost;

  // Remaining exposed regular alternatives keep competing; peer exposure stays
  // context-only and may not manufacture Jianlu/Yuejie/Yangren.
  const competingExposedPatterns: TraditionalPattern[] = [];
  for (const layer of exposedLayers) {
    if (layer === selectedLayer) continue;
    const stem = hiddenByLayer[layer]!;
    const pattern = regularPatternForCompetingTenGod(tenGodFor(dayMasterStem, stem));
    if (pattern && pattern !== patternCandidate && !competingExposedPatterns.includes(pattern)) {
      competingExposedPatterns.push(pattern);
    }
  }

  const drafts: EvidenceDraft[] = [];

  drafts.push({
    type: "month_command",
    effect: "establishes",
    source: { branch: monthBranch },
    target: { pattern: patternCandidate },
    ruleId: RULE_ID.monthCommand,
    descriptionCode: "ZP_HOST_MONTH_COMMAND_BASE",
  });

  drafts.push({
    type: HIDDEN_QI_EVIDENCE_TYPE[selectedLayer],
    effect: exposureState === "exposed" ? "establishes" : "supports",
    source: { pillar: "month", stem: selectedStem, branch: monthBranch, hiddenQiLayer: selectedLayer },
    target: { pattern: patternCandidate },
    ruleId: HIDDEN_QI_RULE_ID[selectedLayer],
    descriptionCode:
      exposureState === "exposed"
        ? "ZP_HOST_SELECTED_HIDDEN_QI_EXPOSED"
        : "ZP_HOST_SELECTED_HIDDEN_QI_UNEXPOSED_MAIN_FALLBACK",
  });

  for (const pillar of exposurePillars) {
    drafts.push({
      type: "visible_stem",
      effect: "establishes",
      source: { pillar, stem: selectedStem },
      target: { pattern: patternCandidate },
      ruleId: RULE_ID.exposure,
      descriptionCode: "ZP_HOST_HIDDEN_STEM_EXPOSED_ON_VISIBLE_PILLAR",
    });
  }

  if (exposureState === "unexposed_main_fallback") {
    drafts.push({
      type: HIDDEN_QI_EVIDENCE_TYPE.main,
      effect: "supports",
      source: { pillar: "month", stem: selectedStem, branch: monthBranch, hiddenQiLayer: "main" },
      target: { pattern: patternCandidate },
      ruleId: RULE_ID.unexposedMainFallback,
      descriptionCode: "ZP_HOST_UNEXPOSED_MAIN_FALLBACK_BASIS",
    });
  }

  if (hostKind === "jian_lu") {
    drafts.push({
      type: "month_command",
      effect: "establishes",
      source: { stem: dayMasterStem, branch: monthBranch },
      target: { pattern: "jian_lu" },
      ruleId: RULE_ID.jianluMonthBranch,
      descriptionCode: "ZP_HOST_JIANLU_MONTH_BRANCH_EQUALS_LU_POSITION",
    });
  }

  if (hostKind === "yang_ren") {
    drafts.push({
      type: "month_command",
      effect: "establishes",
      source: { stem: dayMasterStem, branch: monthBranch },
      target: { pattern: "yang_ren" },
      ruleId: RULE_ID.yangrenFiveYang,
      descriptionCode: "ZP_HOST_YANGREN_FIVE_YANG_STEM_MAPPING",
    });
  }

  if (hostKind === "yue_jie") {
    drafts.push({
      type: "month_command",
      effect: "establishes",
      source: { pillar: "month", stem: selectedStem, branch: monthBranch },
      target: { pattern: "yue_jie" },
      ruleId: RULE_ID.yuejieMonthCommandPeer,
      descriptionCode: "ZP_HOST_YUEJIE_MONTH_COMMAND_PEER_HOST",
    });
  }

  for (const layer of exposedLayers) {
    if (layer === selectedLayer) continue;
    const stem = hiddenByLayer[layer]!;
    const pattern = regularPatternForCompetingTenGod(tenGodFor(dayMasterStem, stem));
    // One evidence entry per competing exposed layer. Peer layers remain
    // context-only with an empty target rather than being coerced to Yuejie.
    drafts.push({
      type: "visible_stem",
      effect: "context",
      source: { pillar: exposureByLayer[layer]![0], stem, hiddenQiLayer: layer },
      target: pattern ? { pattern } : {},
      ruleId: RULE_ID.competingExposure,
      descriptionCode: pattern
        ? "ZP_HOST_COMPETING_EXPOSED_ALTERNATIVE"
        : "ZP_HOST_COMPETING_EXPOSED_PEER_CONTEXT",
    });
  }

  const evidence = finalizeEvidence(chart.id, drafts);

  const host: TraditionalBaseMonthHost = {
    monthBranch,
    hostKind,
    patternCandidate,
    selectedStem,
    selectedTenGod,
    selectedLayer,
    exposureState,
    exposurePillars,
    competingExposedPatterns,
    evidenceKeys: evidence.map((item) => item.id),
    ambiguityKeys: [],
  };

  return { host, evidence, ambiguities: [] };
}
