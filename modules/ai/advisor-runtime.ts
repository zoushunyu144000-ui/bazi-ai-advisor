import type {
  AdvisorRequest,
  AdvisorRequestReleaseReason,
  BaziCalculationResult,
  JsonValue,
  PersonalityProfile,
} from "@/types/domain";

import { assembleAIContext, getAvailableEvidenceKeys } from "./context-assembler";
import type {
  AdvisorAnswerOutput,
  AdvisorBillingPort,
  AdvisorPersistencePort,
  AIProvider,
} from "./contracts";
import { AIContractError, AIOutputValidationError, AIProviderError } from "./errors";
import { generateValidated } from "./generation";
import { updateConversationSummary } from "./memory";
import { AI_SYSTEM_POLICY, buildAdvisorPrompt } from "./prompts";
import {
  ADVISOR_JSON_SCHEMA,
  ADVISOR_PROMPT_VERSION,
  validateAdvisorOutput,
} from "./schemas";

export interface RunAdvisorInput {
  conversationId: string;
  idempotencyKey: string;
  question: string;
  calculation: BaziCalculationResult;
  personality: PersonalityProfile;
  luckCycleIndexes?: number[];
}

export interface AdvisorRuntimeResult {
  answer: AdvisorAnswerOutput;
  request: AdvisorRequest;
  assistantMessageId: string;
  attempts: number;
  provider: string;
  model: string;
}

function releaseReasonFor(error: unknown): AdvisorRequestReleaseReason {
  if (error instanceof AIProviderError) {
    if (error.kind === "timeout") return "timeout";
    if (error.kind === "invalid_output") return "invalid_output";
    return "provider_error";
  }
  if (error instanceof AIOutputValidationError) return "invalid_output";
  return "server_error";
}

function assertReserved(request: AdvisorRequest): asserts request is AdvisorRequest & { state: "reserved" } {
  if (request.state !== "reserved") {
    throw new AIContractError(`Billing reserve must return a reserved AdvisorRequest, got ${request.state}.`);
  }
}

export class AdvisorRuntime {
  constructor(
    private readonly provider: AIProvider,
    private readonly billing: AdvisorBillingPort,
    private readonly persistence: AdvisorPersistencePort,
  ) {}

  async run(input: RunAdvisorInput): Promise<AdvisorRuntimeResult> {
    const question = input.question.trim();
    if (!question) throw new Error("Advisor question is required.");

    const snapshot = await this.persistence.loadContext(input.conversationId);
    const userMessage = await this.persistence.appendUserMessage(input.conversationId, question);
    let request = await this.billing.reserve({
      conversationId: input.conversationId,
      userMessageId: userMessage.id,
      idempotencyKey: input.idempotencyKey,
    });
    assertReserved(request);

    try {
      const packet = assembleAIContext({
        calculation: input.calculation,
        personality: input.personality,
        memories: snapshot.memories,
        recentConversation: snapshot.recentConversation,
        conversationSummary: snapshot.conversationSummary,
        currentQuestion: question,
        luckCycleIndexes: input.luckCycleIndexes,
      });
      const evidenceKeys = getAvailableEvidenceKeys(packet);
      const generated = await generateValidated({
        provider: this.provider,
        request: {
          system: AI_SYSTEM_POLICY,
          prompt: buildAdvisorPrompt(packet),
          schema: ADVISOR_JSON_SCHEMA,
          schemaName: "advisor_answer",
          schemaDescription: "Evidence-grounded Bazi advisor response.",
          timeoutMs: 25_000,
        },
        validate: (value) => validateAdvisorOutput(value, evidenceKeys),
        maxAttempts: 2,
      });

      const assistantMessage = await this.persistence.appendAssistantMessage({
        conversationId: input.conversationId,
        content: generated.output.answer,
        structuredPayload: generated.output as unknown as JsonValue,
        promptVersion: ADVISOR_PROMPT_VERSION,
        provider: generated.providerResult.descriptor.provider,
        model: generated.providerResult.descriptor.model,
      });

      request = await this.billing.commit(request, assistantMessage.id);
      if (request.state !== "committed") {
        throw new AIContractError(`Billing commit must return a committed AdvisorRequest, got ${request.state}.`);
      }

      const nextSummary = updateConversationSummary(
        snapshot.conversationSummary,
        question,
        generated.output.answer,
      );
      try {
        await this.persistence.persistConversationSummary(input.conversationId, nextSummary);
      } catch {
        // The committed answer remains valid. Summary is recoverable derived context,
        // so a summary write failure must not mutate billing state or duplicate charge.
      }

      return {
        answer: generated.output,
        request,
        assistantMessageId: assistantMessage.id,
        attempts: generated.attempts,
        provider: generated.providerResult.descriptor.provider,
        model: generated.providerResult.descriptor.model,
      };
    } catch (error) {
      if (request.state === "reserved") {
        try {
          await this.billing.release(request, releaseReasonFor(error));
        } catch {
          // Billing owns idempotent terminal-state recovery. Never write wallet/ledger here.
        }
      }
      throw error;
    }
  }
}
