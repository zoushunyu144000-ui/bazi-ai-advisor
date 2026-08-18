import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Order,
  OrderStatus,
  ProductCode,
} from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapOrderRow } from "./mappers";
import type { OrderRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface CreatePendingOrderInput {
  productCode: ProductCode;
  provider: string;
  providerOrderId?: string;
  currency: string;
  amountMinor: number;
  creditsGranted?: number;
  reportId?: string;
  idempotencyKey: string;
}

function assertNonNegativeInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative safe integer.`);
  }
}

export class OrderRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async list(): Promise<Order[]> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    throwRepositoryError(error, "orders");
    return ((data ?? []) as OrderRow[]).map(mapOrderRow);
  }

  async getById(id: string): Promise<Order> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "order");
    return mapOrderRow(data as OrderRow);
  }

  async createPending(input: CreatePendingOrderInput): Promise<Order> {
    assertNonNegativeInteger(input.amountMinor, "amountMinor");
    assertNonNegativeInteger(input.creditsGranted ?? 0, "creditsGranted");

    const { data, error } = await this.client
      .from("orders")
      .insert({
        user_id: this.userId,
        product_code: input.productCode,
        status: "pending",
        provider: input.provider,
        provider_order_id: input.providerOrderId ?? null,
        currency: input.currency.toUpperCase(),
        amount_minor: input.amountMinor,
        credits_granted: input.creditsGranted ?? 0,
        report_id: input.reportId ?? null,
        idempotency_key: input.idempotencyKey,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "order");
    return mapOrderRow(data as OrderRow);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.client
      .from("orders")
      .update({ status })
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "order");
    return mapOrderRow(data as OrderRow);
  }
}
