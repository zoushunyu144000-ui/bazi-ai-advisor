import assert from "node:assert/strict";
import test from "node:test";

import {
  BirthNormalizationError,
  FunctionTimezoneResolver,
  IanaHintTimezoneResolver,
  StaticLocationProvider,
  normalizeBirthProfile,
} from "../../modules/birth/index.ts";

const records = [
  {
    providerLocationId: "wuhan-cn",
    city: { zhHans: "武汉", en: "Wuhan" },
    country: { zhHans: "中国", en: "China" },
    countryCode: "CN",
    coordinates: { latitude: 30.5928, longitude: 114.3055 },
    timezone: "Asia/Shanghai",
    aliases: ["武汉市"],
  },
  {
    providerLocationId: "nyc-us",
    city: { zhHans: "纽约", en: "New York" },
    country: { zhHans: "美国", en: "United States" },
    countryCode: "US",
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    timezone: "America/New_York",
    aliases: ["New York City", "NYC"],
  },
  {
    providerLocationId: "london-gb",
    city: { zhHans: "伦敦", en: "London" },
    country: { zhHans: "英国", en: "United Kingdom" },
    countryCode: "GB",
    coordinates: { latitude: 51.5072, longitude: -0.1276 },
    timezone: "Europe/London",
  },
  {
    providerLocationId: "kuala-lumpur-my",
    city: { zhHans: "吉隆坡", en: "Kuala Lumpur" },
    country: { zhHans: "马来西亚", en: "Malaysia" },
    countryCode: "MY",
    coordinates: { latitude: 3.139, longitude: 101.6869 },
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    providerLocationId: "singapore-sg",
    city: { zhHans: "新加坡", en: "Singapore" },
    country: { zhHans: "新加坡", en: "Singapore" },
    countryCode: "SG",
    coordinates: { latitude: 1.3521, longitude: 103.8198 },
    timezone: "Asia/Singapore",
  },
  {
    providerLocationId: "toronto-ca",
    city: { zhHans: "多伦多", en: "Toronto" },
    country: { zhHans: "加拿大", en: "Canada" },
    countryCode: "CA",
    coordinates: { latitude: 43.6532, longitude: -79.3832 },
    timezone: "America/Toronto",
  },
  {
    providerLocationId: "sydney-au",
    city: { zhHans: "悉尼", en: "Sydney" },
    country: { zhHans: "澳大利亚", en: "Australia" },
    countryCode: "AU",
    coordinates: { latitude: -33.8688, longitude: 151.2093 },
    timezone: "Australia/Sydney",
  },
];

const provider = new StaticLocationProvider(records, "fixture-world-cities");
const timezoneResolver = new IanaHintTimezoneResolver();
const baseDeps = {
  locationProvider: provider,
  timezoneResolver,
  now: () => new Date("2026-08-18T00:00:00.000Z"),
  createId: () => "11111111-1111-4111-8111-111111111111",
};

test("normalizes Chinese city input and persists replayable timezone facts", async () => {
  const result = await normalizeBirthProfile(
    {
      birthDate: "2003-06-09",
      birthTime: "08:05",
      birthTimePrecision: "exact",
      city: "武汉市",
      country: "中国",
      sexForTraditionalRules: "male",
    },
    baseDeps,
  );

  assert.equal(result.profile.birthDate, "2003-06-09");
  assert.equal(result.profile.birthTime, "08:05:00");
  assert.equal(result.profile.timezone, "Asia/Shanghai");
  assert.equal(result.profile.resolvedBirthInstant, "2003-06-09T00:05:00.000Z");
  assert.equal(result.profile.utcOffsetMinutesAtBirth, 480);
  assert.equal(result.profile.birthPlace?.locality, "Wuhan");
  assert.equal(result.profile.birthPlace?.countryCode, "CN");
  assert.deepEqual(result.profile.birthPlace?.coordinates, { latitude: 30.5928, longitude: 114.3055 });
  assert.equal(result.metadata.location.city.zhHans, "武汉");
  assert.equal(result.metadata.location.city.en, "Wuhan");
  assert.equal(result.metadata.timezone.offsetMinutes, 480);
  assert.equal(result.metadata.timezone.isDst, false);
  assert.equal(result.metadata.timezone.resolvedInstant, result.profile.resolvedBirthInstant);
});

test("preserves unknown birth-time state without inventing replay fields", async () => {
  const result = await normalizeBirthProfile(
    {
      birthDate: "1990-07-01",
      birthTimePrecision: "unknown",
      city: "London",
      country: "United Kingdom",
    },
    baseDeps,
  );

  assert.equal(result.profile.birthTime, null);
  assert.equal(result.profile.birthTimePrecision, "unknown");
  assert.equal(result.profile.timezone, "Europe/London");
  assert.equal(result.profile.resolvedBirthInstant, undefined);
  assert.equal(result.profile.utcOffsetMinutesAtBirth, undefined);
  assert.equal(result.metadata.timezone.offsetMinutes, null);
  assert.equal(result.metadata.timezone.isDst, null);
  assert.equal(result.metadata.timezone.resolvedInstant, null);
  assert.equal(result.metadata.timezone.observesDstThisYear, true);
  assert.ok(result.metadata.warnings.some((warning) => warning.includes("unknown")));
});

