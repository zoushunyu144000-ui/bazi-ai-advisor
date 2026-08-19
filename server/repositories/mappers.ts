import type {
  AdvisorRequest,
  BaziChart,
  BaziDerivedFeatures,
  BirthProfile,
  Conversation,
  ConversationMessage,
  CreditLedgerEntry,
  Order,
  PersonalityProfile,
  Purchase,
  Report,
  ReportEntitlement,
  ReportSection,
  UserMemory,
  Wallet,
} from "@/types/domain";

import type { UserProfile } from "./models";
import type {
  AdvisorRequestRow,
  BirthProfileRow,
  ChartRow,
  ConversationRow,
  DerivedFeatureRow,
  LedgerRow,
  MemoryRow,
  MessageRow,
  OrderRow,
  ProfileRow,
  PurchaseRow,
  ReportEntitlementRow,
  ReportRow,
  WalletRow,
} from "./rows";

function toOptional<T>(value: T | null): T | undefined {
  return value ?? undefined;
}

function toNumber(value: number | string | null, field: string): number {
  if (value === null) {
    throw new Error(`${field} is required.`);
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${field} is not a finite number.`);
  }

  return parsed;
}

function toSafeInteger(value: number | string, field: string): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${field} exceeds JavaScript safe integer range.`);
  }

  return parsed;
}

