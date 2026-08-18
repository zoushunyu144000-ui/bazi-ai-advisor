import type { SupabaseClient } from "@supabase/supabase-js";

import type { Purchase } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapPurchaseRow } from "./mappers";
import type { PurchaseRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

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
}