test("persists the selected DST overlap occurrence for deterministic downstream replay", async () => {
  const earlier = await normalizeBirthProfile(
    {
      birthDate: "2024-11-03",
      birthTime: "01:30",
      birthTimePrecision: "exact",
      city: "NYC",
      country: "US",
      utcOffsetMinutes: -240,
    },
    baseDeps,
  );
  const later = await normalizeBirthProfile(
    {
      birthDate: "2024-11-03",
      birthTime: "01:30",
      birthTimePrecision: "exact",
      city: "NYC",
      country: "US",
      utcOffsetMinutes: -300,
    },
    baseDeps,
  );

  assert.equal(earlier.profile.timezone, "America/New_York");
  assert.equal(earlier.profile.birthTime, "01:30:00");
  assert.equal(earlier.profile.utcOffsetMinutesAtBirth, -240);
  assert.equal(earlier.profile.resolvedBirthInstant, "2024-11-03T05:30:00.000Z");

  assert.equal(later.profile.timezone, "America/New_York");
  assert.equal(later.profile.birthTime, "01:30:00");
  assert.equal(later.profile.utcOffsetMinutesAtBirth, -300);
  assert.equal(later.profile.resolvedBirthInstant, "2024-11-03T06:30:00.000Z");

  assert.notEqual(earlier.profile.resolvedBirthInstant, later.profile.resolvedBirthInstant);
  assert.equal(earlier.metadata.timezone.localTimeDisambiguation, "offset");
  assert.equal(later.metadata.timezone.localTimeDisambiguation, "offset");
});

test("rejects successful-looking timezone results that cannot be replayed", async () => {
  const incompleteResolver = new FunctionTimezoneResolver("fixture-incomplete", async () => ({
    timezone: "Asia/Shanghai",
    source: "fixture-incomplete",
    offsetMinutes: null,
    isDst: null,
    observesDstThisYear: false,
    localTimeDisambiguation: "unique",
    resolvedInstant: null,
    timezoneName: null,
  }));

  await assert.rejects(
    () =>
      normalizeBirthProfile(
        {
          birthDate: "2003-06-09",
          birthTime: "08:05",
          birthTimePrecision: "exact",
          city: "武汉",
          country: "中国",
        },
        { ...baseDeps, timezoneResolver: incompleteResolver },
      ),
    (error) =>
      error instanceof BirthNormalizationError &&
      error.code === "TIMEZONE_RESOLUTION_FAILED",
  );
});

test("rejects impossible calendar dates", async () => {
  await assert.rejects(
    () =>
      normalizeBirthProfile(
        {
          birthDate: "2024-02-30",
          birthTime: "12:00",
          birthTimePrecision: "exact",
          city: "武汉",
          country: "中国",
        },
        baseDeps,
      ),
    (error) => error instanceof BirthNormalizationError && error.code === "INVALID_BIRTH_DATE",
  );
});

test("rejects a supplied time when precision is unknown", async () => {
  await assert.rejects(
    () =>
      normalizeBirthProfile(
        {
          birthDate: "2000-01-01",
          birthTime: "12:00",
          birthTimePrecision: "unknown",
          city: "武汉",
          country: "中国",
        },
        baseDeps,
      ),
    (error) => error instanceof BirthNormalizationError && error.code === "INVALID_BIRTH_TIME",
  );
});

test("does not guess when a location query is ambiguous", async () => {
  const ambiguousProvider = new StaticLocationProvider([
    ...records,
    { ...records[1], providerLocationId: "nyc-us-duplicate" },
  ]);
  await assert.rejects(
    () =>
      normalizeBirthProfile(
        {
          birthDate: "2000-01-01",
          birthTime: "12:00",
          birthTimePrecision: "exact",
          city: "NYC",
          country: "US",
        },
        { ...baseDeps, locationProvider: ambiguousProvider },
      ),
    (error) => error instanceof BirthNormalizationError && error.code === "LOCATION_AMBIGUOUS",
  );
});

test("normalizes representative birth locations across target overseas regions", async () => {
  const cases = [
    ["Kuala Lumpur", "Malaysia", "Asia/Kuala_Lumpur"],
    ["Singapore", "Singapore", "Asia/Singapore"],
    ["Toronto", "Canada", "America/Toronto"],
    ["Sydney", "Australia", "Australia/Sydney"],
    ["London", "United Kingdom", "Europe/London"],
  ];

  for (const [city, country, timezone] of cases) {
    const result = await normalizeBirthProfile(
      {
        birthDate: "2000-01-15",
        birthTime: "12:00",
        birthTimePrecision: "exact",
        city,
        country,
      },
      baseDeps,
    );
    assert.equal(result.profile.timezone, timezone);
    assert.ok(result.profile.birthPlace?.coordinates);
    assert.ok(result.profile.resolvedBirthInstant);
    assert.equal(typeof result.profile.utcOffsetMinutesAtBirth, "number");
  }
});
