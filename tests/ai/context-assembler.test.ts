import assert from "node:assert/strict";
import test from "node:test";

import { assembleAIContext } from "../../modules/ai/context-assembler.ts";
import { calculation, memories, messages, personality } from "./fixtures.ts";

test("ContextAssembler preserves canonical inputs and never exposes raw birth/persistence details", () => {
  const beforeCalculation = structuredClone(calculation);
  const beforePersonality = structuredClone(personality);
  const packet = assembleAIContext({ calculation, personality });

  assert.deepEqual(calculation, beforeCalculation);
  assert.deepEqual(personality, beforePersonality);
  const serialized = JSON.stringify(packet);
  assert.equal(serialized.includes("birthProfileId"), false);
  assert.equal(serialized.includes("birth-ai-secret-id"), false);
  assert.equal(serialized.includes("sourceTimezone"), false);
  assert.equal(serialized.includes("calculatedAt"), false);
  assert.ok(packet.facts.some((fact) => fact.key === "bazi.day_master"));
  assert.ok(packet.facts.some((fact) => fact.key === "derived.day_master_strength"));
});

test("ContextAssembler selects bounded facts, memory, conversation, and explicit luck scope", () => {
  const packet = assembleAIContext({
    calculation,
    personality,
    memories,
    recentConversation: messages,
    conversationSummary: "x".repeat(4_000),
    currentQuestion: "我想换更自主的工作，应该注意什么？",
    luckCycleIndexes: [1, 2, 3, 4, 5],
  });

  assert.equal(packet.facts.filter((fact) => fact.key.startsWith("derived.ten_god.")).length, 5);
  assert.equal(packet.facts.filter((fact) => fact.key.startsWith("luck.cycle.")).length, 3);
  assert.ok(packet.memories.length <= 6);
  assert.equal(packet.memories.some((memory) => memory.key.startsWith("conversation_summary:")), false);
  assert.ok(packet.memories.some((memory) => memory.key === "career_goal"));
  assert.equal(packet.recentConversation.length, 8);
  assert.equal(packet.recentConversation.some((turn) => (turn as { role: string }).role === "system"), false);
  assert.ok((packet.conversationSummary?.length ?? 0) <= 2_000);
});

test("ContextAssembler does not include luck cycles unless caller scopes them", () => {
  const packet = assembleAIContext({ calculation, personality });
  assert.equal(packet.facts.some((fact) => fact.key.startsWith("luck.cycle.")), false);
});

test("ContextAssembler rejects profile/chart or mapping-version mismatch", () => {
  assert.throws(
    () => assembleAIContext({ calculation, personality: { ...personality, chartId: "other-chart" } }),
    /canonical Bazi chart/i,
  );
  assert.throws(
    () =>
      assembleAIContext({
        calculation,
        personality: { ...personality, mapping_version: "personality-map/other" },
      }),
    /mapping version/i,
  );
});
