import type { CurrencyCode, ISODateTime, JsonValue, UUID } from "./common";

export type CreditLedgerEntryType = "purchase" | "usage" | "refund" | "adjustment" | "bonus";

export interface Wallet {
  userId: UUID;
  advisorCredits: number;
  lifetimeCreditsPurchased: number;
  version: number;
  updatedAt: ISODateTime;
}

export interface CreditLedgerEntry {
  id: UUID;
  userId: UUID;
  delta: number;
  balanceAfter: number;
  type: CreditLedgerEntryType;
  idempotencyKey: string;
  orderId?: UUID;
  messageId?: UUID;
  metadata?: JsonValue;
  createdAt: ISODateTime;
}

export type ProductCode = "personality_report" | "advisor_10";
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
