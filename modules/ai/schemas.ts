import type {
  AdvisorAnswerOutput,
  FullPersonalityReportOutput,
  FullReportSectionOutput,
} from "./contracts";
import { AIOutputValidationError } from "./errors";

export const FULL_REPORT_PROMPT_VERSION = "ai-report/full-personality/1.0.0";
export const FULL_REPORT_SCHEMA_VERSION = "ai-report-schema/full-personality/1.0.0";
export const ADVISOR_PROMPT_VERSION = "ai-advisor/general/1.0.0";
export const ADVISOR_SCHEMA_VERSION = "ai-advisor-schema/general/1.0.0";

export const FULL_REPORT_SECTION_CODES = [
  "self_in_one_sentence",
  "core_drives",
  "personality_duality",
  "talent_manual",
  "work_study_mode",
  "relationship_pattern",
  "stuck_patterns",
  "practical_actions",
] as const;

export const FULL_REPORT_SECTION_TITLES: Record<
  (typeof FULL_REPORT_SECTION_CODES)[number],
  string
> = {
  self_in_one_sentence: "一句话认识自己",
  core_drives: "核心驱动力",
  personality_duality: "性格 AB 面",
  talent_manual: "天赋使用说明书",
  work_study_mode: "工作与学习模式",
  relationship_pattern: "成长环境与关系模式",
  stuck_patterns: "容易卡住的地方",
  practical_actions: "现实行为建议",
};

const sectionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", enum: [...FULL_REPORT_SECTION_CODES] },
    title: { type: "string", minLength: 1, maxLength: 80 },
    body: { type: "string", minLength: 1, maxLength: 5_000 },
    evidenceKeys: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: { type: "string", minLength: 1 },
    },
    actions: {
      type: "array",
      maxItems: 8,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["code", "title", "body", "evidenceKeys", "actions", "confidence"],
};

export const FULL_REPORT_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    schemaVersion: { type: "string", const: FULL_REPORT_SCHEMA_VERSION },
    sections: {
      type: "array",
      minItems: FULL_REPORT_SECTION_CODES.length,
      maxItems: FULL_REPORT_SECTION_CODES.length,
      items: sectionSchema,
    },
    followUpQuestions: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: { type: "string", minLength: 1, maxLength: 300 },
    },
  },
  required: ["schemaVersion", "sections", "followUpQuestions"],
};

export const ADVISOR_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    schemaVersion: { type: "string", const: ADVISOR_SCHEMA_VERSION },
    answer: { type: "string", minLength: 1, maxLength: 5_000 },
    keyPoints: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          point: { type: "string", minLength: 1, maxLength: 800 },
          evidenceKeys: {
            type: "array",
            minItems: 1,
            maxItems: 10,
            items: { type: "string", minLength: 1 },
          },
        },
        required: ["point", "evidenceKeys"],
      },
    },
    actions: {
      type: "array",
      maxItems: 6,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    caveat: { type: "string", minLength: 1, maxLength: 1_000 },
    followUpQuestions: {
      type: "array",
      maxItems: 4,
      items: { type: "string", minLength: 1, maxLength: 300 },
    },
  },
  required: ["schemaVersion", "answer", "keyPoints", "actions", "caveat", "followUpQuestions"],
};

const FORBIDDEN_PATTERNS: RegExp[] = [
  /你(?:注定|必然|一定会)/u,
  /(?:必有|将有|会有).{0,8}(?:大灾|血光之灾|牢狱之灾)/u,
  /(?:必死|活不过|寿命只有)/u,
  /(?:你|你就是).{0,6}(?:抑郁症|焦虑症|双相情感障碍|精神分裂症)/u,
  /you (?:are|will) definitely/iu,
  /you have (?:depression|anxiety disorder|bipolar disorder|schizophrenia)/iu,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function validateEvidenceKeys(
  evidenceKeys: unknown,
  availableEvidenceKeys: ReadonlySet<string>,
  path: string,
  issues: string[],
): evidenceKeys is string[] {
  if (!isStringArray(evidenceKeys) || evidenceKeys.length === 0) {
    issues.push(`${path} must contain at least one evidence key.`);
    return false;
  }
  for (const key of evidenceKeys) {
    if (!availableEvidenceKeys.has(key)) {
      issues.push(`${path} references unavailable evidence key: ${key}`);
    }
  }
  return true;
}

function validateSafety(text: string, path: string, issues: string[]): void {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      issues.push(`${path} contains deterministic, fear-based, or diagnostic language.`);
      return;
    }
  }
}

