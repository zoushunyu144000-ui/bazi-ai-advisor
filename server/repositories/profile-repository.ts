import type { SupabaseClient } from "@supabase/supabase-js";

import { throwRepositoryError } from "./errors";
import { mapProfileRow } from "./mappers";
import type { UserProfile } from "./models";
import type { ProfileRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface UpdateProfileInput {
  displayName?: string | null;
  avatarUrl?: string | null;
  countryCode?: string | null;
  marketingConsent?: boolean;
}

export class ProfileRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async get(): Promise<UserProfile> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "profile");
    return mapProfileRow(data as ProfileRow);
  }

  async update(input: UpdateProfileInput): Promise<UserProfile> {
    const patch: Record<string, string | boolean | null> = {};

    if (input.displayName !== undefined) {
      patch.display_name = input.displayName;
    }
    if (input.avatarUrl !== undefined) {
      patch.avatar_url = input.avatarUrl;
    }
    if (input.countryCode !== undefined) {
      patch.country_code = input.countryCode;
    }
    if (input.marketingConsent !== undefined) {
      patch.marketing_consent = input.marketingConsent;
    }

    const { data, error } = await this.client
      .from("profiles")
      .update(patch)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "profile");
    return mapProfileRow(data as ProfileRow);
  }
}
