import type { SupabaseClient } from "@supabase/supabase-js";

import type { JsonValue, ProductCode } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapPurchaseRow } from "./mappers";
import type { Purchase } from "./models";
import type { PurchaseRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface CreatePurchaseInput {
  orderId: string;
  productCode: ProductCode;
  quantity?: number;
  currency: string;
  unitAmountMinor: number;
  entitlement?: JsonValue;
}

export class PurchaseRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async list(): Promise<Purchase[]> {
    const { data, error } = await this.client
      .from("purchases")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    throwRepositoryError(error, "purchases");
    return ((data ?? []) as PurchaseRow[]).map(mapPurchaseRow);
  }

  async getById(id: string): Promise<Purchase> {
    const { data, error } = await this.client
      .from("purchases")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "purchase");
    return mapPurchaseRow(data as PurchaseRow);
  }

  async create(input: CreatePurchaseInput): Promise<Purchase> {
    const quantity = input.quantity ?? 1;

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new Error("quantity must be a positive safe integer.");
    }

    if (!Number.isSafeInteger(input.unitAmountMinor) || input.unitAmountMinor < 0) {
      throw new Error("unitAmountMinor must be a non-negative safe integer.");
    }

    const { data, error } = await this.client
      .from("purchases")
      .insert({
        user_id: this.userId,
        order_id: input.orderId,
        product_code: input.productCode,
        quantity,
        currency: input.currency.toUpperCase(),
        unit_amount_minor: input.unitAmountMinor,
        entitlement: input.entitlement ?? {},
      })
      .select("*")
      .single();

    throwRepositoryError(error, "purchase");
    return mapPurchaseRow(data as PurchaseRow);
  }
}
