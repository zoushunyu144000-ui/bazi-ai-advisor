# Contract Change Request — BirthProfile disambiguation and localized place names

Status: Proposed by 03 Birth / Location / Timezone module
Shared contract changed in this branch: **No**

## Context

The existing shared contract already supports `birthTimePrecision: "exact" | "approximate" | "unknown"`, so no change is requested for unknown-time state.

Two normalization facts cannot currently be preserved losslessly inside `BirthProfile`.

## CCR-03-001 — Preserve ambiguous local-time disambiguation

### Problem

During a DST fall-back transition, the same local civil time can occur twice. For example, `2024-11-03 01:30` in `America/New_York` maps to two different UTC instants with offsets `-04:00` and `-05:00`.

The birth module can detect this and require `utcOffsetMinutes` at normalization time, but the current `BirthProfile` stores only local date, local time, and IANA timezone. If only `BirthProfile` is handed to the Bazi engine later, the selected occurrence is lost.

### Proposed minimal addition

Add one optional field to `BirthProfile` after cross-window review:

```ts
birthUtcOffsetMinutes?: number;
```

Alternative, stronger option:

```ts
birthInstant?: ISODateTime | null;
```

The stronger option makes the selected instant explicit, while the offset option keeps the contract closer to entered civil-time facts. The final choice should be coordinated with the 02 Bazi Engine because it affects deterministic replay and timezone-rule versioning.

## CCR-03-002 — Preserve structured bilingual locality names

### Problem

`BirthPlace` currently exposes only `label?: string` and `locality?: string`. The birth normalization layer can carry canonical Simplified Chinese and English city names, but both cannot be stored structurally in the shared contract.

### Proposed addition

After coordination, consider a localized field such as:

```ts
localityNames?: LocalizedText;
```

Until approved, this branch keeps bilingual names in `BirthNormalizationResult.metadata.location` and maps the preferred canonical name into `BirthPlace.locality` without changing `types/domain/**`.

## Not requested

No shared `isDst` field is requested. DST status is derivable metadata for a resolved instant and IANA timezone; the module currently returns it in normalization metadata instead of making it a durable domain fact.
