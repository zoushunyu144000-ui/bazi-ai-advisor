import type { CurrencyCode, ISODateTime, JsonValue, UUID } from "./common";

export const CREDIT_LEDGER_ENTRY_TYPES = [
  "purchase",
  "usage",
  "refund",
  "adjustment",
  "bonus",
] as const;

export type CreditLedgerEntryType = (typeof CREDIT_LEDGER_ENTRY_TYPES)[number];

export const CREDIT_LEDGER_REASONS = [
  "purchase_grant",
  "advisor_usage",
  "refund_reversal",
  "manual_adjustment",
  "promo_bonus",
] as const;

export type CreditLedgerReason = (typeof CREDIT_LEDGER_REASONS)[number];

export const CREDIT_LEDGER_REFERENCE_TYPES = [
  "purchase",
  "advisor_request",
  "order",
  "ledger_entry",
  "manual_adjustment",
  "promotion",
] as const;

export type CreditLedgerReferenceType =
  (typeof CREDIT_LEDGER_REFERENCE_TYPES)[number];

export interface Wallet {
  userId: UUID;
  advisorCredits: number;
  lifetimeCreditsPurchased: number;
  version: number;
  updatedAt: ISODateTime;
}

/**
 * Read model for the immutable credit fact stream.
 *
 * reason/reference fields are optional only while the Wave 2 database migration
 * upgrades existing rows and repository mappers. All new production writes must
 * use CreditLedgerFactInput, where these fields are required.
 */
export interface CreditLedgerEntry {
  id: UUID;
  userId: UUID;
  delta: number;
  balanceAfter: number;
  type: CreditLedgerEntryType;
  reason?: CreditLedgerReason;
  referenceType?: CreditLedgerReferenceType;
  referenceId?: string;
  idempotencyKey: string;
  /** @deprecated Use referenceType/referenceId after the Wave 2 billing migration. */
  orderId?: UUID;
  /** @deprecated Use referenceType/referenceId after the Wave 2 billing migration. */
  messageId?: UUID;
  metadata?: JsonValue;
  createdAt: ISODateTime;
}

/** Required vocabulary for every new committed ledger fact. */
export interface CreditLedgerFactInput {
  userId: UUID;
  delta: number;
  type: CreditLedgerEntryType;
  reason: CreditLedgerReason;
  referenceType: CreditLedgerReferenceType;
  referenceId: string;
  idempotencyKey: string;
  metadata?: JsonValue;
}

export const PRODUCT_CODES = ["personality_report", "advisor_10"] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "expired";

export interface Order {
  id: UUID;
  userId: UUID;
  productCode: ProductCode;
  status: OrderStatus;
  provider: string;
  providerOrderId?: string;
  currency: CurrencyCode;
  amountMinor: number;
  creditsGranted: number;
  idempotencyKey: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface PurchaseBase {
  id: UUID;
  userId: UUID;
  orderId: UUID;
  productCode: ProductCode;
  quantity: number;
  currency: CurrencyCode;
  unitAmountMinor: number;
  createdAt: ISODateTime;
}

export interface ReportPurchase extends PurchaseBase {
  productCode: "personality_report";
  resourceId: UUID;
}

export interface AdvisorCreditPurchase extends PurchaseBase {
  productCode: "advisor_10";
  resourceId?: never;
}

/** Historical acquisition/read model. Report access is gated by ReportEntitlement. */
export type Purchase = ReportPurchase | AdvisorCreditPurchase;

export const REPORT_ENTITLEMENT_STATUSES = ["active", "revoked"] as const;
export type ReportEntitlementStatus =
  (typeof REPORT_ENTITLEMENT_STATUSES)[number];

export interface ReportEntitlement {
  id: UUID;
  userId: UUID;
  productCode: "personality_report";
  resourceId: UUID;
  sourcePurchaseId: UUID;
  status: ReportEntitlementStatus;
  grantedAt: ISODateTime;
  revokedAt?: ISODateTime;
  updatedAt: ISODateTime;
}

export const ADVISOR_REQUEST_STATES = [
  "reserved",
  "committed",
  "released",
] as const;

export type AdvisorRequestState = (typeof ADVISOR_REQUEST_STATES)[number];

export const ADVISOR_REQUEST_RELEASE_REASONS = [
  "provider_error",
  "timeout",
  "invalid_output",
  "server_error",
  "reservation_expired",
] as const;

export type AdvisorRequestReleaseReason =
  (typeof ADVISOR_REQUEST_RELEASE_REASONS)[number];

interface AdvisorRequestBase {
  id: UUID;
  userId: UUID;
  conversationId: UUID;
  userMessageId: UUID;
  creditsReserved: 1;
  idempotencyKey: string;
  reservationExpiresAt: ISODateTime;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ReservedAdvisorRequest extends AdvisorRequestBase {
  state: "reserved";
  assistantMessageId?: UUID;
}

export interface CommittedAdvisorRequest extends AdvisorRequestBase {
  state: "committed";
  assistantMessageId: UUID;
  commitLedgerEntryId: UUID;
  committedAt: ISODateTime;
}

export interface ReleasedAdvisorRequest extends AdvisorRequestBase {
  state: "released";
  assistantMessageId?: UUID;
  releaseReason: AdvisorRequestReleaseReason;
  releasedAt: ISODateTime;
}

/**
 * Durable idempotency aggregate for one billable Advisor attempt.
 * Reservation is not itself a ledger debit; only committed requests consume credit.
 */
export type AdvisorRequest =
  | ReservedAdvisorRequest
  | CommittedAdvisorRequest
  | ReleasedAdvisorRequest;
