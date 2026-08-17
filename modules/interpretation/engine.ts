import type {
  BaziCalculationMetadata,
  BaziChart,
  BaziDerivedFeatures,
  BaziPillar,
  FiveElement,
  HeavenlyStem,
  PersonalityProfile,
  TenGod,
  YinYang,
} from "@/types/domain";

export const INTERPRETATION_MAPPING_VERSION = "personality-map/0.1.0";
export const INTERPRETATION_RULE_PROFILE_VERSION = "interpretation-rules/0.1.0";
const UNKNOWN_ENGINE_VERSION = "bazi-engine/unknown";

export type PersonalityDimensionKey =
  | "autonomy"
  | "structure_need"
  | "expression_drive"
  | "risk_tolerance"
  | "emotional_sensitivity"
  | "social_adaptation"
  | "competition_drive"
  | "novelty_seeking"
  | "decision_speed"
  | "control_need"
  | "planning_orientation"
  | "conflict_style"
  | "external_validation_need"
  | "energy_variability"
  | "learning_orientation";

export interface InterpretationOptions {
  sourceMetadata?: Pick<BaziCalculationMetadata, "engine_version" | "rule_profile_version">;
}

export interface DerivedFeatureSignals {
  dayMasterElement: FiveElement;
  visibleYangRatio: number;
  elementBalance: number;
  tenGodConcentration: number;
  hourKnown: boolean;
}

export interface InterpretationDerivedFeatures extends BaziDerivedFeatures {
  signals: DerivedFeatureSignals;
}

export type ContributorDirection = "increase" | "decrease" | "neutral";

export interface DimensionContributor {
  code: string;
  factor: string;
  signal: number;
  weight: number;
  contribution: number;
  direction: ContributorDirection;
  observed: number | string;
}

export interface PersonalityDimensionDetail {
  key: PersonalityDimensionKey;
  label: string;
  score: number;
  confidence: number;
  contributors: DimensionContributor[];
  positiveExpression: string;
  stressExpression: string;
  explanationCodes: string[];
}

export interface InterpretationResult {
  derivedFeatures: InterpretationDerivedFeatures;
  profile: PersonalityProfile;
  dimensionDetails: PersonalityDimensionDetail[];
  mapping_version: string;
}

type StemMeta = { element: FiveElement; polarity: YinYang };

type FactorKey =
  | `ten_god:${TenGod}`
  | `element:${FiveElement}`
  | "day_master_strength"
  | "element_balance"
  | "ten_god_concentration"
  | "visible_yang_ratio";

interface FactorRule {
  factor: FactorKey;
  weight: number;
  code: string;
}

interface DimensionDefinition {
  key: PersonalityDimensionKey;
  label: string;
  rules: FactorRule[];
  highPositive: string;
  highStress: string;
  highSuggestion: string;
  lowPositive: string;
  lowStress: string;
  lowSuggestion: string;
}

interface MappingContext {
  features: InterpretationDerivedFeatures;
  elementShares: Record<FiveElement, number>;
  tenGodShares: Record<TenGod, number>;
}

const FIVE_ELEMENTS: FiveElement[] = ["wood", "fire", "earth", "metal", "water"];
const TEN_GODS: TenGod[] = [
  "bi_jian",
  "jie_cai",
  "shi_shen",
  "shang_guan",
  "pian_cai",
  "zheng_cai",
  "qi_sha",
  "zheng_guan",
  "pian_yin",
  "zheng_yin",
];

const STEM_META: Record<HeavenlyStem, StemMeta> = {
  jia: { element: "wood", polarity: "yang" },
  yi: { element: "wood", polarity: "yin" },
  bing: { element: "fire", polarity: "yang" },
  ding: { element: "fire", polarity: "yin" },
  wu: { element: "earth", polarity: "yang" },
  ji: { element: "earth", polarity: "yin" },
  geng: { element: "metal", polarity: "yang" },
  xin: { element: "metal", polarity: "yin" },
  ren: { element: "water", polarity: "yang" },
  gui: { element: "water", polarity: "yin" },
};

const GENERATES: Record<FiveElement, FiveElement> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const GENERATED_BY: Record<FiveElement, FiveElement> = {
  wood: "water",
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
};

const CONTROLS: Record<FiveElement, FiveElement> = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire",
};

const CONTROLLED_BY: Record<FiveElement, FiveElement> = {
  wood: "metal",
  fire: "water",
  earth: "wood",
  metal: "fire",
  water: "earth",
};

const PILLAR_WEIGHT = {
  year: 0.85,
  month: 1.25,
  day: 1,
  hour: 0.9,
} as const;

