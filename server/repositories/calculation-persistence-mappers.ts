import type {
  BaziCalculationContext,
  BaziCalculationMetadata,
  BaziChart,
  BaziLuckStructure,
  BaziRelation,
  BirthProfile,
} from "@/types/domain";

import type { BirthProfileRow, ChartRow } from "./rows";

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

export function mapPersistedBirthProfileRow(row: BirthProfileRow): BirthProfile {
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

export function mapCalculationContextRow(row: ChartRow): BaziCalculationContext {
  if (!Array.isArray(row.relations)) {
    throw new Error("Persisted Bazi relations must be a JSON array.");
  }

  if (
    row.luck === null ||
    typeof row.luck !== "object" ||
    Array.isArray(row.luck)
  ) {
    throw new Error("Persisted Bazi luck must be a JSON object.");
  }

  const storedChart = row.chart as unknown as BaziChart;
  const storedMetadata =
    row.calculation_metadata as unknown as BaziCalculationMetadata;

  return {
    chart: {
      ...storedChart,
      id: row.id,
      birthProfileId: row.birth_profile_id,
    },
    calculationMetadata: {
      ...storedMetadata,
      engine_version: row.engine_version,
      rule_profile_version: row.rule_profile_version,
    },
    relations: row.relations as unknown as BaziRelation[],
    luck: row.luck as unknown as BaziLuckStructure,
  };
}
