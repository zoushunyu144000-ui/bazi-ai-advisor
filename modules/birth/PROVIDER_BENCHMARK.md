# Birth Location / Timezone Provider Benchmark

Status: Reuse First evaluation for PR #4  
Last verified: 2026-08-18  
Production provider selected: **No**

This benchmark evaluates providers for an overseas-Chinese birth-information flow. It does not authorize a production vendor, and no live provider request was made while implementing PR #4. Real credentials must be supplied separately before any live integration can be claimed.

## Required capability

The Birth module needs provider data only for factual input normalization:

```text
city/country query
→ canonical place candidate
→ latitude/longitude
→ IANA timezone
→ local Birth module resolves historical UTC instant / DST overlap using runtime IANA rules
```

The external provider must not become the source of historical Bazi rules or historical DST arithmetic. A provider may supply an IANA timezone identifier, while `TimezoneResolver` remains responsible for resolving the birth-time instant.

## Capability matrix

| Provider | Chinese / English city search | Global / target-region coverage | Coordinates | IANA timezone | Price / free allowance (official public terms checked 2026-08-18) | Rate limit | Storage / license | Privacy / lock-in | Current decision |
|---|---|---|---|---|---|---|---|---|---|
| **OpenCage** | Accepts UTF-8 queries and a language preference; language is best-effort rather than guaranteed. Forward geocoding is not fuzzy autocomplete; OpenCage offers geosearch separately. Chinese fixtures require live benchmark before production. | Worldwide aggregation; suitable in principle for CN / MY / SG / US / CA / AU / Europe, but ranking must be fixture-tested. | Yes, WGS84 | Yes: `annotations.timezone.name` in tz-database format | Free trial: 2,500/day, 1 req/s, testing only. X-Small: $50/mo, 10,000/day, 15 req/s. | Plan-dependent; 1 req/s trial, 15 req/s X-Small | Results may be stored permanently, including after ending service. | `no_record=1` prevents query-content logging; EU/GDPR posture. Lower storage lock-in than map-platform geocoders. | **Conditional Adopt / primary V1 candidate** via Adapter; live Chinese fixture benchmark still required. |
| **GeoNames** | Search supports `lang=zh`, `zh-Hant`, English and fuzzy matching. | Global gazetteer / populated-place search; appropriate low-cost fallback for target regions. | Yes | Separate `timezone` service returns Olson/IANA `timezoneId` | Free web services: 10,000 credits/day and 1,000/hour per application; search and timezone are each 1 credit. Premium starts at €40/year for 100k credits (lower throughput tier). | Free: 1,000 credits/hour; premium varies by plan | GeoNames data is CC-BY; commercial use allowed; attribution required. | Low vendor lock-in; public free service has no SLA, premium is recommended for professional use. | **Conditional Adopt / fallback** via Adapter. Do not self-host the full global dump for V1. |
| **TomTom** | Explicit `zh-CN`, `zh-TW`, English and `ms-MY`; fuzzy single-line search / suggest is mature. | Search coverage includes China at city level, Malaysia, Australia and broad Europe/Americas coverage. | Yes | Fuzzy Search can return `timeZone.ianaId` with `timeZone=iana` | Current pricing: Geocoding API has 20k free monthly requests; legacy Search API 2.5k; newer Search Suggest 10k. No card needed for free start. | Default Search / Geocoding: 5 QPS | Public docs expose region-specific legal constraints; persistence rights should be reviewed against Developer Portal terms before storing birth coordinates. | Strong product search UX, but commercial terms and regional restrictions create more lock-in than open-data providers. | **Reference / commercial-quality benchmark**. Do not wire live until storage terms are approved. |
| **Google Maps Platform** | Strong multilingual global geocoding/search ecosystem. | Broad global coverage; separate Geocoding and Time Zone APIs. | Yes | Separate Time Zone API | Geocoding and Time Zone each have 10k free monthly usage cap; then $5/1,000 in the first paid tier. Billing + credentials required. | Geocoding: 3,000 QPM | Geocoding content caching/storage is generally restricted; place IDs are the notable indefinite-storage exception. | High provider coupling for a product that needs durable birth coordinates and replayable facts. | **Reference Only** for V1 normalization unless legal/storage architecture changes. |
| **Mapbox** | Multilingual forward geocoding and autocomplete; language tags supported. | Broad search/geocoding coverage. | Yes | No IANA timezone field identified in the Geocoding v6 response contract; would need another resolver. | Temporary Geocoding: 100k free/month then usage pricing. Permanent Geocoding: no free tier, starts $5/1,000 and requires permanent mode / appropriate account. | Geocoding v6 default: 1,000 requests/min | Temporary results cannot be stored; permanent mode allows indefinite storage. Current docs also state Geocoding responses are for use with a Mapbox map. | Storage mode and map-product coupling are poor fits for a small non-map birth form. | **Reject for V1 primary**; retain only as future reference. |