const DIMENSIONS: DimensionDefinition[] = [
  {
    key: "autonomy",
    label: "自主性",
    rules: [
      rule("ten_god:bi_jian", 9, "autonomy.peer_self_drive"),
      rule("ten_god:jie_cai", 8, "autonomy.peer_competition"),
      rule("ten_god:shang_guan", 7, "autonomy.output_nonconformity"),
      rule("ten_god:zheng_guan", -7, "autonomy.formal_constraint"),
      rule("ten_god:zheng_yin", -4, "autonomy.receiving_structure"),
      rule("visible_yang_ratio", 3, "autonomy.visible_yang"),
    ],
    highPositive: "更容易依靠自己的判断启动行动，并保留独立选择空间。",
    highStress: "压力下可能过早拒绝外部约束，把协作要求体验为限制。",
    highSuggestion: "重大决定保留独立判断，同时固定加入一次外部事实校验。",
    lowPositive: "更愿意参考规则、关系与外部信息后再行动，协作成本通常较低。",
    lowStress: "压力下可能过度等待许可或共识，降低自主推进速度。",
    lowSuggestion: "为可逆的小事设定无需请示的自主决策范围。",
  },
  {
    key: "structure_need",
    label: "结构需求",
    rules: [
      rule("ten_god:zheng_guan", 10, "structure.formal_order"),
      rule("ten_god:zheng_yin", 8, "structure.internal_framework"),
      rule("element:earth", 5, "structure.earth_stability"),
      rule("element:metal", 4, "structure.metal_boundaries"),
      rule("ten_god:shang_guan", -7, "structure.output_flexibility"),
      rule("ten_god:pian_cai", -3, "structure.opportunity_response"),
    ],
    highPositive: "在目标、规则和步骤清晰时更容易稳定发挥。",
    highStress: "环境模糊或规则频繁变化时，可能把精力耗在重新建立秩序上。",
    highSuggestion: "先定义最低必要规则，再允许执行阶段保留弹性。",
    lowPositive: "面对开放情境时较能边做边调整，不需要过度依赖固定流程。",
    lowStress: "压力下可能低估流程、复盘和长期一致性的价值。",
    lowSuggestion: "对重复出现的任务建立少量固定检查点，而不是完整僵化流程。",
  },
  {
    key: "expression_drive",
    label: "表达驱动力",
    rules: [
      rule("ten_god:shi_shen", 10, "expression.generative_output"),
      rule("ten_god:shang_guan", 12, "expression.assertive_output"),
      rule("element:fire", 6, "expression.fire_visibility"),
      rule("visible_yang_ratio", 3, "expression.visible_yang"),
      rule("ten_god:zheng_yin", -4, "expression.reflective_intake"),
      rule("element:water", -2, "expression.water_inwardness"),
    ],
    highPositive: "更容易把想法转化为语言、作品或可见行动。",
    highStress: "压力下可能为了表达完整或即时而忽略接收方节奏。",
    highSuggestion: "重要表达先明确目的，再决定是输出、提问还是暂缓。",
    lowPositive: "更倾向先观察和内化，输出前通常会做更多筛选。",
    lowStress: "压力下可能把有价值的观点留在内部，导致他人难以理解需求。",
    lowSuggestion: "为关键关系和项目设置固定的低成本表达窗口。",
  },
  {
    key: "risk_tolerance",
    label: "风险容忍",
    rules: [
      rule("ten_god:jie_cai", 7, "risk.competitive_exposure"),
      rule("ten_god:shang_guan", 7, "risk.rule_experiment"),
      rule("ten_god:pian_cai", 8, "risk.opportunity_bias"),
      rule("element:fire", 5, "risk.fire_activation"),
      rule("visible_yang_ratio", 4, "risk.visible_yang"),
      rule("ten_god:zheng_guan", -6, "risk.constraint_awareness"),
      rule("ten_god:zheng_yin", -4, "risk.information_buffer"),
    ],
    highPositive: "面对不确定机会时更愿意通过行动获取信息。",
    highStress: "压力下可能高估可逆性，低估尾部风险或退出成本。",
    highSuggestion: "把风险拆成可逆与不可逆两类，只在可逆部分提高试错速度。",
    lowPositive: "更重视可控性与信息充分度，能减少不必要的暴露。",
    lowStress: "压力下可能因为追求确定性而错过时间敏感的机会。",
    lowSuggestion: "为低成本机会预设一个最低信息阈值，达到后就执行小规模试验。",
  },
  {
    key: "emotional_sensitivity",
    label: "情绪敏感度",
    rules: [
      rule("ten_god:zheng_yin", 7, "sensitivity.receptive_processing"),
      rule("ten_god:pian_yin", 10, "sensitivity.subtle_patterning"),
      rule("element:water", 8, "sensitivity.water_receptivity"),
      rule("element:wood", 3, "sensitivity.wood_responsiveness"),
      rule("element:metal", -3, "sensitivity.metal_filtering"),
      rule("day_master_strength", -2, "sensitivity.strength_buffer"),
    ],
    highPositive: "更容易捕捉情境、关系和细微信号的变化。",
    highStress: "压力下可能把过多微弱信号都当成需要处理的信息。",
    highSuggestion: "区分“我感受到的变化”和“已有事实证据的变化”，分别记录。",
    lowPositive: "较不容易被细微信号持续牵动，执行时更能维持注意力。",
    lowStress: "压力下可能较晚察觉关系氛围或自身情绪已经变化。",
    lowSuggestion: "在高强度阶段固定做简短身体与情绪扫描，补足延迟察觉。",
  },
  {
    key: "social_adaptation",
    label: "社会适应",
    rules: [
      rule("ten_god:zheng_cai", 7, "adaptation.practical_exchange"),
      rule("ten_god:zheng_guan", 7, "adaptation.rule_reading"),
      rule("ten_god:shi_shen", 6, "adaptation.low_friction_output"),
      rule("element:earth", 4, "adaptation.earth_grounding"),
      rule("element_balance", 6, "adaptation.element_balance"),
      rule("ten_god:jie_cai", -4, "adaptation.peer_friction"),
    ],
    highPositive: "更容易读取情境要求并调整表达与行为方式。",
    highStress: "压力下可能为了维持适配而延后表达真实偏好。",
    highSuggestion: "区分“必要适配”和“核心边界”，避免两者混在一起。",
    lowPositive: "更能维持一致的个人风格，不容易被环境完全塑形。",
    lowStress: "压力下可能低估情境规则与他人预期对结果的影响。",
    lowSuggestion: "进入新环境时先识别三条隐性规则，再决定哪些需要遵守。",
  },
  {
    key: "competition_drive",
    label: "竞争驱动力",
    rules: [
      rule("ten_god:bi_jian", 8, "competition.self_comparison"),
      rule("ten_god:jie_cai", 11, "competition.peer_contest"),
      rule("ten_god:qi_sha", 9, "competition.pressure_response"),
      rule("visible_yang_ratio", 4, "competition.visible_yang"),
      rule("element:metal", 3, "competition.metal_edge"),
      rule("ten_god:zheng_yin", -3, "competition.reflective_delay"),
    ],
    highPositive: "在存在明确对手、标准或挑战时更容易被激活。",
    highStress: "压力下可能把本可协作的问题过度转化为输赢比较。",
    highSuggestion: "把竞争目标绑定到可量化能力提升，而不是只绑定排名。",
    lowPositive: "较能在非竞争环境中保持节奏，合作时不容易被输赢牵动。",
    lowStress: "压力下可能缺少短期冲刺所需的外部激活。",
    lowSuggestion: "需要冲刺时使用清晰期限和可见进度，而不必制造人际竞争。",
  },
  {
    key: "novelty_seeking",
    label: "新奇探索",
    rules: [
      rule("ten_god:shang_guan", 10, "novelty.rule_departure"),
      rule("ten_god:pian_yin", 7, "novelty.unusual_patterns"),
      rule("ten_god:pian_cai", 7, "novelty.opportunity_scan"),
      rule("element:fire", 4, "novelty.fire_activation"),
      rule("element:wood", 4, "novelty.wood_growth"),
      rule("ten_god:zheng_guan", -6, "novelty.formal_consistency"),
      rule("element:earth", -3, "novelty.earth_stability"),
    ],
    highPositive: "更容易被新方法、新环境和未验证的可能性吸引。",
    highStress: "压力下可能通过不断换方向来逃避无聊但必要的重复。",
    highSuggestion: "把探索预算化：保留固定比例试新，其余部分继续复利旧方法。",
    lowPositive: "更愿意在熟悉路径上持续优化，容易形成稳定复利。",
    lowStress: "压力下可能把“熟悉”误当成“最优”，延迟必要变化。",
    lowSuggestion: "定期安排低成本替代方案测试，而不是等到旧路径失效才改变。",
  },
  {
    key: "decision_speed",
    label: "决策速度",
    rules: [
      rule("ten_god:qi_sha", 8, "decision.pressure_action"),
      rule("ten_god:bi_jian", 6, "decision.self_reference"),
      rule("element:fire", 6, "decision.fire_activation"),
      rule("visible_yang_ratio", 6, "decision.visible_yang"),
      rule("day_master_strength", 4, "decision.strength_commitment"),
      rule("ten_god:zheng_yin", -6, "decision.information_processing"),
      rule("element:water", -3, "decision.water_reflection"),
    ],
    highPositive: "信息达到可行动阈值后更容易快速做出选择。",
    highStress: "压力下可能把“需要行动”误判成“需要立刻定论”。",
    highSuggestion: "不可逆决定强制加入冷却期，可逆决定维持快节奏。",
    lowPositive: "重要决定前更愿意增加观察和比较，能降低草率承诺。",
    lowStress: "压力下可能持续追加信息，形成决策拖延。",
    lowSuggestion: "预先定义停止搜集信息的条件和最晚决策时间。",
  },
  {
    key: "control_need",
    label: "控制需求",
    rules: [
      rule("ten_god:zheng_guan", 8, "control.formal_order"),
      rule("ten_god:qi_sha", 7, "control.pressure_management"),
      rule("ten_god:zheng_cai", 6, "control.resource_accounting"),
      rule("element:metal", 5, "control.metal_boundaries"),
      rule("element:earth", 4, "control.earth_stability"),
      rule("day_master_strength", 4, "control.strength_agency"),
      rule("ten_god:shi_shen", -3, "control.open_expression"),
    ],
    highPositive: "更愿意明确责任、边界与可控变量，复杂任务中容易建立秩序。",
    highStress: "压力下可能把不可控问题也纳入个人管理范围，增加紧张和摩擦。",
    highSuggestion: "把问题分成可控、可影响、不可控三层，只对第一层设硬目标。",
    lowPositive: "更能容忍他人以不同方式完成任务，不必事事掌握在手。",
    lowStress: "压力下可能对关键细节跟进不足，过度依赖环境自行收敛。",
    lowSuggestion: "只对高后果事项设置控制点，其他事项保持授权。",
  },
  {
    key: "planning_orientation",
    label: "规划倾向",
    rules: [
      rule("ten_god:zheng_yin", 9, "planning.framework_before_action"),
      rule("ten_god:zheng_guan", 9, "planning.sequence_order"),
      rule("ten_god:zheng_cai", 6, "planning.resource_tracking"),
      rule("element:earth", 6, "planning.earth_continuity"),
      rule("element:metal", 3, "planning.metal_structure"),
      rule("ten_god:pian_cai", -4, "planning.opportunity_shift"),
      rule("ten_god:shang_guan", -5, "planning.improvised_output"),
    ],
    highPositive: "更容易通过提前排序、资源配置和步骤设计降低执行摩擦。",
    highStress: "压力下可能在计划质量上投入过多，挤压真正执行时间。",
    highSuggestion: "计划只写到下一次可验证节点，不为远期不确定性过度细化。",
    lowPositive: "更擅长利用实时反馈调整路径，不容易被原计划锁死。",
    lowStress: "压力下可能连续临场反应，导致长期任务缺少累计效应。",
    lowSuggestion: "至少固定目标、截止时间和下一步，其他部分允许动态变化。",
  },
  {
    key: "conflict_style",
    label: "冲突直接度",
    rules: [
      rule("ten_god:qi_sha", 10, "conflict.pressure_directness"),
      rule("ten_god:shang_guan", 8, "conflict.verbal_challenge"),
      rule("ten_god:jie_cai", 7, "conflict.peer_assertion"),
      rule("element:metal", 4, "conflict.metal_boundary"),
      rule("visible_yang_ratio", 5, "conflict.visible_yang"),
      rule("ten_god:zheng_yin", -4, "conflict.reflective_buffer"),
      rule("ten_god:zheng_guan", -2, "conflict.formal_mediation"),
    ],
    highPositive: "边界受挑战时更容易直接指出问题并进入处理。",
    highStress: "压力下可能过快进入对抗语言，让问题升级成人际防御。",
    highSuggestion: "冲突开始时先描述事实与影响，再提出边界或请求。",
    lowPositive: "更倾向缓冲、观察或通过规则与关系间接处理冲突。",
    lowStress: "压力下可能回避必要对话，使小问题累积成更大摩擦。",
    lowSuggestion: "为反复出现的问题设定明确触发点，达到后必须进行直接沟通。",
  },
  {
    key: "external_validation_need",
    label: "外部认可需求",
    rules: [
      rule("ten_god:zheng_guan", 8, "validation.standard_reference"),
      rule("ten_god:zheng_cai", 5, "validation.practical_feedback"),
      rule("ten_god:zheng_yin", 5, "validation.trusted_framework"),
      rule("element:earth", 3, "validation.social_stability"),
      rule("ten_god:bi_jian", -7, "validation.self_reference"),
      rule("ten_god:shang_guan", -6, "validation.independent_expression"),
      rule("day_master_strength", -4, "validation.strength_self_anchor"),
    ],
    highPositive: "更会利用明确标准、可信反馈和社会信号校准行为。",
    highStress: "压力下可能把短期评价当成自我价值的主要证据。",
    highSuggestion: "把反馈分为事实、偏好和地位信号，只让事实进入核心决策。",
    lowPositive: "更能依靠内部标准维持方向，不容易被即时评价打断。",
    lowStress: "压力下可能低估外部反馈中真实存在的盲点。",
    lowSuggestion: "为关键项目固定选择少量可信反馈源，而不是完全闭环自评。",
  },
  {
    key: "energy_variability",
    label: "能量波动性",
    rules: [
      rule("ten_god:shang_guan", 6, "energy.output_spikes"),
      rule("ten_god:pian_yin", 8, "energy.internal_shifts"),
      rule("element:fire", 6, "energy.fire_activation"),
      rule("element:water", 5, "energy.water_cycling"),
      rule("ten_god_concentration", 4, "energy.structural_concentration"),
      rule("element:earth", -6, "energy.earth_stability"),
      rule("ten_god:zheng_guan", -3, "energy.routine_regulation"),
    ],
    highPositive: "容易出现阶段性高投入，在合适窗口可以形成明显爆发力。",
    highStress: "压力下可能在高投入与低恢复之间摆动，难以稳定估计持续产能。",
    highSuggestion: "按可持续最低产能排计划，把高能量阶段当作额外收益而非基线。",
    lowPositive: "能量和节奏相对稳定，更适合长期重复与持续积累。",
    lowStress: "压力下可能维持惯性太久，忽略需要主动切换节奏的信号。",
    lowSuggestion: "在稳定节奏中安排周期性挑战，避免稳定变成停滞。",
  },
  {
    key: "learning_orientation",
    label: "学习取向",
    rules: [
      rule("ten_god:zheng_yin", 10, "learning.structured_absorption"),
      rule("ten_god:pian_yin", 10, "learning.pattern_exploration"),
      rule("ten_god:shi_shen", 5, "learning.output_to_learn"),
      rule("element:water", 5, "learning.water_absorption"),
      rule("element:wood", 4, "learning.wood_growth"),
      rule("element_balance", 3, "learning.cross_context_balance"),
    ],
    highPositive: "更容易通过吸收框架、识别模式或输出实践持续更新认知。",
    highStress: "压力下可能把继续学习当成延后行动的合理理由。",
    highSuggestion: "每轮学习都绑定一个输出或行为实验，形成输入—验证闭环。",
    lowPositive: "更倾向从直接经验和任务需要中学习，避免无目的的信息摄入。",
    lowStress: "压力下可能只解决眼前问题，忽略建立可迁移的知识结构。",
    lowSuggestion: "每完成一个重要任务，抽取一条可复用原则并记录。",
  },
];

