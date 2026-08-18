import type {
  BaziCalculationResult,
  JsonValue,
  PersonalityProfile,
  Report,
  ReportSection,
  UserMemory,
} from "@/types/domain";

import { assembleAIContext, getAvailableEvidenceKeys } from "./context-assembler";
import type {
  AIProvider,
  FullPersonalityReportOutput,
  FullReportPersistencePort,
} from "./contracts";
import { generateValidated } from "./generation";
import { AI_SYSTEM_POLICY, buildFullReportPrompt } from "./prompts";
import {
  FULL_REPORT_JSON_SCHEMA,
  FULL_REPORT_PROMPT_VERSION,
  FULL_REPORT_SCHEMA_VERSION,
  validateFullReportOutput,
} from "./schemas";

export interface GenerateFullReportInput {
  calculation: BaziCalculationResult;
  personality: PersonalityProfile;
  memories?: UserMemory[];
  conversationSummary?: string;
}

export interface FullReportRuntimeResult {
  output: FullPersonalityReportOutput;
  sections: ReportSection[];
  persistedReport?: Report;
  attempts: number;
  provider: string;
  model: string;
}

function toReportSections(output: FullPersonalityReportOutput): ReportSection[] {
  return output.sections.map((section) => ({
    id: section.code,
    title: { zhHans: section.title },
    body: section.body,
    structuredData: {
      evidenceKeys: section.evidenceKeys,
      actions: section.actions,
      confidence: section.confidence,
    } as JsonValue,
  }));
}

export class FullReportRuntime {
  constructor(
    private readonly provider: AIProvider,
    private readonly persistence?: FullReportPersistencePort,
  ) {}

  async generate(input: GenerateFullReportInput): Promise<FullReportRuntimeResult> {
    const packet = assembleAIContext({
      calculation: input.calculation,
      personality: input.personality,
      memories: input.memories,
      conversationSummary: input.conversationSummary,
    });
    const evidenceKeys = getAvailableEvidenceKeys(packet);
    const generated = await generateValidated({
      provider: this.provider,
      request: {
        system: AI_SYSTEM_POLICY,
        prompt: buildFullReportPrompt(packet),
        schema: FULL_REPORT_JSON_SCHEMA,
        schemaName: "full_personality_report",
        schemaDescription: "Eight-section grounded Bazi personality report.",
        timeoutMs: 30_000,
      },
      validate: (value) => validateFullReportOutput(value, evidenceKeys),
      maxAttempts: 2,
    });

    const sections = toReportSections(generated.output);
    const persistedReport = this.persistence
      ? await this.persistence.persistFullReport({
          calculation: input.calculation,
          personality: input.personality,
          sections,
          promptVersion: FULL_REPORT_PROMPT_VERSION,
          reportSchemaVersion: FULL_REPORT_SCHEMA_VERSION,
        })
      : undefined;

    return {
      output: generated.output,
      sections,
      persistedReport,
      attempts: generated.attempts,
      provider: generated.providerResult.descriptor.provider,
      model: generated.providerResult.descriptor.model,
    };
  }
}
