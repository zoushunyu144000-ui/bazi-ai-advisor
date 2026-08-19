const MAX_CONVERSATION_SUMMARY_CHARS = 2_000;
const MAX_SUMMARY_SEGMENT_CHARS = 700;

function clamp(value: string, maxChars: number): string {
  const normalized = value.trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 1)}…`;
}

/**
 * V1 uses a bounded deterministic running summary. This avoids a second LLM
 * call and, more importantly, prevents unlimited message history from becoming
 * prompt context. It is not a canonical Bazi fact and may be regenerated.
 */
export function updateConversationSummary(
  previousSummary: string | undefined,
  question: string,
  answer: string,
): string {
  const segment = `用户：${clamp(question, MAX_SUMMARY_SEGMENT_CHARS)}\n顾问：${clamp(answer, MAX_SUMMARY_SEGMENT_CHARS)}`;
  const combined = previousSummary?.trim()
    ? `${previousSummary.trim()}\n\n${segment}`
    : segment;
  if (combined.length <= MAX_CONVERSATION_SUMMARY_CHARS) return combined;
  return combined.slice(-MAX_CONVERSATION_SUMMARY_CHARS);
}
