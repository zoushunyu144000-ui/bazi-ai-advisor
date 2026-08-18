import type {
  AIProvider,
  StructuredGenerationRequest,
  StructuredGenerationResult,
} from "./contracts";
import { AIOutputValidationError, AIProviderError } from "./errors";
import { buildRepairPrompt } from "./prompts";

export interface GenerateValidatedInput<T> {
  provider: AIProvider;
  request: StructuredGenerationRequest;
  validate(value: unknown): T;
  maxAttempts?: number;
}

export interface GenerateValidatedResult<T> {
  output: T;
  providerResult: StructuredGenerationResult;
  attempts: number;
}

export async function generateValidated<T>(
  input: GenerateValidatedInput<T>,
): Promise<GenerateValidatedResult<T>> {
  const maxAttempts = input.maxAttempts ?? 2;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) {
    throw new Error("maxAttempts must be an integer between 1 and 3.");
  }

  let prompt = input.request.prompt;
  let lastError: unknown;
  let previousValue: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const providerResult = await input.provider.generateStructured({
        ...input.request,
        prompt,
      });
      previousValue = providerResult.value;
      try {
        const output = input.validate(providerResult.value);
        return { output, providerResult, attempts: attempt };
      } catch (error) {
        if (!(error instanceof AIOutputValidationError)) throw error;
        lastError = error;
        if (attempt < maxAttempts) {
          prompt = buildRepairPrompt(input.request.prompt, error.issues, previousValue);
          continue;
        }
      }
    } catch (error) {
      if (!(error instanceof AIProviderError)) throw error;
      lastError = error;
      if (attempt < maxAttempts) {
        const issues = [
          error.kind === "invalid_output"
            ? "Provider-level structured output validation failed."
            : `Generation attempt failed with ${error.kind}; regenerate the same schema without changing facts.`,
        ];
        prompt = buildRepairPrompt(input.request.prompt, issues, previousValue);
        continue;
      }
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new AIOutputValidationError("Structured generation failed without a valid output.");
}
