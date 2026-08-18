# Contract Change Request — BirthProfile disambiguation and localized place names

Status: Partially resolved after Wave 1.5 Contract Integration PR #7  
Shared contract changed by PR #4: **No**

## Context

The existing shared contract already supports `birthTimePrecision: "exact" | "approximate" | "unknown"`.

## CCR-03-001 — Preserve ambiguous local-time disambiguation

**Status: Resolved by shared Contract Integration PR #7.**

The shared `BirthProfile` now provides:

```ts
resolvedBirthInstant?: ISODateTime;
utcOffsetMinutesAtBirth?: number;
```

PR #4 now writes both fields whenever the birth time is known. During a DST fall-back overlap, the caller must select one valid `utcOffsetMinutes`; normalization persists that selected offset and its exact UTC instant. Downstream 02 Bazi Engine can therefore replay the selected occurrence without guessing.

For `birthTimePrecision: "unknown"`, neither field is fabricated.

## CCR-03-002 — Preserve structured bilingual locality names

**Status: Proposed / not required for PR #4 merge.**

### Problem

`BirthPlace` currently exposes only `label?: string` and `locality?: string`. The Birth normalization layer can carry canonical Simplified Chinese and English city names, but both cannot be stored structurally in the shared contract.

### Proposed addition

After coordination, consider a localized field such as:

```ts
localityNames?: LocalizedText;
```

Until approved, PR #4 keeps bilingual names in `BirthNormalizationResult.metadata.location` and maps a preferred canonical name into `BirthPlace.locality` without changing `types/domain/**`.

## Not requested

No shared `isDst` field is requested. DST status is derived metadata for the resolved instant and IANA timezone. Durable replay is already satisfied by `resolvedBirthInstant`, `utcOffsetMinutesAtBirth`, and `timezone`.
