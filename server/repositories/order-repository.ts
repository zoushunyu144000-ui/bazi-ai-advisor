import type { SupabaseClient } from "@supabase/supabase-js";

import type { Order } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapOrderRow } from "./mappers";
import type { OrderRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

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
}
