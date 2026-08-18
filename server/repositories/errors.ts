export type RepositoryErrorCode =
  | "not_found"
  | "conflict"
  | "forbidden"
  | "validation"
  | "database";

export interface DatabaseErrorLike {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;
  readonly cause?: unknown;

  constructor(
    code: RepositoryErrorCode,
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
    this.cause = cause;
  }

  static from(error: DatabaseErrorLike, context: string): RepositoryError {
    const databaseCode = error.code ?? "";

    if (databaseCode === "PGRST116") {
      return new RepositoryError("not_found", `${context} was not found.`, error);
    }

    if (databaseCode === "23505") {
      return new RepositoryError(
        "conflict",
        `${context} conflicts with an existing record.`,
        error,
      );
    }

    if (databaseCode === "23503" || databaseCode === "23514") {
      return new RepositoryError(
        "validation",
        `${context} violates a database constraint.`,
        error,
      );
    }

    if (databaseCode === "42501") {
      return new RepositoryError(
        "forbidden",
        `Not authorized to access ${context}.`,
        error,
      );
    }

    return new RepositoryError(
      "database",
      `Database operation failed for ${context}.`,
      error,
    );
  }
}

export function throwRepositoryError(
  error: DatabaseErrorLike | null,
  context: string,
): void {
  if (error) {
    throw RepositoryError.from(error, context);
  }
}