function validateReportSection(
  value: unknown,
  expectedCode: string,
  availableEvidenceKeys: ReadonlySet<string>,
  index: number,
  issues: string[],
): value is FullReportSectionOutput {
  if (!isRecord(value)) {
    issues.push(`sections[${index}] must be an object.`);
    return false;
  }
  if (value.code !== expectedCode) issues.push(`sections[${index}].code must be ${expectedCode}.`);
  if (typeof value.title !== "string" || !value.title.trim()) issues.push(`sections[${index}].title is required.`);
  if (typeof value.body !== "string" || !value.body.trim()) issues.push(`sections[${index}].body is required.`);
  else validateSafety(value.body, `sections[${index}].body`, issues);
  validateEvidenceKeys(value.evidenceKeys, availableEvidenceKeys, `sections[${index}].evidenceKeys`, issues);
  if (!isStringArray(value.actions) && !(Array.isArray(value.actions) && value.actions.length === 0)) {
    issues.push(`sections[${index}].actions must be a string array.`);
  }
  if (typeof value.confidence !== "number" || value.confidence < 0 || value.confidence > 1) {
    issues.push(`sections[${index}].confidence must be between 0 and 1.`);
  }
  return true;
}

export function validateFullReportOutput(
  value: unknown,
  availableEvidenceKeys: ReadonlySet<string>,
): FullPersonalityReportOutput {
  const issues: string[] = [];
  if (!isRecord(value)) throw new AIOutputValidationError("Report output must be an object.");
  if (value.schemaVersion !== FULL_REPORT_SCHEMA_VERSION) issues.push("Report schemaVersion mismatch.");
  if (!Array.isArray(value.sections) || value.sections.length !== FULL_REPORT_SECTION_CODES.length) {
    issues.push(`Report must contain exactly ${FULL_REPORT_SECTION_CODES.length} sections.`);
  } else {
    value.sections.forEach((section, index) => {
      validateReportSection(section, FULL_REPORT_SECTION_CODES[index], availableEvidenceKeys, index, issues);
    });
  }
  if (!isStringArray(value.followUpQuestions) || value.followUpQuestions.length < 2 || value.followUpQuestions.length > 5) {
    issues.push("followUpQuestions must contain 2-5 non-empty strings.");
  }
  if (issues.length) throw new AIOutputValidationError("Full report output failed validation.", issues);
  return value as unknown as FullPersonalityReportOutput;
}

export function validateAdvisorOutput(
  value: unknown,
  availableEvidenceKeys: ReadonlySet<string>,
): AdvisorAnswerOutput {
  const issues: string[] = [];
  if (!isRecord(value)) throw new AIOutputValidationError("Advisor output must be an object.");
  if (value.schemaVersion !== ADVISOR_SCHEMA_VERSION) issues.push("Advisor schemaVersion mismatch.");
  if (typeof value.answer !== "string" || !value.answer.trim()) issues.push("Advisor answer is required.");
  else validateSafety(value.answer, "answer", issues);
  if (!Array.isArray(value.keyPoints) || value.keyPoints.length < 1 || value.keyPoints.length > 6) {
    issues.push("keyPoints must contain 1-6 items.");
  } else {
    value.keyPoints.forEach((item, index) => {
      if (!isRecord(item)) {
        issues.push(`keyPoints[${index}] must be an object.`);
        return;
      }
      if (typeof item.point !== "string" || !item.point.trim()) issues.push(`keyPoints[${index}].point is required.`);
      else validateSafety(item.point, `keyPoints[${index}].point`, issues);
      validateEvidenceKeys(item.evidenceKeys, availableEvidenceKeys, `keyPoints[${index}].evidenceKeys`, issues);
    });
  }
  if (!isStringArray(value.actions) && !(Array.isArray(value.actions) && value.actions.length === 0)) {
    issues.push("actions must be a string array.");
  }
  if (typeof value.caveat !== "string" || !value.caveat.trim()) issues.push("caveat is required.");
  else validateSafety(value.caveat, "caveat", issues);
  if (!isStringArray(value.followUpQuestions) && !(Array.isArray(value.followUpQuestions) && value.followUpQuestions.length === 0)) {
    issues.push("followUpQuestions must be a string array.");
  }
  if (issues.length) throw new AIOutputValidationError("Advisor output failed validation.", issues);
  return value as unknown as AdvisorAnswerOutput;
}
