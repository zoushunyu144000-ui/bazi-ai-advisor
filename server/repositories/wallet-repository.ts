import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreditLedgerEntry, Wallet } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapLedgerRow, mapWalletRow } from "./mappers";
import type { LedgerRow, WalletRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export class WalletRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async get(): Promise<Wallet> {
    const { data, error } = await this.client
      .from("wallets")
      .select("*")
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "wallet");
    return mapWalletRow(data as WalletRow);
  }

  async listLedger(limit = 100): Promise<CreditLedgerEntry[]> {
    const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 500);

    const { data, error } = await this.client
      .from("credit_ledger")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    throwRepositoryError(error, "credit ledger");
    return ((data ?? []) as LedgerRow[]).map(mapLedgerRow);
  }
}