function rule(factor: FactorKey, weight: number, code: string): FactorRule {
  return { factor, weight, code };
}

export function deriveTenGod(dayMaster: HeavenlyStem, otherStem: HeavenlyStem): TenGod {
  const day = STEM_META[dayMaster];
  const other = STEM_META[otherStem];
  const samePolarity = day.polarity === other.polarity;

  if (day.element === other.element) {
    return samePolarity ? "bi_jian" : "jie_cai";
  }
  if (GENERATES[day.element] === other.element) {
    return samePolarity ? "shi_shen" : "shang_guan";
  }
  if (CONTROLS[day.element] === other.element) {
    return samePolarity ? "pian_cai" : "zheng_cai";
  }
  if (CONTROLLED_BY[day.element] === other.element) {
    return samePolarity ? "qi_sha" : "zheng_guan";
  }
  return samePolarity ? "pian_yin" : "zheng_yin";
}

export function deriveBaziFeatures(
  chart: BaziChart,
  options: InterpretationOptions = {},
): InterpretationDerivedFeatures {
  const elementRaw = emptyElementRecord();
  const tenGodRaw = emptyTenGodRecord();
  let hiddenStemCount = 0;
  let explicitHiddenWeightCount = 0;
  let visibleStemCount = 0;
  let visibleYangCount = 0;

  const pillarEntries: Array<[keyof typeof PILLAR_WEIGHT, BaziPillar | null]> = [
    ["year", chart.pillars.year],
    ["month", chart.pillars.month],
    ["day", chart.pillars.day],
    ["hour", chart.pillars.hour],
  ];

  for (const [position, pillar] of pillarEntries) {
    if (!pillar) continue;
    const positionWeight = PILLAR_WEIGHT[position];
    add(elementRaw, pillar.stemElement, 1 * positionWeight);
    add(elementRaw, pillar.branchElement, 0.35 * positionWeight);

    visibleStemCount += 1;
    if (pillar.stemPolarity === "yang") visibleYangCount += 1;

    if (position !== "day") {
      add(tenGodRaw, pillar.tenGod ?? deriveTenGod(chart.dayMaster.stem, pillar.stem), 1 * positionWeight);
    }

    const hiddenWeights = normalizedHiddenWeights(pillar.hiddenStems.map((stem) => stem.weight));
    pillar.hiddenStems.forEach((hidden, index) => {
      hiddenStemCount += 1;
      if (isFinitePositive(hidden.weight)) explicitHiddenWeightCount += 1;
      const hiddenMeta = STEM_META[hidden.stem];
      const normalizedWeight = hiddenWeights[index] ?? 0;
      add(elementRaw, hiddenMeta.element, normalizedWeight * 0.65 * positionWeight);
      add(
        tenGodRaw,
        hidden.tenGod ?? deriveTenGod(chart.dayMaster.stem, hidden.stem),
        normalizedWeight * 0.8 * positionWeight,
      );
    });
  }

  const elementDistribution = normalizeRecord(elementRaw, FIVE_ELEMENTS).map(([element, score]) => ({ element, score }));
  const tenGodDistribution = normalizeRecord(tenGodRaw, TEN_GODS).map(([tenGod, score]) => ({ tenGod, score }));
  const elementShares = recordFromDistribution(elementDistribution, FIVE_ELEMENTS, "element");
  const tenGodShares = recordFromDistribution(tenGodDistribution, TEN_GODS, "tenGod");

  const monthElement = chart.pillars.month.branchElement;
  const seasonalSignal = seasonalSupportSignal(chart.dayMaster.element, monthElement);
  const supportiveShare =
    elementShares[chart.dayMaster.element] + elementShares[GENERATED_BY[chart.dayMaster.element]];
  const strengthIndex = supportiveShare + seasonalSignal * 8;
  const dayMasterStrength = strengthIndex >= 58 ? "strong" : strengthIndex <= 34 ? "weak" : "balanced";
  const elementBalance = normalizedEntropy(FIVE_ELEMENTS.map((element) => elementShares[element]));
  const tenGodConcentration = Math.max(...TEN_GODS.map((tenGod) => tenGodShares[tenGod]));
  const visibleYangRatio = visibleStemCount === 0 ? 50 : round2((visibleYangCount / visibleStemCount) * 100);

  const dayMasterConsistent =
    chart.pillars.day.stem === chart.dayMaster.stem &&
    chart.pillars.day.stemElement === chart.dayMaster.element &&
    chart.pillars.day.stemPolarity === chart.dayMaster.polarity;
  const hiddenWeightCompleteness = hiddenStemCount === 0 ? 1 : explicitHiddenWeightCount / hiddenStemCount;
  const hourKnown = chart.pillars.hour !== null;
  const sourceVersionKnown = Boolean(options.sourceMetadata?.engine_version);
  const confidence = clamp01(
    0.45 +
      (hourKnown ? 0.2 : 0.12) +
      hiddenWeightCompleteness * 0.15 +
      (dayMasterConsistent ? 0.15 : 0) +
      (sourceVersionKnown ? 0.05 : 0.03),
  );

  const structuralTags = buildStructuralTags({
    chart,
    elementShares,
    tenGodShares,
    dayMasterStrength,
    elementBalance,
    visibleYangRatio,
    dayMasterConsistent,
    sourceMetadata: options.sourceMetadata,
  });

  return {
    id: stableUuid(`${chart.id}|derived|${INTERPRETATION_MAPPING_VERSION}`),
    chartId: chart.id,
    engine_version: options.sourceMetadata?.engine_version ?? UNKNOWN_ENGINE_VERSION,
    rule_profile_version: INTERPRETATION_RULE_PROFILE_VERSION,
    mapping_version: INTERPRETATION_MAPPING_VERSION,
    dayMasterStrength,
    elementDistribution,
    tenGodDistribution,
    seasonalContext: `month_branch:${chart.pillars.month.branch};month_element:${monthElement};day_master_relation:${seasonalRelation(chart.dayMaster.element, monthElement)}`,
    structuralTags,
    confidence: round3(confidence),
    derivedAt: chart.calculatedAt,
    signals: {
      dayMasterElement: chart.dayMaster.element,
      visibleYangRatio,
      elementBalance: round3(elementBalance),
      tenGodConcentration: round2(tenGodConcentration),
      hourKnown,
    },
  };
}

