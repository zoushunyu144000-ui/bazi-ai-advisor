import type {
  AdvisorRequestReleaseReason,
  AdvisorRequestState,
  CreditLedgerEntryType,
  CreditLedgerReason,
  CreditLedgerReferenceType,
  JsonValue,
  OrderStatus,
  ProductCode,
  ReportEntitlementStatus,
} from "@/types/domain";

export interface ProfileRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  country_code: string | null;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface BirthProfileRow {
  id: string;
  user_id: string;
  label: string;
  calendar_type: "gregorian";
  birth_date: string;
  birth_time: string | null;
  birth_time_precision: "exact" | "approximate" | "unknown";
  timezone: string;
  resolved_birth_instant: string | null;
  utc_offset_minutes_at_birth: number | null;
  place_name: string | null;
  country_code: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  sex_for_traditional_rules: "male" | "female" | "unspecified";
  input_payload: JsonValue;
  created_at: string;
  updated_at: string;
}

export interface ChartRow {
  id: string;
  user_id: string;
  birth_profile_id: string;
  chart: JsonValue;
  calculation_metadata: JsonValue;
  relations: JsonValue;
  luck: JsonValue;
  engine_version: string;
  rule_profile_version: string;
  created_at: string;
}

export interface DerivedFeatureRow {
  id: string;
  user_id: string;
  chart_id: string;
  features: JsonValue;
  engine_version: string;
  rule_profile_version: string;
  mapping_version: string;
  created_at: string;
}

export interface ReportRow {
  id: string;
  user_id: string;
  chart_id: string;
  derived_features_id: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  status: "draft" | "ready" | "failed";
  title: string | null;
  personality_profile: JsonValue;
  content: JsonValue;
  engine_version: string;
  rule_profile_version: string;
  mapping_version: string;
  prompt_version: string;
  report_schema_version: string;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  report_id: string | null;
  title: string | null;
  status: "active" | "archived";
  model_provider: string | null;
  model_name: string | null;
  prompt_version: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  structured_payload: JsonValue | null;
  model_provider: string | null;
  model_name: string | null;
  prompt_version: string | null;
  credit_cost: number;
  created_at: string;
}

export interface MemoryRow {
  id: string;
  user_id: string;
  conversation_id: string | null;
  source_message_id: string | null;
  memory_key: string;
  memory_type: "preference" | "goal" | "constraint" | "fact" | "advisor_note";
  value: JsonValue;
  confidence: number | string;
  is_user_editable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletRow {
  user_id: string;
  advisor_credits: number;
  lifetime_credits_purchased: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface LedgerRow {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  entry_type: CreditLedgerEntryType;
  reason: CreditLedgerReason;
  reference_type: CreditLedgerReferenceType;
  reference_id: string;
  idempotency_key: string;
  order_id: string | null;
  message_id: string | null;
  metadata: JsonValue;
  created_at: string;
}

export interface OrderRow {
  id: string;
  user_id: string;
  product_code: ProductCode;
  status: OrderStatus;
  provider: string;
  provider_order_id: string | null;
  currency: string;
  amount_minor: number | string;
  credits_granted: number;
  report_id: string | null;
  idempotency_key: string;
  created_at: string;
  paid_at: string | null;
  updated_at: string;
}

export interface PurchaseRow {
  id: string;
  user_id: string;
  order_id: string;
  product_code: ProductCode;
  quantity: number;
  currency: string;
  unit_amount_minor: number | string;
  resource_id: string | null;
  entitlement: JsonValue;
  created_at: string;
}

export interface ReportEntitlementRow {
  id: string;
  user_id: string;
  product_code: "personality_report";
  resource_id: string;
  source_purchase_id: string;
  status: ReportEntitlementStatus;
  granted_at: string;
  revoked_at: string | null;
  updated_at: string;
}

export interface AdvisorRequestRow {
  id: string;
  user_id: string;
  conversation_id: string;
  user_message_id: string;
  assistant_message_id: string | null;
  credits_reserved: 1;
  state: AdvisorRequestState;
  idempotency_key: string;
  reservation_expires_at: string;
  commit_ledger_entry_id: string | null;
  release_reason: AdvisorRequestReleaseReason | null;
  created_at: string;
  updated_at: string;
  committed_at: string | null;
  released_at: string | null;
}

export type PaymentProviderEventStatus =
  | "received"
  | "verified"
  | "processed"
  | "ignored"
  | "failed";

export interface PaymentProviderEventRow {
  id: string;
  provider: string;
  provider_event_id: string;
  event_type: string;
  status: PaymentProviderEventStatus;
  order_id: string | null;
  normalized_payload: JsonValue;
  received_at: string;
  verified_at: string | null;
  processed_at: string | null;
  failed_at: string | null;
  retry_count: number;
  last_error: string | null;
  updated_at: string;
}
