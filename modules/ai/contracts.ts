import type {
  AdvisorRequest,
  AdvisorRequestReleaseReason,
  BaziCalculationResult,
  ConversationMessage,
  JsonValue,
  PersonalityProfile,
  Report,
  ReportSection,
  UserMemory,
} from "@/types/domain";

export interface AIProviderDescriptor {
  provider: string;
  model: string;
  gatewayUrl?: string;
}

export type EvidenceSource = "bazi" | "derived" | "relation" | "luck" | "personality";
export type EvidenceScalar = string | number | boolean | null;
export type EvidenceValue =
  | EvidenceScalar
  | EvidenceScalar[]
  | Record<string, EvidenceScalar | EvidenceScalar[]>;

export interface AIEvidenceFact {
  key: string;
  source: EvidenceSource;
  label: string;
  value: EvidenceValue;
  confidence?: number;
  sourceKeys?: string[];
}

export interface AIMemoryContextItem {
  key: string;
  kind: UserMemory["kind"];
  value: JsonValue;
  confidence: number;
}

export interface AIConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AIContextPacket {
  packetVersion: string;
  canonicalVersions: {
    engine: string;
    rules: string;
    mapping: string;
  };
  facts: AIEvidenceFact[];
  memories: AIMemoryContextItem[];
  conversationSummary?: string;
  recentConversation: AIConversationTurn[];
  currentQuestion?: string;
}

export interface StructuredGenerationRequest {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  schemaName: string;
  schemaDescription: string;
  timeoutMs: number;
}

export interface StructuredGenerationResult {
  value: unknown;
  descriptor: AIProviderDescriptor;
}

export type AIProviderErrorKind = "provider_error" | "timeout" | "invalid_output";

export interface AIProvider {
  readonly descriptor: AIProviderDescriptor;
  generateStructured(request: StructuredGenerationRequest): Promise<StructuredGenerationResult>;
}

export interface FullReportSectionOutput {
  code: string;
  title: string;
  body: string;
  evidenceKeys: string[];
  actions: string[];
  confidence: number;
}

export interface FullPersonalityReportOutput {
  schemaVersion: string;
  sections: FullReportSectionOutput[];
  followUpQuestions: string[];
}

export interface AdvisorKeyPoint {
  point: string;
  evidenceKeys: string[];
}

export interface AdvisorAnswerOutput {
  schemaVersion: string;
  answer: string;
  keyPoints: AdvisorKeyPoint[];
  actions: string[];
  caveat: string;
  followUpQuestions: string[];
}

export interface PersistFullReportInput {
  calculation: BaziCalculationResult;
  personality: PersonalityProfile;
  sections: ReportSection[];
  promptVersion: string;
  reportSchemaVersion: string;
}

export interface FullReportPersistencePort {
  persistFullReport(input: PersistFullReportInput): Promise<Report>;
}

export interface AdvisorContextSnapshot {
  memories: UserMemory[];
  recentConversation: ConversationMessage[];
  conversationSummary?: string;
}

export interface PersistAdvisorMessageInput {
  conversationId: string;
  content: string;
  structuredPayload: JsonValue;
  promptVersion: string;
  provider: string;
  model: string;
}

export interface AdvisorPersistencePort {
  loadContext(conversationId: string): Promise<AdvisorContextSnapshot>;
  appendUserMessage(conversationId: string, content: string): Promise<ConversationMessage>;
  appendAssistantMessage(input: PersistAdvisorMessageInput): Promise<ConversationMessage>;
  persistConversationSummary(conversationId: string, summary: string): Promise<void>;
}

export interface ReserveAdvisorRequestInput {
  conversationId: string;
  userMessageId: string;
  idempotencyKey: string;
}

/**
 * 07 consumes the shared AdvisorRequest aggregate only. Implementations belong
 * to Billing/DB and must own the wallet/ledger transaction semantics.
 */
export interface AdvisorBillingPort {
  reserve(input: ReserveAdvisorRequestInput): Promise<AdvisorRequest>;
  commit(request: AdvisorRequest, assistantMessageId: string): Promise<AdvisorRequest>;
  release(request: AdvisorRequest, reason: AdvisorRequestReleaseReason): Promise<AdvisorRequest>;
}
