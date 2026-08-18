import assert from "node:assert/strict";
import test from "node:test";

import {
  ADVISOR_REQUEST_RELEASE_REASONS,
  ADVISOR_REQUEST_STATES,
  CREDIT_LEDGER_ENTRY_TYPES,
  CREDIT_LEDGER_REASONS,
  CREDIT_LEDGER_REFERENCE_TYPES,
  PRODUCT_CODES,
  REPORT_ENTITLEMENT_STATUSES,
} from "../../types/domain/billing.ts";
import type {
  AdvisorRequest,
  CreditLedgerFactInput,
  Purchase,
  ReportEntitlement,
} from "../../types/domain/billing.ts";

const now = "2026-08-18T06:45:00.000Z";

test("billing contract freezes serialized vocabularies", () => {
  assert.deepEqual(PRODUCT_CODES, ["personality_report", "advisor_10"]);
  assert.deepEqual(ADVISOR_REQUEST_STATES, [
    "reserved",
    "committed",
    "released",
  ]);
  assert.deepEqual(CREDIT_LEDGER_ENTRY_TYPES, [
    "purchase",
    "usage",
    "refund",
    "adjustment",
    "bonus",
  ]);
  assert.deepEqual(CREDIT_LEDGER_REASONS, [
    "purchase_grant",
    "advisor_usage",
    "refund_reversal",
    "manual_adjustment",
    "promo_bonus",
  ]);
  assert.deepEqual(CREDIT_LEDGER_REFERENCE_TYPES, [
    "purchase",
    "advisor_request",
    "order",
    "ledger_entry",
    "manual_adjustment",
    "promotion",
  ]);
  assert.deepEqual(REPORT_ENTITLEMENT_STATUSES, ["active", "revoked"]);
  assert.deepEqual(ADVISOR_REQUEST_RELEASE_REASONS, [
    "provider_error",
    "timeout",
    "invalid_output",
    "server_error",
    "reservation_expired",
  ]);
});

test("report purchase and entitlement use a concrete resource identity", () => {
  const purchase = {
    id: "purchase-1",
    userId: "user-1",
    orderId: "order-1",
    productCode: "personality_report",
    resourceId: "report-1",
    quantity: 1,
    currency: "MYR",
    unitAmountMinor: 600,
    createdAt: now,
  } satisfies Purchase;

  const entitlement = {
    id: "entitlement-1",
    userId: "user-1",
    productCode: "personality_report",
    resourceId: purchase.resourceId,
    sourcePurchaseId: purchase.id,
    status: "active",
    grantedAt: now,
    updatedAt: now,
  } satisfies ReportEntitlement;

  assert.equal(purchase.resourceId, entitlement.resourceId);
  assert.equal(entitlement.status, "active");
});

test("advisor request state is a durable reservation aggregate", () => {
  const request = {
    id: "advisor-request-1",
    userId: "user-1",
    conversationId: "conversation-1",
    userMessageId: "message-user-1",
    assistantMessageId: "message-assistant-1",
    creditsReserved: 1,
    idempotencyKey: "advisor:user-1:request-1",
    reservationExpiresAt: "2026-08-18T06:50:00.000Z",
    state: "committed",
    commitLedgerEntryId: "ledger-1",
    committedAt: now,
    createdAt: now,
    updatedAt: now,
  } satisfies AdvisorRequest;

  assert.equal(request.creditsReserved, 1);
  assert.equal(request.state, "committed");
});

test("new ledger facts require reason and generic reference identity", () => {
  const ledgerFact = {
    userId: "user-1",
    delta: -1,
    type: "usage",
    reason: "advisor_usage",
    referenceType: "advisor_request",
    referenceId: "advisor-request-1",
    idempotencyKey: "advisor_request:advisor-request-1:commit",
  } satisfies CreditLedgerFactInput;

  assert.equal(ledgerFact.reason, "advisor_usage");
  assert.equal(ledgerFact.referenceType, "advisor_request");
  assert.equal(ledgerFact.delta, -1);
});
