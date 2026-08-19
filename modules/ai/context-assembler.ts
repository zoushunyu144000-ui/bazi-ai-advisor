import type {
  BaziCalculationResult,
  BaziLuckCyclePeriod,
  ConversationMessage,
  PersonalityProfile,
  UserMemory,
} from "@/types/domain";

import type {
  AIContextPacket,
  AIConversationTurn,
  AIEvidenceFact,
  AIMemoryContextItem,
} from "./contracts";

export const AI_CONTEXT_PACKET_VERSION = "ai-context/1.0.0";

const MAX_MEMORIES = 6;
const MAX_RECENT_TURNS = 8;
const MAX_MESSAGE_CHARS = 1_200;
const MAX_SUMMARY_CHARS = 2_000;
const MAX_STRUCTURAL_TAGS = 8;
const MAX_RELATIONS = 8;
const MAX_LUCK_CYCLES = 3;
const MAX_TEN_GODS = 5;

export interface AssembleAIContextInput {
  calculation: BaziCalculationResult;
  personality: PersonalityProfile;
  memories?: UserMemory[];
  recentConversation?: ConversationMessage[];
  conversationSummary?: string;
  currentQuestion?: string;
  luckCycleIndexes?: number[];
}

function clampText(value: string, maxChars: number): string {
  const normalized = value.trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 1)}…`;
}

function pushFact(facts: AIEvidenceFact[], fact: AIEvidenceFact): void {
  facts.push(fact);
}

function relationValue(relation: BaziCalculationResult["relations"][number]) {
  return {
    kind: relation.kind,
    leftPillar: relation.leftPillar,
    rightPillar: relation.rightPillar,
    left: relation.left,
    right: relation.right,
  };
}

function luckCycleValue(cycle: BaziLuckCyclePeriod) {
  return {
    index: cycle.index,
    stem: cycle.pillar.stem,
    branch: cycle.pillar.branch,
    startAgeYears: cycle.startAgeYears,
    endAgeYears: cycle.endAgeYears,
  };
}

function selectLuckCycles(
  calculation: BaziCalculationResult,
  indexes: number[] | undefined,
): BaziLuckCyclePeriod[] {
  if (!indexes?.length) return [];
  const wanted = new Set(indexes.slice(0, MAX_LUCK_CYCLES));
  return calculation.luck.cycles.filter((cycle) => wanted.has(cycle.index)).slice(0, MAX_LUCK_CYCLES);
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[\s,，。！？!?；;：:、/\\|()[\]{}<>"'`~@#$%^&*+=_-]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function memoryText(memory: UserMemory): string {
  try {
    return `${memory.key} ${JSON.stringify(memory.value)}`.toLowerCase();
  } catch {
    return memory.key.toLowerCase();
  }
}

function memoryScore(memory: UserMemory, currentQuestion?: string): number {
  let score = memory.confidence;
  if (memory.kind === "goal" || memory.kind === "constraint") score += 2;
  else if (memory.kind === "preference" || memory.kind === "fact") score += 1;
  else score += 0.5;

  if (!currentQuestion) return score;
  const haystack = memoryText(memory);
  for (const token of tokenize(currentQuestion)) {
    if (haystack.includes(token)) score += 2;
  }
  if (currentQuestion.toLowerCase().includes(memory.key.toLowerCase())) score += 3;
  return score;
}

function selectMemories(memories: UserMemory[], currentQuestion?: string): AIMemoryContextItem[] {
  return memories
    .filter(
      (memory) =>
        memory.active &&
        memory.confidence >= 0.5 &&
        !memory.key.startsWith("conversation_summary:"),
    )
    .map((memory) => ({ memory, score: memoryScore(memory, currentQuestion) }))
    .sort((left, right) => right.score - left.score || right.memory.updatedAt.localeCompare(left.memory.updatedAt))
    .slice(0, MAX_MEMORIES)
    .map(({ memory }) => ({
      key: memory.key,
      kind: memory.kind,
      value: memory.value,
      confidence: memory.confidence,
    }));
}

function selectRecentConversation(messages: ConversationMessage[]): AIConversationTurn[] {
  return messages
    .filter(
      (message): message is ConversationMessage & { role: "user" | "assistant" } =>
        message.role === "user" || message.role === "assistant",
    )
    .slice(-MAX_RECENT_TURNS)
    .map((message) => ({
      role: message.role,
      content: clampText(message.content, MAX_MESSAGE_CHARS),
    }));
}