export function mapPersonalityProfile(
  features: InterpretationDerivedFeatures,
): { profile: PersonalityProfile; dimensionDetails: PersonalityDimensionDetail[] } {
  const context: MappingContext = {
    features,
    elementShares: recordFromDistribution(features.elementDistribution, FIVE_ELEMENTS, "element"),
    tenGodShares: recordFromDistribution(features.tenGodDistribution, TEN_GODS, "tenGod"),
  };

  const dimensionDetails = DIMENSIONS.map((definition) => scoreDimension(definition, context));
  const profileDimensions = dimensionDetails.map((detail) => ({
    key: detail.key,
    label: detail.label,
    score: detail.score,
    confidence: detail.confidence,
    evidenceKeys: detail.explanationCodes,
  }));

  const salient = [...dimensionDetails]
    .sort((a, b) => salience(b) - salience(a) || a.key.localeCompare(b.key))
    .slice(0, 3);

  const profile: PersonalityProfile = {
    id: stableUuid(`${features.chartId}|profile|${INTERPRETATION_MAPPING_VERSION}`),
    chartId: features.chartId,
    mapping_version: INTERPRETATION_MAPPING_VERSION,
    summary: buildSummary(salient),
    dimensions: profileDimensions,
    strengths: salient.map((detail) => detail.positiveExpression),
    growthEdges: salient.map((detail) => detail.stressExpression),
    behaviorSuggestions: salient.map((detail) => suggestionFor(detail.key, detail.score)),
    generatedAt: features.derivedAt,
  };

  return { profile, dimensionDetails };
}

