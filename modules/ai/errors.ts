import type { AIProviderErrorKind } from "./contracts";

export class AIProviderError extends Error {
  constructor(
    readonly kind: AIProviderErrorKind,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export class AIOutputValidationError extends Error {
  constructor(
    message: string,
    readonly issues: string[] = [message],
  ) {
    super(message);
    this.name = "AIOutputValidationError";
  }
}

export class AIContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIContractError";
  }
}
