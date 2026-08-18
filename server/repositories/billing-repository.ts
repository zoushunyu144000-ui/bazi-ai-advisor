import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdvisorRequest,
  AdvisorRequestReleaseReason,
  JsonValue,
  Purchase,
  ReportEntitlement,
  Wallet,
} from "@/types/domain";

import { throwRepositoryError } from "./errors";
import {
  mapAdvisorRequestRow,
  mapPurchaseRow,
  mapReportEntitlementRow,
  mapWalletRow,
} from "./mappers";
import type {
  AdvisorRequestRow,
  PaymentProviderEventRow,
  PaymentProviderEventStatus,
  PurchaseRow,
  ReportEntitlementRow,
  WalletRow,
} from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface PaymentProviderEvent {
  id: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  status: PaymentProviderEventStatus;
  orderId?: string;
  normalizedPayload: JsonValue;
  receivedAt: string;
  verifiedAt?: string;
  processedAt?: string;
  failedAt?: string;
  retryCount: number;
  lastError?: string;
  updatedAt: string;
}

export interface RecordProviderEventInput {
  provider: string;
  providerEventId: string;
  eventType: string;
  normalizedPayload?: JsonValue;
}

export interface ReserveAdvisorCreditInput {
  userId: string;
  conversationId: string;
  userMessageId: string;
  idempotencyKey: string;
  reservationExpiresAt: string;
}

function firstRpcRow<T>(data: unknown, context: string): T {
  const value = Array.isArray(data) ? data[0] : data;
  if (!value || typeof value !== "object") {
    throw new Error(`${context} returned no row.`);
  }
  return value as T;
}

function mapPaymentProviderEventRow(
  row: PaymentProviderEventRow,
): PaymentProviderEvent {
  return {
    id: row.id,
    provider: row.provider,
    providerEventId: row.provider_event_id,
    eventType: row.event_type,
    status: row.status,
    ...(row.order_id ? { orderId: row.order_id } : {}),
    normalizedPayload: row.normalized_payload,
    receivedAt: row.received_at,
    ...(row.verified_at ? { verifiedAt: row.verified_at } : {}),
    ...(row.processed_at ? { processedAt: row.processed_at } : {}),
    ...(row.failed_at ? { failedAt: row.failed_at } : {}),
    retryCount: row.retry_count,
    ...(row.last_error ? { lastError: row.last_error } : {}),
    updatedAt: row.updated_at,
  };
}

export class BillingReadRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async listReportEntitlements(): Promise<ReportEntitlement[]> {
    const { data, error } = await this.client
      .from("report_entitlements")
      .select("*")
      .eq("user_id", this.userId)
      .order("updated_at", { ascending: false });

    throwRepositoryError(error, "report entitlements");
    return ((data ?? []) as ReportEntitlementRow[]).map(
      mapReportEntitlementRow,
    );
  }

  async getReportEntitlement(resourceId: string): Promise<ReportEntitlement> {
    const { data, error } = await this.client
      .from("report_entitlements")
      .select("*")
      .eq("user_id", this.userId)
      .eq("product_code", "personality_report")
      .eq("resource_id", resourceId)
      .single();

    throwRepositoryError(error, "report entitlement");
    return mapReportEntitlementRow(data as ReportEntitlementRow);
  }

  async listAdvisorRequests(limit = 100): Promise<AdvisorRequest[]> {
    const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 500);
    const { data, error } = await this.client
      .from("advisor_requests")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    throwRepositoryError(error, "advisor requests");
    return ((data ?? []) as AdvisorRequestRow[]).map(mapAdvisorRequestRow);
  }

  async getAdvisorRequest(id: string): Promise<AdvisorRequest> {
    const { data, error } = await this.client
      .from("advisor_requests")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "advisor request");
    return mapAdvisorRequestRow(data as AdvisorRequestRow);
  }
}

/**
 * Trusted billing write boundary. Construct this only with the server secret /
 * service-role Supabase client. Database EXECUTE grants reject anon/authenticated
 * callers even if this class is accidentally reached from an untrusted context.
 */
export class TrustedBillingRepository {
  constructor(private readonly client: SupabaseClient) {}

  async recordProviderEvent(
    input: RecordProviderEventInput,
  ): Promise<PaymentProviderEvent> {
    const { data, error } = await this.client.rpc(
      "record_payment_provider_event",
      {
        p_provider: input.provider,
        p_provider_event_id: input.providerEventId,
        p_event_type: input.eventType,
        p_normalized_payload: input.normalizedPayload ?? {},
      },
    );

    throwRepositoryError(error, "record provider event");
    return mapPaymentProviderEventRow(
      firstRpcRow<PaymentProviderEventRow>(data, "record provider event"),
    );
  }