export function interpretBaziChart(
  chart: BaziChart,
  options: InterpretationOptions = {},
): InterpretationResult {
  const derivedFeatures = deriveBaziFeatures(chart, options);
  const { profile, dimensionDetails } = mapPersonalityProfile(derivedFeatures);
  return {
    derivedFeatures,
    profile,
    dimensionDetails,
    mapping_version: INTERPRETATION_MAPPING_VERSION,
  };
}

function scoreDimension(
  definition: DimensionDefinition,
  context: MappingContext,
): PersonalityDimensionDetail {
  const contributors = definition.rules
    .map((factorRule) => contributorFor(factorRule, context))
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.code.localeCompare(b.code))
    .slice(0, 6);
  const rawScore = 50 + definition.rules.reduce((sum, factorRule) => sum + contributorFor(factorRule, context).contribution, 0);
  const score = Math.round(clamp(rawScore, 0, 100));
  const evidenceMagnitude = clamp(
    definition.rules.reduce((sum, factorRule) => sum + Math.abs(contributorFor(factorRule, context).contribution), 0) / 18,
    0,
    1,
  );
  const confidence = round3(clamp01(0.25 + context.features.confidence * 0.55 + evidenceMagnitude * 0.15));
  const band = score >= 60 ? "high" : score <= 40 ? "low" : "balanced";
  const explanationCodes = [
    `dimension.${definition.key}.band.${band}`,
    ...contributors
      .filter((contributor) => Math.abs(contributor.contribution) >= 0.25)
      .map((contributor) => contributor.code),
  ];
  const expressions = expressionFor(definition, score);

  return {
    key: definition.key,
    label: definition.label,
    score,
    confidence,
    contributors,
    positiveExpression: expressions.positive,
    stressExpression: expressions.stress,
    explanationCodes,
  };
}

