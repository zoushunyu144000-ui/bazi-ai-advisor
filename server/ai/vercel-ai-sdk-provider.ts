import "server-only";

import {
  generateText,
  jsonSchema,
  NoObjectGeneratedError,
  Output,
  type LanguageModel,
} from "ai";

import type {
  AIProvider,
  AIProviderDescriptor,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from "../../modules/ai/contracts";
import { AIProviderError } from "../../modules/ai/errors";

type AIJsonSchemaInput = Parameters<typeof jsonSchema>[0];

function isTimeoutError(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (current instanceof Error) {
      const text = `${current.name} ${current.message}`.toLowerCase();
      if (text.includes("timeout") || text.includes("timed out") || text.includes("abort")) {
        return true;
      }
      current = current.cause;
      continue;
    }
    break;
  }
  return false;
}

/**
 * Server-only Vercel AI SDK adapter. A configured model is injected by the
 * composition root; this module never reads or exposes provider secrets.
 */
export class VercelAISDKProvider implements AIProvider {
  constructor(
    private readonly model: LanguageModel,
    readonly descriptor: AIProviderDescriptor,
  ) {}

  async generateStructured(
    request: StructuredGenerationRequest,
  ): Promise<StructuredGenerationResult> {
    try {
      const schema = jsonSchema(request.schema as AIJsonSchemaInput);
      const result = await generateText({
        model: this.model,
        system: request.system,
        prompt: request.prompt,
        output: Output.object({
          schema,
          name: request.schemaName,
          description: request.schemaDescription,
        }),
        // 07 owns one bounded retry/repair loop so provider-internal retries are
        // disabled here; one logical attempt stays observable and predictable.
        maxRetries: 0,
        timeout: request.timeoutMs,
      });

      return {
        value: result.output,
        descriptor: this.descriptor,
      };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new AIProviderError(
          "invalid_output",
          "Provider did not produce a schema-valid structured object.",
          error,
        );
      }
      if (isTimeoutError(error)) {
        throw new AIProviderError("timeout", "AI provider request timed out.", error);
      }
      throw new AIProviderError("provider_error", "AI provider request failed.", error);
    }
  }
}