  async markProviderEventVerified(
    provider: string,
    providerEventId: string,
  ): Promise<PaymentProviderEvent> {
    const { data, error } = await this.client.rpc(
      "mark_payment_provider_event_verified",
      {
        p_provider: provider,
        p_provider_event_id: providerEventId,
      },
    );

    throwRepositoryError(error, "verify provider event");
    return mapPaymentProviderEventRow(
      firstRpcRow<PaymentProviderEventRow>(data, "verify provider event"),
    );
  }

  async markProviderEventFailed(
    provider: string,
    providerEventId: string,
    message: string,
  ): Promise<PaymentProviderEvent> {
    const { data, error } = await this.client.rpc(
      "mark_payment_provider_event_failed",
      {
        p_provider: provider,
        p_provider_event_id: providerEventId,
        p_error: message,
      },
    );

    throwRepositoryError(error, "fail provider event");
    return mapPaymentProviderEventRow(
      firstRpcRow<PaymentProviderEventRow>(data, "fail provider event"),
    );
  }

  async fulfillVerifiedPaymentEvent(
    provider: string,
    providerEventId: string,
    orderId: string,
  ): Promise<Purchase> {
    const { data, error } = await this.client.rpc(
      "fulfill_verified_payment_event",
      {
        p_provider: provider,
        p_provider_event_id: providerEventId,
        p_order_id: orderId,
      },
    );

    throwRepositoryError(error, "fulfill verified payment event");
    return mapPurchaseRow(
      firstRpcRow<PurchaseRow>(data, "fulfill verified payment event"),
    );
  }

  async grantAdvisorCredits(
    userId: string,
    purchaseId: string,
  ): Promise<Wallet> {
    const { data, error } = await this.client.rpc("grant_advisor_credits", {
      p_user_id: userId,
      p_purchase_id: purchaseId,
    });

    throwRepositoryError(error, "grant advisor credits");
    return mapWalletRow(firstRpcRow<WalletRow>(data, "grant advisor credits"));
  }

  async reserveAdvisorCredit(
    input: ReserveAdvisorCreditInput,
  ): Promise<AdvisorRequest> {
    const { data, error } = await this.client.rpc("reserve_advisor_credit", {
      p_user_id: input.userId,
      p_conversation_id: input.conversationId,
      p_user_message_id: input.userMessageId,
      p_idempotency_key: input.idempotencyKey,
      p_reservation_expires_at: input.reservationExpiresAt,
    });

    throwRepositoryError(error, "reserve advisor credit");
    return mapAdvisorRequestRow(
      firstRpcRow<AdvisorRequestRow>(data, "reserve advisor credit"),
    );
  }

  async commitAdvisorCredit(
    userId: string,
    advisorRequestId: string,
    assistantMessageId: string,
  ): Promise<AdvisorRequest> {
    const { data, error } = await this.client.rpc("commit_advisor_credit", {
      p_user_id: userId,
      p_advisor_request_id: advisorRequestId,
      p_assistant_message_id: assistantMessageId,
    });

    throwRepositoryError(error, "commit advisor credit");
    return mapAdvisorRequestRow(
      firstRpcRow<AdvisorRequestRow>(data, "commit advisor credit"),
    );
  }

  async releaseAdvisorCredit(
    userId: string,
    advisorRequestId: string,
    reason: AdvisorRequestReleaseReason,
  ): Promise<AdvisorRequest> {
    const { data, error } = await this.client.rpc("release_advisor_credit", {
      p_user_id: userId,
      p_advisor_request_id: advisorRequestId,
      p_release_reason: reason,
    });

    throwRepositoryError(error, "release advisor credit");
    return mapAdvisorRequestRow(
      firstRpcRow<AdvisorRequestRow>(data, "release advisor credit"),
    );
  }

  async grantReportEntitlement(
    userId: string,
    purchaseId: string,
  ): Promise<ReportEntitlement> {
    const { data, error } = await this.client.rpc(
      "grant_report_entitlement",
      {
        p_user_id: userId,
        p_purchase_id: purchaseId,
      },
    );

    throwRepositoryError(error, "grant report entitlement");
    return mapReportEntitlementRow(
      firstRpcRow<ReportEntitlementRow>(data, "grant report entitlement"),
    );
  }

  async revokeReportEntitlement(
    userId: string,
    resourceId: string,
  ): Promise<ReportEntitlement> {
    const { data, error } = await this.client.rpc(
      "revoke_report_entitlement",
      {
        p_user_id: userId,
        p_resource_id: resourceId,
      },
    );

    throwRepositoryError(error, "revoke report entitlement");
    return mapReportEntitlementRow(
      firstRpcRow<ReportEntitlementRow>(data, "revoke report entitlement"),
    );
  }
}