function contributorFor(factorRule: FactorRule, context: MappingContext): DimensionContributor {
  const { signal, observed } = evaluateFactor(factorRule.factor, context);
  const contribution = round2(signal * factorRule.weight);
  return {
    code: factorRule.code,
    factor: factorRule.factor,
    signal: round3(signal),
    weight: factorRule.weight,
    contribution,
    direction: contribution > 0.05 ? "increase" : contribution < -0.05 ? "decrease" : "neutral",
    observed,
  };
}

function evaluateFactor(factor: FactorKey, context: MappingContext): { signal: number; observed: number | string } {
  if (factor.startsWith("ten_god:")) {
    const tenGod = factor.slice("ten_god:".length) as TenGod;
    const observed = context.tenGodShares[tenGod];
    return { signal: clamp((observed - 10) / 20, -1, 1), observed: round2(observed) };
  }
  if (factor.startsWith("element:")) {
    const element = factor.slice("element:".length) as FiveElement;
    const observed = context.elementShares[element];
    return { signal: clamp((observed - 20) / 25, -1, 1), observed: round2(observed) };
  }
  if (factor === "visible_yang_ratio") {
    const observed = context.features.signals.visibleYangRatio;
    return { signal: clamp((observed - 50) / 50, -1, 1), observed };
  }
  if (factor === "day_master_strength") {
    const observed = context.features.dayMasterStrength;
    return {
      signal: observed === "strong" ? 1 : observed === "weak" ? -1 : 0,
      observed,
    };
  }
  if (factor === "element_balance") {
    const observed = context.features.signals.elementBalance;
    return { signal: clamp((observed - 0.72) / 0.28, -1, 1), observed };
  }
  const observed = context.features.signals.tenGodConcentration;
  return { signal: clamp((observed - 20) / 30, -1, 1), observed };
}

