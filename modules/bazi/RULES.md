# Bazi Engine v1 rule profile

This module is deterministic calculation infrastructure, not an LLM interpretation layer.

## Calendar source and adapter boundary

- Calendar/solar-term primitive: `tyme4ts` 1.5.2, wrapped only by `adapters/tyme4ts-adapter.ts`.
- Business code never consumes tyme4ts objects.
- Solar-term instants are read from tyme4ts and converted from its CST (+08:00) wall-clock representation to UTC before comparison with a birth instant.
- Civil birth date/time is resolved from the supplied IANA timezone with `Intl.DateTimeFormat`; DST gaps fail closed and DST overlaps choose the earlier instant with a metadata warning.

## v1 rules

- Year boundary: exact `立春` instant, not Gregorian Jan 1 and not Lunar New Year.
- Month boundary: exact `节` instants. `立春` starts 寅 month; then 惊蛰, 清明, 立夏, 芒种, 小暑, 立秋, 白露, 寒露, 立冬, 大雪, 小寒.
- Day pillar: local civil calendar date in the supplied IANA timezone.
- Hour branch: 子 = 23:00–00:59, then two-hour branches.
- Late Zi (`23:00–23:59`): v1 keeps the same civil day (晚子时不换日). This is a school choice, not a universal truth.
- True solar time / longitude correction: not applied in v1. Birth-place coordinates remain available for a future opt-in rule profile.
- Hidden stem baseline weights: 1 hidden = 1.0; 2 = 0.7/0.3; 3 = 0.6/0.3/0.1. These are scoring weights, not claims of universally accepted percentages.
- Basic relations: stem combinations, branch 六合, 六冲, 六害. Transformations, 刑/破 and conditional relation-strength judgments are intentionally deferred.
- Day-master strength: baseline structural score only. Visible stems receive weight 1; hidden stems carry one branch budget, with the month branch budget weighted 1.5. Same-element + resource share >= 0.58 is `strong`, <= 0.42 is `weak`, otherwise `balanced`. This is not 格局/用神 adjudication.
- Luck direction: 阳男阴女 forward; 阴男阳女 reverse. `sexForTraditionalRules=unspecified` returns unknown direction instead of guessing.
- Luck start: adjacent `节` distance using the explicit `3 days = 1 year` profile; eight decade cycles are emitted. Alternative 起运 schools are not silently mixed into v1.

## Determinism

`BaziChart.calculatedAt` is required by the shared Contract. To keep identical `BirthProfile` input byte-deterministic, v1 uses `BirthProfile.updatedAt` as the deterministic audit timestamp. A future shared Contract should separate calculation-event time from deterministic chart identity/fingerprint.
