import assert from "node:assert/strict";
import test from "node:test";

import type {
  AdvisorRequest,
  AdvisorRequestReleaseReason,
  ConversationMessage,
  JsonValue,
} from "../../types/domain/index.ts";
import { AdvisorRuntime } from "../../modules/ai/advisor-runtime.ts";
import type {
  AdvisorBillingPort,
  AdvisorContextSnapshot,
  AdvisorPersistencePort,
  AIProvider,
  AIProviderDescriptor,
  PersistAdvisorMessageInput,
  StructuredGenerationRequest,
} from "../../modules/ai/contracts.ts";
import { AIProviderError } from "../../modules/ai/errors.ts";
import {
  ADVISOR_SCHEMA_VERSION,
  FULL_REPORT_SCHEMA_VERSION,
  FULL_REPORT_SECTION_CODES,
  FULL_REPORT_SECTION_TITLES,
} from "../../modules/ai/schemas.ts";
import { FullReportRuntime } from "../../modules/ai/report-runtime.ts";
import { calculation, memories, messages, personality } from "./fixtures.ts";

const descriptor: AIProviderDescriptor = { provider: "fake", model: "fake-model" };

class SequenceProvider implements AIProvider {
  readonly descriptor = descriptor;
  readonly requests: StructuredGenerationRequest[] = [];

  constructor(private readonly sequence: Array<unknown | Error>) {}

  async generateStructured(request: StructuredGenerationRequest) {
    this.requests.push(request);
    const next = this.sequence.shift();
    if (next instanceof Error) throw next;
    return { value: next, descriptor: this.descriptor };
  }
}

function reportValue(evidenceKey: string) {
  return {
    schemaVersion: FULL_REPORT_SCHEMA_VERSION,
    sections: FULL_REPORT_SECTION_CODES.map((code) => ({
      code,
      title: FULL_REPORT_SECTION_TITLES[code],
      body: "这是基于证据的倾向描述。",
      evidenceKeys: [evidenceKey],
      actions: [],
      confidence: 0.8,
    })),
    followUpQuestions: ["我可以怎么用好这个优势？", "压力下怎么调整？"],
  };
}

function advisorValue(evidenceKey: string) {
  return {
    schemaVersion: ADVISOR_SCHEMA_VERSION,
    answer: "优先比较真实工作环境里的自主空间和反馈方式。",
    keyPoints: [{ point: "自主空间值得重点验证。", evidenceKeys: [evidenceKey] }],
    actions: ["列出三个岗位并比较决策权限。"],
    caveat: "这是倾向参考，不替代现实信息。",
    followUpQuestions: [],
  };
}

function reservedRequest(): AdvisorRequest {
  return {
    id: "advisor-request-1",
    userId: "user-ai-1",
    conversationId: "conversation-ai-1",
    userMessageId: "user-message-new",
    creditsReserved: 1,
    idempotencyKey: "idem-1",
    reservationExpiresAt: "2026-08-18T01:00:00.000Z",
    state: "reserved",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  };
}

class FakeBilling implements AdvisorBillingPort {
  readonly events: string[] = [];
  releaseReason?: AdvisorRequestReleaseReason;

  async reserve(): Promise<AdvisorRequest> {
    this.events.push("reserve");
    return reservedRequest();
  }

  async commit(request: AdvisorRequest, assistantMessageId: string): Promise<AdvisorRequest> {
    this.events.push("commit");
    return {
      ...request,
      state: "committed",
      assistantMessageId,
      commitLedgerEntryId: "ledger-1",
      committedAt: "2026-08-18T00:10:00.000Z",
      updatedAt: "2026-08-18T00:10:00.000Z",
    } as AdvisorRequest;
  }

  async release(request: AdvisorRequest, reason: AdvisorRequestReleaseReason): Promise<AdvisorRequest> {
    this.events.push("release");
    this.releaseReason = reason;
    return {
      ...request,
      state: "released",
      releaseReason: reason,
      releasedAt: "2026-08-18T00:10:00.000Z",
      updatedAt: "2026-08-18T00:10:00.000Z",
    } as AdvisorRequest;
  }
}

class FakePersistence implements AdvisorPersistencePort {
  readonly events: string[] = [];
  summary?: string;
  snapshot: AdvisorContextSnapshot = {
    memories,
    recentConversation: messages,
    conversationSummary: "之前讨论过职业自主性。",
  };

  async loadContext(): Promise<AdvisorContextSnapshot> {
    this.events.push("load");
    return this.snapshot;
  }

  async appendUserMessage(conversationId: string, content: string): Promise<ConversationMessage> {
    this.events.push("user");
    return {
      id: "user-message-new",
      conversationId,
      userId: "user-ai-1",
      role: "user",
      content,
      creditCost: 0,
      createdAt: "2026-08-18T00:05:00.000Z",
    };
  }