function expressionFor(
  definition: DimensionDefinition,
  score: number,
): { positive: string; stress: string } {
  if (score >= 60) return { positive: definition.highPositive, stress: definition.highStress };
  if (score <= 40) return { positive: definition.lowPositive, stress: definition.lowStress };
  return {
    positive: `${definition.label}处于中间区间，通常能根据具体情境在两端之间调整。`,
    stress: `压力下${definition.label}可能出现情境性摆动，需要结合真实行为记录判断。`,
  };
}

function suggestionFor(key: PersonalityDimensionKey, score: number): string {
  const definition = DIMENSIONS.find((item) => item.key === key);
  if (!definition) return "用可观察行为持续校准当前解释。";
  if (score >= 60) return definition.highSuggestion;
  if (score <= 40) return definition.lowSuggestion;
  return `连续两周记录不同情境下的${definition.label}表现，用行为证据校准这一中间分数。`;
}

function buildSummary(details: PersonalityDimensionDetail[]): string {
  const phrases = details.map((detail) => `${detail.label}${bandLabel(detail.score)}`).join("、");
  return `这是传统八字结构的现代行为解释模型，不属于科学心理诊断或临床测量。当前较显著的相对倾向包括：${phrases}。分数用于同一映射版本内的结构化比较，并应结合真实行为反馈持续校准。`;
}

function bandLabel(score: number): string {
  if (score >= 60) return "偏高";
  if (score <= 40) return "偏低";
  return "居中";
}

function salience(detail: PersonalityDimensionDetail): number {
  return Math.abs(detail.score - 50) * detail.confidence;
}

