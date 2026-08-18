import type { SupabaseClient } from "@supabase/supabase-js";

export abstract class ScopedRepository {
  protected constructor(
    protected readonly client: SupabaseClient,
    protected readonly userId: string,
  ) {
    if (!userId) {
      throw new Error("A user id is required to create a scoped repository.");
    }
  }
}
