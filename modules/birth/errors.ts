export type BirthNormalizationErrorCode =
  | "INVALID_BIRTH_DATE"
  | "INVALID_BIRTH_TIME"
  | "INVALID_TIME_PRECISION"
  | "INVALID_TRADITIONAL_RULE_SEX"
  | "INVALID_UUID"
  | "INVALID_LOCATION_QUERY"
  | "BIRTH_DATE_IN_FUTURE"
  | "LOCATION_NOT_FOUND"
  | "LOCATION_AMBIGUOUS"
  | "LOCATION_SELECTION_NOT_FOUND"
  | "INVALID_LOCATION_RESULT"
  | "TIMEZONE_NOT_FOUND"
  | "INVALID_TIMEZONE"
  | "AMBIGUOUS_LOCAL_TIME"
  | "NONEXISTENT_LOCAL_TIME"
  | "TIMEZONE_RESOLUTION_FAILED";

export class BirthNormalizationError extends Error {
  readonly code: BirthNormalizationErrorCode;
  readonly field?: string;
  readonly details?: Record<string, unknown>;

  constructor(
    code: BirthNormalizationErrorCode,
    message: string,
    options: { field?: string; details?: Record<string, unknown>; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "BirthNormalizationError";
    this.code = code;
    this.field = options.field;
    this.details = options.details;
  }
}