function buildStructuralTags(input: {
  chart: BaziChart;
  elementShares: Record<FiveElement, number>;
  tenGodShares: Record<TenGod, number>;
  dayMasterStrength: "weak" | "balanced" | "strong";
  elementBalance: number;
  visibleYangRatio: number;
  dayMasterConsistent: boolean;
  sourceMetadata?: InterpretationOptions["sourceMetadata"];
}): string[] {
  const tags = [
    `day_master:${input.chart.dayMaster.element}:${input.dayMasterStrength}`,
    `element_balance:${round3(input.elementBalance)}`,
    `visible_yang_ratio:${round2(input.visibleYangRatio)}`,
    input.chart.pillars.hour ? "hour:known" : "hour:unknown",
  ];
  const dominantElement = maxKey(input.elementShares, FIVE_ELEMENTS);
  if (input.elementShares[dominantElement] >= 32) tags.push(`element_dominant:${dominantElement}`);
  const dominantTenGod = maxKey(input.tenGodShares, TEN_GODS);
  if (input.tenGodShares[dominantTenGod] >= 22) tags.push(`ten_god_dominant:${dominantTenGod}`);
  if (!input.dayMasterConsistent) tags.push("data_quality:day_master_inconsistent");
  if (!input.sourceMetadata?.engine_version) tags.push("source_engine_version:unknown");
  if (input.sourceMetadata?.rule_profile_version) {
    tags.push(`source_rule_profile:${input.sourceMetadata.rule_profile_version}`);
  }
  return tags;
}

function seasonalSupportSignal(dayMaster: FiveElement, monthElement: FiveElement): number {
  if (monthElement === dayMaster) return 1;
  if (monthElement === GENERATED_BY[dayMaster]) return 0.8;
  if (monthElement === GENERATES[dayMaster]) return -0.3;
  if (monthElement === CONTROLS[dayMaster]) return -0.45;
  return -0.6;
}

function seasonalRelation(dayMaster: FiveElement, monthElement: FiveElement): string {
  if (monthElement === dayMaster) return "same_element";
  if (monthElement === GENERATED_BY[dayMaster]) return "resource";
  if (monthElement === GENERATES[dayMaster]) return "output";
  if (monthElement === CONTROLS[dayMaster]) return "wealth";
  return "authority";
}

function normalizedHiddenWeights(weights: Array<number | undefined>): number[] {
  if (weights.length === 0) return [];
  const valid = weights.map((weight) => (isFinitePositive(weight) ? weight : 0));
  const total = valid.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0 || valid.some((weight) => weight === 0)) {
    return weights.map(() => 1 / weights.length);
  }
  return valid.map((weight) => weight / total);
}

function normalizeRecord<K extends string>(record: Record<K, number>, keys: K[]): Array<[K, number]> {
  const total = keys.reduce((sum, key) => sum + record[key], 0);
  if (total <= 0) return keys.map((key) => [key, 0]);
  const raw = keys.map((key) => [key, (record[key] / total) * 100] as [K, number]);
  const rounded = raw.map(([key, value]) => [key, round2(value)] as [K, number]);
  const diff = round2(100 - rounded.reduce((sum, [, value]) => sum + value, 0));
  if (Math.abs(diff) >= 0.01) {
    const maxIndex = raw.reduce((best, entry, index, all) => (entry[1] > all[best][1] ? index : best), 0);
    rounded[maxIndex][1] = round2(rounded[maxIndex][1] + diff);
  }
  return rounded;
}

function recordFromDistribution<K extends string, T extends Record<F, K> & { score: number }, F extends string>(
  rows: T[],
  keys: K[],
  field: F,
): Record<K, number> {
  const result = Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;
  for (const row of rows) result[row[field]] = row.score;
  return result;
}

function normalizedEntropy(values: number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return 0;
  const entropy = values.reduce((sum, value) => {
    if (value <= 0) return sum;
    const probability = value / total;
    return sum - probability * Math.log(probability);
  }, 0);
  return clamp01(entropy / Math.log(values.length));
}

function emptyElementRecord(): Record<FiveElement, number> {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

function emptyTenGodRecord(): Record<TenGod, number> {
  return {
    bi_jian: 0,
    jie_cai: 0,
    shi_shen: 0,
    shang_guan: 0,
    pian_cai: 0,
    zheng_cai: 0,
    qi_sha: 0,
    zheng_guan: 0,
    pian_yin: 0,
    zheng_yin: 0,
  };
}

function add<K extends string>(record: Record<K, number>, key: K, value: number): void {
  record[key] += value;
}

function maxKey<K extends string>(record: Record<K, number>, keys: K[]): K {
  return keys.reduce((best, key) => (record[key] > record[best] ? key : best), keys[0]);
}

function isFinitePositive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function stableUuid(input: string): string {
  const parts = [0x811c9dc5, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35].map((seed) => hash32(input, seed));
  let hex = parts.map((value) => value.toString(16).padStart(8, "0")).join("");
  hex = `${hex.slice(0, 12)}5${hex.slice(13, 16)}${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17)}`;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function hash32(input: string, seed: number): number {
  let hash = seed >>> 0;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
    hash ^= hash >>> 13;
  }
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}