export function mapProfileRow(row: ProfileRow): UserProfile {
  return {
    userId: row.user_id,
    displayName: toOptional(row.display_name),
    avatarUrl: toOptional(row.avatar_url),
    countryCode: toOptional(row.country_code),
    marketingConsent: row.marketing_consent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapBirthProfileRow(row: BirthProfileRow): BirthProfile {
  const hasCoordinates = row.latitude !== null && row.longitude !== null;
  const hasPlace =
    row.place_name !== null || row.country_code !== null || hasCoordinates;

  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    calendar: row.calendar_type,
    birthDate: row.birth_date,
    birthTime: row.birth_time,
    birthTimePrecision: row.birth_time_precision,
    timezone: row.timezone,
    ...(row.resolved_birth_instant !== null
      ? { resolvedBirthInstant: row.resolved_birth_instant }
      : {}),
    ...(row.utc_offset_minutes_at_birth !== null
      ? { utcOffsetMinutesAtBirth: row.utc_offset_minutes_at_birth }
      : {}),
    ...(hasPlace
      ? {
          birthPlace: {
            ...(row.place_name
              ? { label: row.place_name, locality: row.place_name }
              : {}),
            ...(row.country_code ? { countryCode: row.country_code } : {}),
            ...(hasCoordinates
              ? {
                  coordinates: {
                    latitude: toNumber(row.latitude, "latitude"),
                    longitude: toNumber(row.longitude, "longitude"),
                  },
                }
              : {}),
          },
        }
      : {}),
    sexForTraditionalRules: row.sex_for_traditional_rules,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapChartRow(row: ChartRow): BaziChart {
  const chart = row.chart as unknown as BaziChart;

  return {
    ...chart,
    id: row.id,
    birthProfileId: row.birth_profile_id,
  };
}

export function mapDerivedFeatureRow(
  row: DerivedFeatureRow,
): BaziDerivedFeatures {
  const features = row.features as unknown as BaziDerivedFeatures;

  return {
    ...features,
    id: row.id,
    chartId: row.chart_id,
    engine_version: row.engine_version,
    rule_profile_version: row.rule_profile_version,
    mapping_version: row.mapping_version,
  };
}

export function mapReportRow(row: ReportRow): Report {
  const personalityProfile =
    row.personality_profile as unknown as PersonalityProfile;
  const sections = Array.isArray(row.content)
    ? (row.content as unknown as ReportSection[])
    : [];

  return {
    id: row.id,
    userId: row.user_id,
    chartId: row.chart_id,
    derivedFeaturesId: row.derived_features_id,
    tier: row.tier,
    status: row.status,
    personalityProfile,
    sections,
    engine_version: row.engine_version,
    rule_profile_version: row.rule_profile_version,
    mapping_version: row.mapping_version,
    prompt_version: row.prompt_version,
    report_schema_version: row.report_schema_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapConversationRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    userId: row.user_id,
    reportId: toOptional(row.report_id),
    title: toOptional(row.title),
    status: row.status,
    modelProvider: toOptional(row.model_provider),
    modelName: toOptional(row.model_name),
    prompt_version: row.prompt_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessageRow(row: MessageRow): ConversationMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    userId: row.user_id,
    role: row.role,
    content: row.content,
    structuredPayload: toOptional(row.structured_payload),
    prompt_version: toOptional(row.prompt_version),
    creditCost: row.credit_cost,
    createdAt: row.created_at,
  };
}

export function mapMemoryRow(row: MemoryRow): UserMemory {
  return {
    id: row.id,
    userId: row.user_id,
    conversationId: toOptional(row.conversation_id),
    sourceMessageId: toOptional(row.source_message_id),
    key: row.memory_key,
    kind: row.memory_type,
    value: row.value,
    confidence: toNumber(row.confidence, "confidence"),
    userEditable: row.is_user_editable,
    active: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWalletRow(row: WalletRow): Wallet {
  return {
    userId: row.user_id,
    advisorCredits: row.advisor_credits,
    lifetimeCreditsPurchased: row.lifetime_credits_purchased,
    version: row.version,
    updatedAt: row.updated_at,
  };
}

export function mapLedgerRow(row: LedgerRow): CreditLedgerEntry {
  return {
    id: row.id,
    userId: row.user_id,
    delta: row.delta,
    balanceAfter: row.balance_after,
    type: row.entry_type,
    reason: row.reason,
    referenceType: row.reference_type,
    referenceId: row.reference_id,
    idempotencyKey: row.idempotency_key,
    orderId: toOptional(row.order_id),
    messageId: toOptional(row.message_id),
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

export function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    productCode: row.product_code,
    status: row.status,
    provider: row.provider,
    providerOrderId: toOptional(row.provider_order_id),
    currency: row.currency,
    amountMinor: toSafeInteger(row.amount_minor, "amount_minor"),
    creditsGranted: row.credits_granted,
    idempotencyKey: row.idempotency_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPurchaseRow(row: PurchaseRow): Purchase {
  const base = {
    id: row.id,
    userId: row.user_id,
    orderId: row.order_id,
    quantity: row.quantity,
    currency: row.currency,
    unitAmountMinor: toSafeInteger(
      row.unit_amount_minor,
      "unit_amount_minor",
    ),
    createdAt: row.created_at,
  };

  if (row.product_code === "personality_report") {
    if (row.resource_id === null) {
      throw new Error("personality_report purchase requires resource_id.");
    }

    return {
      ...base,
      productCode: "personality_report",
      resourceId: row.resource_id,
    };
  }

  if (row.resource_id !== null) {
    throw new Error("advisor_10 purchase must not have resource_id.");
  }

  return {
    ...base,
    productCode: "advisor_10",
  };
}

export function mapReportEntitlementRow(
  row: ReportEntitlementRow,
): ReportEntitlement {
  return {
    id: row.id,
    userId: row.user_id,
    productCode: "personality_report",
    resourceId: row.resource_id,
    sourcePurchaseId: row.source_purchase_id,
    status: row.status,
    grantedAt: row.granted_at,
    revokedAt: toOptional(row.revoked_at),
    updatedAt: row.updated_at,
  };
}

export function mapAdvisorRequestRow(row: AdvisorRequestRow): AdvisorRequest {
  const base = {
    id: row.id,
    userId: row.user_id,
    conversationId: row.conversation_id,
    userMessageId: row.user_message_id,
    creditsReserved: 1 as const,
    idempotencyKey: row.idempotency_key,
    reservationExpiresAt: row.reservation_expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.state === "reserved") {
    return {
      ...base,
      state: "reserved",
      assistantMessageId: toOptional(row.assistant_message_id),
    };
  }

  if (row.state === "committed") {
    if (
      row.assistant_message_id === null ||
      row.commit_ledger_entry_id === null ||
      row.committed_at === null
    ) {
      throw new Error("committed advisor request is missing commit fields.");
    }

    return {
      ...base,
      state: "committed",
      assistantMessageId: row.assistant_message_id,
      commitLedgerEntryId: row.commit_ledger_entry_id,
      committedAt: row.committed_at,
    };
  }

  if (row.release_reason === null || row.released_at === null) {
    throw new Error("released advisor request is missing release fields.");
  }

  return {
    ...base,
    state: "released",
    assistantMessageId: toOptional(row.assistant_message_id),
    releaseReason: row.release_reason,
    releasedAt: row.released_at,
  };
}
