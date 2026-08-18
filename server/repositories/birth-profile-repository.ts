import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  BirthPlace,
  BirthProfile,
  BirthTimePrecision,
  CalendarType,
  ISODateTime,
  JsonValue,
  TraditionalRuleSex,
} from "@/types/domain";

import { RepositoryError, throwRepositoryError } from "./errors";
import { mapPersistedBirthProfileRow } from "./calculation-persistence-mappers";
import type { BirthProfileRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface CreateBirthProfileInput {
  label: string;
  calendar: CalendarType;
  birthDate: string;
  birthTime: string | null;
  birthTimePrecision: BirthTimePrecision;
  timezone: string;
  resolvedBirthInstant?: ISODateTime | null;
  utcOffsetMinutesAtBirth?: number | null;
  birthPlace?: BirthPlace;
  sexForTraditionalRules: TraditionalRuleSex;
  inputPayload?: JsonValue;
}

export interface UpdateBirthProfileInput {
  label?: string;
  birthDate?: string;
  birthTime?: string | null;
  birthTimePrecision?: BirthTimePrecision;
  timezone?: string;
  resolvedBirthInstant?: ISODateTime | null;
  utcOffsetMinutesAtBirth?: number | null;
  birthPlace?: BirthPlace | null;
  sexForTraditionalRules?: TraditionalRuleSex;
  inputPayload?: JsonValue;
}

function birthPlaceColumns(place: BirthPlace | null | undefined) {
  if (place === undefined) {
    return {};
  }

  if (place === null) {
    return {
      place_name: null,
      country_code: null,
      latitude: null,
      longitude: null,
    };
  }

  return {
    place_name: place.locality ?? place.label ?? null,
    country_code: place.countryCode ?? null,
    latitude: place.coordinates?.latitude ?? null,
    longitude: place.coordinates?.longitude ?? null,
  };
}

function validateResolvedBirthPair(
  resolvedBirthInstant: ISODateTime | null | undefined,
  utcOffsetMinutesAtBirth: number | null | undefined,
  requireExplicitPair: boolean,
): void {
  const instantProvided = resolvedBirthInstant !== undefined;
  const offsetProvided = utcOffsetMinutesAtBirth !== undefined;

  if (requireExplicitPair && instantProvided !== offsetProvided) {
    throw new RepositoryError(
      "validation",
      "resolvedBirthInstant and utcOffsetMinutesAtBirth must be updated together.",
    );
  }

  const instant = resolvedBirthInstant ?? null;
  const offset = utcOffsetMinutesAtBirth ?? null;

  if ((instant === null) !== (offset === null)) {
    throw new RepositoryError(
      "validation",
      "resolvedBirthInstant and utcOffsetMinutesAtBirth must either both be present or both be null.",
    );
  }

  if (
    offset !== null &&
    (!Number.isInteger(offset) || offset < -840 || offset > 840)
  ) {
    throw new RepositoryError(
      "validation",
      "utcOffsetMinutesAtBirth must be an integer between -840 and 840.",
    );
  }
}

export class BirthProfileRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async list(): Promise<BirthProfile[]> {
    const { data, error } = await this.client
      .from("birth_profiles")
      .select("*")
      .eq("user_id", this.userId)
      .order("updated_at", { ascending: false });

    throwRepositoryError(error, "birth profiles");
    return ((data ?? []) as BirthProfileRow[]).map(mapPersistedBirthProfileRow);
  }

  async getById(id: string): Promise<BirthProfile> {
    const { data, error } = await this.client
      .from("birth_profiles")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "birth profile");
    return mapPersistedBirthProfileRow(data as BirthProfileRow);
  }

  async create(input: CreateBirthProfileInput): Promise<BirthProfile> {
    validateResolvedBirthPair(
      input.resolvedBirthInstant,
      input.utcOffsetMinutesAtBirth,
      true,
    );

    const { data, error } = await this.client
      .from("birth_profiles")
      .insert({
        user_id: this.userId,
        label: input.label,
        calendar_type: input.calendar,
        birth_date: input.birthDate,
        birth_time: input.birthTime,
        birth_time_precision: input.birthTimePrecision,
        timezone: input.timezone,
        resolved_birth_instant: input.resolvedBirthInstant ?? null,
        utc_offset_minutes_at_birth: input.utcOffsetMinutesAtBirth ?? null,
        ...birthPlaceColumns(input.birthPlace),
        sex_for_traditional_rules: input.sexForTraditionalRules,
        input_payload: input.inputPayload ?? {},
      })
      .select("*")
      .single();

    throwRepositoryError(error, "birth profile");
    return mapPersistedBirthProfileRow(data as BirthProfileRow);
  }

  async update(
    id: string,
    input: UpdateBirthProfileInput,
  ): Promise<BirthProfile> {
    validateResolvedBirthPair(
      input.resolvedBirthInstant,
      input.utcOffsetMinutesAtBirth,
      true,
    );

    const patch: Record<string, unknown> = {
      ...birthPlaceColumns(input.birthPlace),
    };

    if (input.label !== undefined) patch.label = input.label;
    if (input.birthDate !== undefined) patch.birth_date = input.birthDate;
    if (input.birthTime !== undefined) patch.birth_time = input.birthTime;
    if (input.birthTimePrecision !== undefined) {
      patch.birth_time_precision = input.birthTimePrecision;
    }
    if (input.timezone !== undefined) patch.timezone = input.timezone;
    if (input.resolvedBirthInstant !== undefined) {
      patch.resolved_birth_instant = input.resolvedBirthInstant;
      patch.utc_offset_minutes_at_birth = input.utcOffsetMinutesAtBirth;
    }
    if (input.sexForTraditionalRules !== undefined) {
      patch.sex_for_traditional_rules = input.sexForTraditionalRules;
    }
    if (input.inputPayload !== undefined) {
      patch.input_payload = input.inputPayload;
    }

    const { data, error } = await this.client
      .from("birth_profiles")
      .update(patch)
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "birth profile");
    return mapPersistedBirthProfileRow(data as BirthProfileRow);
  }

  async remove(id: string): Promise<void> {
    const { data, error } = await this.client
      .from("birth_profiles")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("id")
      .maybeSingle();

    throwRepositoryError(error, "birth profile");

    if (!data) {
      throwRepositoryError(
        { code: "PGRST116", message: "No owned row deleted." },
        "birth profile",
      );
    }
  }
}