export function assembleAIContext(input: AssembleAIContextInput): AIContextPacket {
  const { calculation, personality } = input;
  if (personality.chartId !== calculation.chart.id) {
    throw new Error("PersonalityProfile must reference the canonical Bazi chart.");
  }
  if (personality.mapping_version !== calculation.derivedFeatures.mapping_version) {
    throw new Error("PersonalityProfile mapping version must match canonical Bazi derived features.");
  }

  const facts: AIEvidenceFact[] = [];
  const { chart, derivedFeatures } = calculation;

  pushFact(facts, {
    key: "bazi.day_master",
    source: "bazi",
    label: "日主",
    value: {
      stem: chart.dayMaster.stem,
      element: chart.dayMaster.element,
      polarity: chart.dayMaster.polarity,
    },
  });

  for (const position of ["year", "month", "day", "hour"] as const) {
    const pillar = chart.pillars[position];
    if (!pillar) {
      pushFact(facts, {
        key: `bazi.pillar.${position}`,
        source: "bazi",
        label: `${position} pillar`,
        value: null,
      });
      continue;
    }
    pushFact(facts, {
      key: `bazi.pillar.${position}`,
      source: "bazi",
      label: `${position} pillar`,
      value: {
        stem: pillar.stem,
        branch: pillar.branch,
        tenGod: pillar.tenGod ?? null,
      },
    });
  }

  pushFact(facts, {
    key: "derived.day_master_strength",
    source: "derived",
    label: "日主强弱",
    value: derivedFeatures.dayMasterStrength,
    confidence: derivedFeatures.confidence,
  });

  for (const element of derivedFeatures.elementDistribution) {
    pushFact(facts, {
      key: `derived.element.${element.element}`,
      source: "derived",
      label: `五行 ${element.element}`,
      value: element.score,
      confidence: derivedFeatures.confidence,
    });
  }

  for (const tenGod of [...derivedFeatures.tenGodDistribution]
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_TEN_GODS)) {
    pushFact(facts, {
      key: `derived.ten_god.${tenGod.tenGod}`,
      source: "derived",
      label: `十神 ${tenGod.tenGod}`,
      value: tenGod.score,
      confidence: derivedFeatures.confidence,
    });
  }

  pushFact(facts, {
    key: "derived.seasonal_context",
    source: "derived",
    label: "季节结构",
    value: clampText(derivedFeatures.seasonalContext, 800),
    confidence: derivedFeatures.confidence,
  });

  if (derivedFeatures.structuralTags.length) {
    pushFact(facts, {
      key: "derived.structural_tags",
      source: "derived",
      label: "结构标签",
      value: derivedFeatures.structuralTags.slice(0, MAX_STRUCTURAL_TAGS),
      confidence: derivedFeatures.confidence,
    });
  }

  calculation.relations.slice(0, MAX_RELATIONS).forEach((relation, index) => {
    pushFact(facts, {
      key: `relation.${index + 1}`,
      source: "relation",
      label: `干支关系 ${index + 1}`,
      value: relationValue(relation),
    });
  });

  selectLuckCycles(calculation, input.luckCycleIndexes).forEach((cycle) => {
    pushFact(facts, {
      key: `luck.cycle.${cycle.index}`,
      source: "luck",
      label: `大运周期 ${cycle.index}`,
      value: luckCycleValue(cycle),
    });
  });

  pushFact(facts, {
    key: "personality.summary",
    source: "personality",
    label: "人格摘要",
    value: clampText(personality.summary, 1_500),
  });

  personality.dimensions.slice(0, 15).forEach((dimension) => {
    pushFact(facts, {
      key: `personality.dimension.${dimension.key}`,
      source: "personality",
      label: dimension.label,
      value: {
        score: dimension.score,
        confidence: dimension.confidence,
      },
      confidence: dimension.confidence,
      sourceKeys: dimension.evidenceKeys.slice(0, 12),
    });
  });

  if (personality.strengths.length) {
    pushFact(facts, {
      key: "personality.strengths",
      source: "personality",
      label: "优势",
      value: personality.strengths.slice(0, 6),
    });
  }
  if (personality.growthEdges.length) {
    pushFact(facts, {
      key: "personality.growth_edges",
      source: "personality",
      label: "成长边界",
      value: personality.growthEdges.slice(0, 6),
    });
  }
  if (personality.behaviorSuggestions.length) {
    pushFact(facts, {
      key: "personality.behavior_suggestions",
      source: "personality",
      label: "行为建议",
      value: personality.behaviorSuggestions.slice(0, 6),
    });
  }

  return {
    packetVersion: AI_CONTEXT_PACKET_VERSION,
    canonicalVersions: {
      engine: calculation.calculationMetadata.engine_version,
      rules: calculation.calculationMetadata.rule_profile_version,
      mapping: personality.mapping_version,
    },
    facts,
    memories: selectMemories(input.memories ?? [], input.currentQuestion),
    conversationSummary: input.conversationSummary
      ? clampText(input.conversationSummary, MAX_SUMMARY_CHARS)
      : undefined,
    recentConversation: selectRecentConversation(input.recentConversation ?? []),
    currentQuestion: input.currentQuestion
      ? clampText(input.currentQuestion, MAX_MESSAGE_CHARS)
      : undefined,
  };
}

export function getAvailableEvidenceKeys(packet: AIContextPacket): Set<string> {
  return new Set(packet.facts.map((fact) => fact.key));
}
