import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const {
  mapCalculationContextRow,
  mapPersistedBirthProfileRow,
} = await import(
  new URL(
    "../../server/repositories/calculation-persistence-mappers.ts",
    import.meta.url,
  )
);

test("BirthProfile round-trip preserves the selected DST occurrence", () => {
  const profile = mapPersistedBirthProfileRow({
    id: "birth-dst-1",
    user_id: "user-1",
    label: "dst overlap",
    calendar_type: "gregorian",
    birth_date: "2025-11-02",
    birth_time: "01:30:00",
    birth_time_precision: "exact",
    timezone: "America/New_York",
    resolved_birth_instant: "2025-11-02T06:30:00.000Z",
    utc_offset_minutes_at_birth: -300,
    place_name: "New York",
    country_code: "US",
    latitude: "40.712800",
    longitude: "-74.006000",
    sex_for_traditional_rules: "unspecified",
    input_payload: {},
    created_at: "2026-08-18T00:00:00.000Z",
    updated_at: "2026-08-18T00:00:00.000Z",
  });

  assert.equal(profile.resolvedBirthInstant, "2025-11-02T06:30:00.000Z");
  assert.equal(profile.utcOffsetMinutesAtBirth, -300);
  assert.equal(profile.timezone, "America/New_York");
});

test("legacy BirthProfile rows keep unresolved instant fields absent", () => {
  const profile = mapPersistedBirthProfileRow({
    id: "birth-legacy-1",
    user_id: "user-1",
    label: "legacy",
    calendar_type: "gregorian",
    birth_date: "2000-01-02",
    birth_time: null,
    birth_time_precision: "unknown",
    timezone: "Asia/Kuala_Lumpur",
    resolved_birth_instant: null,
    utc_offset_minutes_at_birth: null,
    place_name: null,
    country_code: null,
    latitude: null,
    longitude: null,
    sex_for_traditional_rules: "unspecified",
    input_payload: {},
    created_at: "2026-08-18T00:00:00.000Z",
    updated_at: "2026-08-18T00:00:00.000Z",
  });

  assert.equal("resolvedBirthInstant" in profile, false);
  assert.equal("utcOffsetMinutesAtBirth" in profile, false);
});

test("Bazi calculation context round-trip preserves metadata, relations and luck", () => {
  const relations = [
    {
      kind: "branch_clash",
      leftPillar: "year",
      rightPillar: "month",
      left: "zi",
      right: "wu",
    },
  ];
  const luck = {
    direction: "forward",
    startAgeYears: 6.25,
    boundaryTerm: "jing_zhe",
    boundaryInstant: "2006-03-05T12:00:00.000Z",
    method: "three_days_one_year",
    cycles: [
      {
        index: 0,
        pillar: { stem: "jia", branch: "zi" },
        startAgeYears: 6.25,
        endAgeYears: 16.25,
      },
    ],
    warnings: [],
  };

  const context = mapCalculationContextRow({
    id: "chart-1",
    user_id: "user-1",
    birth_profile_id: "birth-1",
    chart: {
      id: "chart-json-id",
      birthProfileId: "birth-json-id",
      pillars: {},
      dayMaster: {},
      calculatedAt: "2026-08-18T00:00:00.000Z",
    },
    calculation_metadata: {
      engine_version: "stale-json-engine",
      rule_profile_version: "stale-json-rules",
      sourceTimezone: "Asia/Kuala_Lumpur",
      calendarConversion: "gregorian_to_solar_terms",
      birthTimeWasKnown: true,
      calculatedAt: "2026-08-18T00:00:00.000Z",
      warnings: ["fixture-warning"],
    },
    relations,
    luck,
    engine_version: "bazi-engine/1.0.0",
    rule_profile_version: "rules/1.0.0",
    created_at: "2026-08-18T00:00:00.000Z",
  });

  assert.equal(context.chart.id, "chart-1");
  assert.equal(context.chart.birthProfileId, "birth-1");
  assert.equal(context.calculationMetadata.engine_version, "bazi-engine/1.0.0");
  assert.equal(context.calculationMetadata.rule_profile_version, "rules/1.0.0");
  assert.equal(context.calculationMetadata.sourceTimezone, "Asia/Kuala_Lumpur");
  assert.deepEqual(context.relations, relations);
  assert.deepEqual(context.luck, luck);
});

test("migrations and repositories contain the complete Wave 1.5 persistence path", async () => {
  const [birthSql, baziSql, birthRepository, chartRepository] =
    await Promise.all([
      readFile(
        new URL(
          "../../supabase/migrations/20260818010000_core_identity_birth.sql",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../../supabase/migrations/20260818010100_core_generated_conversation.sql",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../../server/repositories/birth-profile-repository.ts",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../../server/repositories/chart-repository.ts",
          import.meta.url,
        ),
        "utf8",
      ),
    ]);

  assert.match(birthSql, /resolved_birth_instant timestamptz/);
  assert.match(birthSql, /utc_offset_minutes_at_birth integer/);
  assert.match(baziSql, /relations jsonb not null default '\[\]'::jsonb/);
  assert.match(baziSql, /luck jsonb not null/);

  assert.match(birthRepository, /resolved_birth_instant:/);
  assert.match(birthRepository, /utc_offset_minutes_at_birth:/);
  assert.match(chartRepository, /saveCalculationResult/);
  assert.match(chartRepository, /getCalculationResultByChartId/);
  assert.match(chartRepository, /calculation_metadata:/);
  assert.match(chartRepository, /relations:/);
  assert.match(chartRepository, /luck:/);
  assert.doesNotMatch(chartRepository, /async saveChart\(/);
});
