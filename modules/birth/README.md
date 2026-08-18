# Birth normalization module

This module converts user-entered birth facts into the shared `BirthProfile` contract without performing any Bazi calculation.

## Boundary

Input facts are normalized in this order:

1. validate Gregorian date, local clock time, precision state, ids, and location query;
2. resolve a canonical location through `LocationProvider`;
3. require ISO country code, canonical names, latitude, and longitude from the location result;
4. resolve an IANA timezone through `TimezoneResolver`;
5. use IANA/`Intl` rules to validate the local civil time, compute the offset, detect DST where reliably labelable, and derive a UTC instant when time is known;
6. persist replay facts into the shared `BirthProfile`:
   - `resolvedBirthInstant`
   - `utcOffsetMinutesAtBirth`
7. return module-local metadata for provider provenance, bilingual place names, DST labels, and warnings.

The module intentionally does **not** implement Bazi rules, true solar time rules, AI interpretation, UI, billing, or persistence.

## Provider adapters

`LocationProvider` and `TimezoneResolver` are vendor-neutral interfaces.

Core/testing adapters:

- `FunctionLocationProvider`
- `StaticLocationProvider`
- `FunctionTimezoneResolver`
- `IanaHintTimezoneResolver`
- `CompositeTimezoneResolver`

Reuse-First provider adapters added in PR #4:

- `OpenCageLocationProvider`
- `GeoNamesLocationProvider`
- `GeoNamesTimezoneResolver`

These adapters accept injected fetch functions and credentials at construction time. Tests use fixtures only; the repository contains no live API key and PR #4 does not claim a successful live provider connection.

See `PROVIDER_BENCHMARK.md` for the official-source capability / price / license / privacy comparison and current recommendation.

## Time precision

The shared contract supports:

- `exact`
- `approximate`
- `unknown`

For `unknown`, the normalized profile keeps `birthTime: null` and does not invent `resolvedBirthInstant` or `utcOffsetMinutesAtBirth`. The IANA timezone can still be known from the selected location, but hour-sensitive calculation remains unresolved.

For any known birth time, normalization refuses to return a successful profile unless the timezone resolver produced **both** an exact UTC instant and an integer UTC offset in minutes. This makes replayability a module invariant instead of an optional metadata detail.

## DST and clock-change handling

For known local times, the current resolver enumerates valid IANA offsets around the entered wall clock using platform `Intl` / runtime IANA data rather than maintaining a timezone database in this repository.

- Normal time: one valid instant is produced and persisted.
- Spring-forward gap: rejected as `NONEXISTENT_LOCAL_TIME`.
- Fall-back overlap: rejected as `AMBIGUOUS_LOCAL_TIME` unless `utcOffsetMinutes` selects one valid occurrence.
- Selected overlap occurrence: both `resolvedBirthInstant` and `utcOffsetMinutesAtBirth` are persisted in `BirthProfile`.

Regression tests explicitly cover both `2024-11-03 01:30` occurrences in `America/New_York`:

- `-04:00` → `2024-11-03T05:30:00.000Z`
- `-05:00` → `2024-11-03T06:30:00.000Z`

The Reuse-First review considered TC39 Temporal. Native Temporal is not part of the repository's Node 22 baseline, so PR #4 does not add a polyfill dependency solely for this boundary. See `PROVIDER_BENCHMARK.md` and `docs/12_REUSE_AND_REFERENCES.md`.

## Geographic coverage

The core is region-agnostic. Coverage is determined by injected providers and runtime IANA timezone data, not a hard-coded country allowlist. Fixtures cover China, Malaysia, Singapore, the United States, Canada, Australia, and Europe.

## Contract coordination

`CCR-03-001` is resolved by the shared Wave 1.5 Contract: exact birth instant and offset now have durable fields. `CCR-03-002` for structured bilingual locality names remains proposed and is not required for PR #4.
