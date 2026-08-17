# Birth normalization module

This module converts user-entered birth facts into the shared `BirthProfile` contract without performing any Bazi calculation.

## Boundary

Input facts are normalized in this order:

1. validate Gregorian date, local clock time, precision state, ids, and location query;
2. resolve a canonical location through `LocationProvider`;
3. require ISO country code, canonical names, latitude, and longitude from the location result;
4. resolve an IANA timezone through `TimezoneResolver`;
5. use IANA/`Intl` rules to validate the local civil time, compute the offset, detect DST where reliably labelable, and derive a UTC instant when time is known;
6. map the normalized facts into the existing shared `BirthProfile` without changing `types/domain/**`.

The module intentionally does **not** implement Bazi rules, true solar time rules, AI interpretation, UI, billing, or persistence.

## Provider adapters

`LocationProvider` and `TimezoneResolver` are vendor-neutral interfaces.

- `FunctionLocationProvider` and `FunctionTimezoneResolver` wrap any external API/client without exposing vendor response types to the core.
- `StaticLocationProvider` is intended for tests, fixtures, controlled offline datasets, or small curated fallbacks.
- `IanaHintTimezoneResolver` resolves a timezone already supplied by the selected location result.
- `CompositeTimezoneResolver` chains multiple timezone strategies and stops at the first successful resolution.

A production geocoder can therefore be swapped without changing `normalizeBirthProfile` or the shared domain contract.

## Time precision

The existing shared contract already supports:

- `exact`
- `approximate`
- `unknown`

For `unknown`, the normalized profile keeps `birthTime: null`. The IANA timezone can still be known from the location, but offset, DST state, UTC instant, and hour-sensitive calculations remain unresolved.

## DST and clock-change handling

For known local times, the module enumerates valid IANA offsets around the entered wall clock time rather than assuming a fixed offset.

- Normal time: one valid instant is produced.
- Spring-forward gap: rejected as `NONEXISTENT_LOCAL_TIME`.
- Fall-back overlap: rejected as `AMBIGUOUS_LOCAL_TIME` unless `utcOffsetMinutes` selects one of the valid occurrences.

The resolved offset, DST metadata, timezone name, and UTC instant are returned in `BirthNormalizationResult.metadata`.

## Geographic coverage

The core is region-agnostic. Coverage is determined by the injected providers and the runtime IANA timezone database, not a hard-coded country allowlist. Tests cover representative locations in China, Malaysia, Singapore, the United States, Canada, Australia, and Europe.

## Contract coordination

See `CONTRACT_CHANGE_REQUEST.md` for fields that cannot currently be preserved inside `BirthProfile` itself, especially fall-back overlap disambiguation and structured bilingual place names.