  async appendAssistantMessage(input: PersistAdvisorMessageInput): Promise<ConversationMessage> {
    this.events.push("assistant");
    return {
      id: "assistant-message-new",
      conversationId: input.conversationId,
      userId: "user-ai-1",
      role: "assistant",
      content: input.content,
      structuredPayload: input.structuredPayload as JsonValue,
      prompt_version: input.promptVersion,
      creditCost: 0,
      createdAt: "2026-08-18T00:06:00.000Z",
    };
  }

  async persistConversationSummary(_conversationId: string, summary: string): Promise<void> {
    this.events.push("summary");
    this.summary = summary;
  }
}

function firstEvidenceKey(): string {
  return "bazi.day_master";
}

test("report runtime repairs invalid structured output once and never sends raw birth calculation inputs", async () => {
  const provider = new SequenceProvider([
    { schemaVersion: FULL_REPORT_SCHEMA_VERSION, sections: [], followUpQuestions: [] },
    reportValue(firstEvidenceKey()),
  ]);
  const runtime = new FullReportRuntime(provider);
  const result = await runtime.generate({ calculation, personality });

  assert.equal(result.attempts, 2);
  assert.equal(provider.requests.length, 2);
  assert.match(provider.requests[1].prompt, /REPAIR REQUIRED/);
  for (const request of provider.requests) {
    assert.match(request.system, /Never calculate or recalculate Four Pillars/i);
    assert.equal(request.prompt.includes("birthProfileId"), false);
    assert.equal(request.prompt.includes("birth-ai-secret-id"), false);
    assert.equal(request.prompt.includes("sourceTimezone"), false);
  }
});

test("advisor success follows reserve -> AI -> persist assistant -> commit and writes bounded summary", async () => {
  const provider = new SequenceProvider([advisorValue(firstEvidenceKey())]);
  const billing = new FakeBilling();
  const persistence = new FakePersistence();
  const runtime = new AdvisorRuntime(provider, billing, persistence);
  const result = await runtime.run({
    conversationId: "conversation-ai-1",
    idempotencyKey: "idem-1",
    question: "我想换工作，应该先看什么？",
    calculation,
    personality,
  });

  assert.equal(result.request.state, "committed");
  assert.deepEqual(billing.events, ["reserve", "commit"]);
  assert.deepEqual(persistence.events, ["load", "user", "assistant", "summary"]);
  assert.ok((persistence.summary?.length ?? 0) <= 2_000);
  assert.equal(provider.requests[0].prompt.includes('"content": "message content 1"'), false);
  assert.equal(provider.requests[0].prompt.includes('"content": "message content 12"'), true);
});

test("provider failure is retried once then releases reservation without commit", async () => {
  const provider = new SequenceProvider([
    new AIProviderError("provider_error", "first failure"),
    new AIProviderError("provider_error", "second failure"),
  ]);
  const billing = new FakeBilling();
  const persistence = new FakePersistence();
  const runtime = new AdvisorRuntime(provider, billing, persistence);

  await assert.rejects(
    runtime.run({
      conversationId: "conversation-ai-1",
      idempotencyKey: "idem-1",
      question: "我该怎么选？",
      calculation,
      personality,
    }),
    /second failure/,
  );
  assert.equal(provider.requests.length, 2);
  assert.deepEqual(billing.events, ["reserve", "release"]);
  assert.equal(billing.releaseReason, "provider_error");
  assert.equal(persistence.events.includes("assistant"), false);
});

test("timeout is retried then releases with timeout reason", async () => {
  const provider = new SequenceProvider([
    new AIProviderError("timeout", "timed out once"),
    new AIProviderError("timeout", "timed out twice"),
  ]);
  const billing = new FakeBilling();
  const runtime = new AdvisorRuntime(provider, billing, new FakePersistence());
  await assert.rejects(
    runtime.run({
      conversationId: "conversation-ai-1",
      idempotencyKey: "idem-1",
      question: "现在适合调整吗？",
      calculation,
      personality,
    }),
    /timed out twice/,
  );
  assert.equal(provider.requests.length, 2);
  assert.equal(billing.releaseReason, "timeout");
});

test("two semantically invalid outputs release with invalid_output and never persist assistant", async () => {
  const invalid = {
    schemaVersion: ADVISOR_SCHEMA_VERSION,
    answer: "没有证据也直接下结论。",
    keyPoints: [{ point: "虚构事实", evidenceKeys: ["invented.fact"] }],
    actions: [],
    caveat: "仅供参考。",
    followUpQuestions: [],
  };
  const provider = new SequenceProvider([invalid, invalid]);
  const billing = new FakeBilling();
  const persistence = new FakePersistence();
  const runtime = new AdvisorRuntime(provider, billing, persistence);
  await assert.rejects(
    runtime.run({
      conversationId: "conversation-ai-1",
      idempotencyKey: "idem-1",
      question: "给我结论",
      calculation,
      personality,
    }),
    /failed validation/i,
  );
  assert.equal(provider.requests.length, 2);
  assert.equal(billing.releaseReason, "invalid_output");
  assert.equal(persistence.events.includes("assistant"), false);
});
