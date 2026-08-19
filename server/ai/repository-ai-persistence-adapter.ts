import "server-only";

import type { ConversationMessage, JsonValue, Report } from "@/types/domain";

import type {
  AdvisorContextSnapshot,
  AdvisorPersistencePort,
  FullReportPersistencePort,
  PersistAdvisorMessageInput,
  PersistFullReportInput,
} from "../../modules/ai/contracts";
import { ConversationRepository } from "../repositories/conversation-repository";
import { MemoryRepository } from "../repositories/memory-repository";
import { ReportRepository } from "../repositories/report-repository";

const SUMMARY_KEY_PREFIX = "conversation_summary:";
const MAX_REPOSITORY_RECENT_TURNS = 8;

export class RepositoryAIPersistenceAdapter
  implements AdvisorPersistencePort, FullReportPersistencePort
{
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly memories: MemoryRepository,
    private readonly reports: ReportRepository,
  ) {}

  async loadContext(conversationId: string): Promise<AdvisorContextSnapshot> {
    const [messages, memories] = await Promise.all([
      this.conversations.listMessages(conversationId),
      this.memories.listActive(),
    ]);
    const summaryKey = `${SUMMARY_KEY_PREFIX}${conversationId}`;
    const summaryMemory = memories.find((memory) => memory.key === summaryKey);

    return {
      memories,
      recentConversation: messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .slice(-MAX_REPOSITORY_RECENT_TURNS),
      conversationSummary:
        typeof summaryMemory?.value === "string" ? summaryMemory.value : undefined,
    };
  }

  appendUserMessage(
    conversationId: string,
    content: string,
  ): Promise<ConversationMessage> {
    return this.conversations.appendUserMessage({ conversationId, content });
  }

  appendAssistantMessage(input: PersistAdvisorMessageInput): Promise<ConversationMessage> {
    return this.conversations.appendServiceMessage({
      conversationId: input.conversationId,
      role: "assistant",
      content: input.content,
      structuredPayload: input.structuredPayload,
      promptVersion: input.promptVersion,
      modelProvider: input.provider,
      modelName: input.model,
      // Billing's committed AdvisorRequest + ledger are the consumption authority.
      // The assistant row is persisted before commit, so it must not pretend a
      // debit already happened if the subsequent commit fails and releases.
      creditCost: 0,
    });
  }

  async persistConversationSummary(conversationId: string, summary: string): Promise<void> {
    const key = `${SUMMARY_KEY_PREFIX}${conversationId}`;
    const active = await this.memories.listActive();
    const existing = active.find((memory) => memory.key === key);
    if (existing) {
      await this.memories.update(existing.id, { value: summary as JsonValue, confidence: 1 });
      return;
    }
    await this.memories.create({
      conversationId,
      key,
      kind: "advisor_note",
      value: summary as JsonValue,
      confidence: 1,
      userEditable: false,
    });
  }

  persistFullReport(input: PersistFullReportInput): Promise<Report> {
    return this.reports.create({
      chartId: input.calculation.chart.id,
      derivedFeaturesId: input.calculation.derivedFeatures.id,
      tier: "tier_3",
      status: "ready",
      title: "完整人格报告",
      personalityProfile: input.personality,
      sections: input.sections,
      engine_version: input.calculation.calculationMetadata.engine_version,
      rule_profile_version: input.calculation.calculationMetadata.rule_profile_version,
      mapping_version: input.personality.mapping_version,
      prompt_version: input.promptVersion,
      report_schema_version: input.reportSchemaVersion,
    });
  }
}