## Adapter decision

The core keeps the existing vendor-neutral interfaces:

- `LocationProvider`
- `TimezoneResolver`

PR #4 adds thin, mockable provider adapters without credentials in source control:

- `OpenCageLocationProvider`
- `GeoNamesLocationProvider`
- `GeoNamesTimezoneResolver`

`OpenCageLocationProvider` extracts only canonical location facts and the IANA timezone annotation. `GeoNamesTimezoneResolver` uses GeoNames only to obtain `timezoneId`, then delegates the historical local-time resolution back to the Birth module's IANA runtime resolver. This prevents a provider's *current* offset/DST fields from being mistaken for the offset at the historical birth instant.

## Recommendation

### Primary V1 candidate: OpenCage, conditionally

Use OpenCage as the first production candidate **only after** a live benchmark with representative Chinese and English city fixtures. The strongest fit is not raw autocomplete quality; it is the combination of coordinates, IANA timezone annotation, permanent storage rights, a privacy-oriented `no_record=1` option, and a simple exit path behind `LocationProvider`.

For V1, prefer submit-time city resolution or a deliberate candidate-selection step instead of pretending forward geocoding is a fuzzy typeahead service. If product design later requires high-quality typeahead, benchmark OpenCage Geosearch and TomTom Places/Search separately behind the same provider boundary.

### Backup: GeoNames

GeoNames is the low-cost / open-data fallback. It is especially useful for Chinese-language lookup because the official search service supports `zh` / `zh-Hant`, and its separate timezone endpoint gives an IANA/Olson identifier. Its public service is better treated as a development/small-volume fallback; production reliability should use premium service if it becomes business-critical.

### Commercial benchmark: TomTom

TomTom is the strongest benchmark in this review for user-facing multilingual fuzzy search because it explicitly supports Simplified Chinese, Traditional Chinese, English, Malay, global fuzzy search, and can return IANA timezone IDs. However, PR #4 does not add a TomTom live adapter because durable result-storage rights need an explicit Developer Portal terms review first.

## Temporal / DST reuse review

TC39 Temporal is now Stage 4 and has first-class timezone ambiguity controls. It can represent exact instants and explicitly choose or reject ambiguous/nonexistent local times. The project baseline is Node 22, while official Temporal implementation status lists Node 26 as the Node release that ships native Temporal.

`@js-temporal/polyfill` remains a viable future adapter/reference, but its current package documentation still lists a future production-version milestone. PR #4 therefore does **not** add the polyfill only to replace a small boundary policy. The module continues to delegate timezone database lookup/format conversion to platform `Intl` / runtime IANA data and retains only the product policy that:

- nonexistent local time → reject;
- repeated local time → require explicit occurrence/offset;
- known birth time → persist exact UTC instant + offset.

Revisit native Temporal when the repository Node runtime moves to Node 26+ or if historical edge-case coverage shows the current adapter boundary is insufficient.

## Official sources checked

- OpenCage API / privacy / caching: https://opencagedata.com/api
- OpenCage pricing: https://opencagedata.com/pricing
- OpenCage timezone guide: https://opencagedata.com/guides/how-to-find-the-time-zone-for-an-address-or-coordinates
- GeoNames terms / free quota: https://www.geonames.org/export/
- GeoNames search: https://www.geonames.org/export/geonames-search.html
- GeoNames timezone: https://www.geonames.org/export/web-services.html
- GeoNames credits: https://www.geonames.org/export/credits.html
- GeoNames premium pricing: https://www.geonames.org/commercial-webservices.html
- TomTom supported languages: https://developer.tomtom.com/search-api/documentation/product-information/supported-languages
- TomTom Search / IANA timezone: https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
- TomTom market coverage: https://developer.tomtom.com/search-api/documentation/product-information/market-coverage
- TomTom pricing: https://docs.tomtom.com/pricing
- TomTom QPS: https://developer.tomtom.com/platform/documentation/api-best-practices/qps-limits
- Google Maps Platform pricing: https://developers.google.com/maps/billing-and-pricing/pricing
- Google Geocoding policy: https://developers.google.com/maps/documentation/geocoding/policies
- Mapbox Geocoding v6: https://docs.mapbox.com/api/search/geocoding/
- Mapbox pricing: https://www.mapbox.com/pricing
- TC39 Temporal ambiguity docs: https://tc39.es/proposal-temporal/docs/timezone.html
- TC39 Temporal implementation status: https://github.com/tc39/proposal-temporal
- Temporal polyfill package: https://www.npmjs.com/package/@js-temporal/polyfill
