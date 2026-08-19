import assert from "node:assert/strict";
import test from "node:test";

import { assembleAIContext, getAvailableEvidenceKeys } from "../../modules/ai/context-assembler.ts";
import {
  ADVISOR_SCHEMA_VERSION,
  FULL_REPORT_SCHEMA_VERSION,
  FULL_REPORT_SECTION_CODES,
  FULL_REPORT_SECTION_TITLES,
  validateAdvisorOutput,
  validateFullReportOutput,
} from "../../modules/ai/schemas.ts";
import { calculation, personality } from "./fixtures.ts";

const packet = assembleAIContext({ calculation, personality, currentQuestion: "我适合怎样工作？" });
const keys = getAvailableEvidenceKeys(packet);
const evidence = [...keys][0];

function validReport() {
  return {
    schemaVersion: FULL_REPORT_SCHEMA_VERSION,
    sections: FULL_REPORT_SECTION_CODES.map((code) => ({
      code,
      title: FULL_REPORT_SECTION_TITLES[code],
      body: "这是基于结构证据的倾向说明，不把它当作不可改变的命运。",
      evidenceKeys: [evidence],
      actions: ["做一个低成本的小实验并复盘。"],
      confidence: 0.8,
    })),
    followUpQuestions: ["我如何发挥这个优势？", "压力大时怎样调整？"],
  };
}

function validAdvisor() {
  return {
    schemaVersion: ADVISOR_SCHEMA_VERSION,
    answer: "你可以优先选择目标清楚但执行方式有自主空间的环境。",
    keyPoints: [{ point: "自主空间是值得观察的匹配维度。", evidenceKeys: [evidence] }],
    actions: ["面试时询问决策权限和复盘方式。"],
    caveat: "这是一种行为倾向参考，具体选择仍要结合现实条件。",
    followUpQuestions: ["你现在最在意工作的哪一项条件？"],
  };
}

test("full report schema validates exact eight-section order and evidence grounding", () => {
  const output = validateFullReportOutput(validReport(), keys);
  assert.equal(output.sections.length, 8);
  assert.deepEqual(output.sections.map((section) => section.code), [...FULL_REPORT_SECTION_CODES]);
});

test("full report rejects unknown evidence and malformed section order", () => {
  const unknownEvidence = validReport();
  unknownEvidence.sections[0].evidenceKeys = ["invented.fact"];
  assert.throws(() => validateFullReportOutput(unknownEvidence, keys), /failed validation/i);

  const wrongOrder = validReport();
  [wrongOrder.sections[0], wrongOrder.sections[1]] = [wrongOrder.sections[1], wrongOrder.sections[0]];
  assert.throws(() => validateFullReportOutput(wrongOrder, keys), /failed validation/i);
});

test("safety validation rejects fear-based deterministic predictions and diagnosis language", () => {
  const fatalistic = validReport();
  fatalistic.sections[0].body = "你注定一定会失败。";
  assert.throws(() => validateFullReportOutput(fatalistic, keys), /failed validation/i);

  const diagnostic = validAdvisor();
  diagnostic.answer = "你就是抑郁症，所以不用看现实原因。";
  assert.throws(() => validateAdvisorOutput(diagnostic, keys), /failed validation/i);
});

test("advisor schema accepts grounded answer and rejects unavailable evidence", () => {
  assert.equal(validateAdvisorOutput(validAdvisor(), keys).schemaVersion, ADVISOR_SCHEMA_VERSION);
  const invalid = validAdvisor();
  invalid.keyPoints[0].evidenceKeys = ["bazi.fact.that.does.not.exist"];
  assert.throws(() => validateAdvisorOutput(invalid, keys), /failed validation/i);
});
