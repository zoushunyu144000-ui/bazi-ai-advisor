import assert from "node:assert/strict";
import test from "node:test";

import {
  BirthNormalizationError,
  canonicalizeIanaTimeZone,
  resolveIanaLocalDateTime,
} from "../../modules/birth/index.ts";

test("resolves DST for a summer New York birth time", () => {
  const result = resolveIanaLocalDateTime(
    "2024-07-01",
    "12:00:00",
    "America/New_York",
  );
  assert.equal(result.offsetMinutes, -240);
  assert.equal(result.isDst, true);
  assert.equal(result.observesDstThisYear, true);
  assert.equal(result.resolvedInstant, "2024-07-01T16:00:00.000Z");
});

test("rejects a nonexistent spring-forward local time", () => {
  assert.throws(
    () => resolveIanaLocalDateTime("2024-03-10", "02:30:00", "America/New_York"),
    (error) => error instanceof BirthNormalizationError && error.code === "NONEXISTENT_LOCAL_TIME",
  );
});

test("requires an explicit offset and resolves both fall-back occurrences", () => {
  assert.throws(
    () => resolveIanaLocalDateTime("2024-11-03", "01:30:00", "America/New_York"),
    (error) =>
      error instanceof BirthNormalizationError &&
      error.code === "AMBIGUOUS_LOCAL_TIME" &&
      Array.isArray(error.details?.validOffsets) &&
      error.details.validOffsets.includes(-240) &&
      error.details.validOffsets.includes(-300),
  );

  const daylightTime = resolveIanaLocalDateTime(
    "2024-11-03",
    "01:30:00",
    "America/New_York",
    -240,
  );
  assert.equal(daylightTime.offsetMinutes, -240);
  assert.equal(daylightTime.resolvedInstant, "2024-11-03T05:30:00.000Z");
  assert.equal(daylightTime.localTimeDisambiguation, "offset");

  const standardTime = resolveIanaLocalDateTime(
    "2024-11-03",
    "01:30:00",
    "America/New_York",
    -300,
  );
  assert.equal(standardTime.offsetMinutes, -300);
  assert.equal(standardTime.resolvedInstant, "2024-11-03T06:30:00.000Z");
  assert.equal(standardTime.localTimeDisambiguation, "offset");
});

test("rejects invalid IANA timezone ids", () => {
  assert.throws(
    () => canonicalizeIanaTimeZone("Mars/Olympus_Mons"),
    (error) => error instanceof BirthNormalizationError && error.code === "INVALID_TIMEZONE",
  );
});
