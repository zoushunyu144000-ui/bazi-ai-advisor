// Boundary: provider-independent report/advisor orchestration over canonical Bazi facts.
// LLMs may explain BaziCalculationResult + PersonalityProfile, but may never recalculate them.
export { assembleAIContext, getAvailableEvidenceKeys, AI_CONTEXT_PACKET_VERSION } from "./context-assembler";
export { FullReportRuntime } from "./report-runtime";
export { AdvisorRuntime } from "./advisor-runtime";
export { updateConversationSummary } from "./memory";
export { AI_SYSTEM_POLICY, AI_SYSTEM_POLICY_VERSION } from "./prompts";
export {
  FULL_REPORT_PROMPT_VERSION,
  FULL_REPORT_SCHEMA_VERSION,
  ADVISOR_PROMPT_VERSION,
  ADVISOR_SCHEMA_VERSION,
  FULL_REPORT_SECTION_CODES,
  FULL_REPORT_SECTION_TITLES,
  FULL_REPORT_JSON_SCHEMA,
  ADVISOR_JSON_SCHEMA,
  validateFullReportOutput,
  validateAdvisorOutput,
} from "./schemas";
export { AIProviderError, AIOutputValidationError, AIContractError } from "./errors";
export type {
  AIProvider,
  AIProviderDescriptor,
  AIContextPacket,
  AIEvidenceFact,
  AIMemoryContextItem,
  AIConversationTurn,
  AdvisorAnswerOutput,
  AdvisorBillingPort,
  AdvisorContextSnapshot,
  AdvisorPersistencePort,
  FullPersonalityReportOutput,
  FullReportPersistencePort,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from "./contracts";
export type { GenerateFullReportInput, FullReportRuntimeResult } from "./report-runtime";
export type { RunAdvisorInput, AdvisorRuntimeResult } from "./advisor-runtime";
