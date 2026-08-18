import assert from "node:assert/strict";
import test from "node:test";

import {
  GeoNamesLocationProvider,
  GeoNamesTimezoneResolver,
  OpenCageLocationProvider,
} from "../../modules/birth/index.ts";

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("OpenCage adapter maps a fixture response and enables privacy-preserving no_record", async () => {
  const requests = [];
  const provider = new OpenCageLocationProvider({
    apiKey: "fixture-key",
    fetcher: async (input) => {
      const url = new URL(String(input));
      requests.push(url);
      return jsonResponse({
        results: [
          {
            formatted: "Wuhan, Hubei, China",
            geometry: { lat: 30.5928, lng: 114.3055 },
            components: {
              _normalized_city: "Wuhan",
              country: "China",
              country_code: "cn",
            },
            annotations: {
              timezone: { name: "Asia/Shanghai" },
              wikidata: "Q11746",
            },
          },
        ],
      });
    },
  });

  const results = await provider.search({
    city: "武汉",
    country: "中国",
    countryCode: "CN",
  });

  assert.equal(requests.length, 1);
  assert.equal(requests[0].searchParams.get("no_record"), "1");
  assert.equal(requests[0].searchParams.get("countrycode"), "cn");
  assert.equal(requests[0].searchParams.get("key"), "fixture-key");
  assert.equal(results.length, 1);
  assert.equal(results[0].providerLocationId, "opencage:Q11746");
  assert.deepEqual(results[0].city, { zhHans: "武汉", en: "Wuhan" });
  assert.deepEqual(results[0].country, { zhHans: "中国", en: "China" });
  assert.equal(results[0].countryCode, "CN");
  assert.deepEqual(results[0].coordinates, { latitude: 30.5928, longitude: 114.3055 });
  assert.equal(results[0].timezone, "Asia/Shanghai");
});

test("GeoNames adapters keep search and timezone lookup behind separate mockable boundaries", async () => {
  const requests = [];
  const fetcher = async (input) => {
    const url = new URL(String(input));
    requests.push(url);
    if (url.pathname.endsWith("/searchJSON")) {
      return jsonResponse({
        geonames: [
          {
            geonameId: 6167865,
            name: "Toronto",
            toponymName: "Toronto",
            countryName: "Canada",
            countryCode: "CA",
            lat: "43.6532",
            lng: "-79.3832",
          },
        ],
      });
    }
    if (url.pathname.endsWith("/timezoneJSON")) {
      return jsonResponse({ timezoneId: "America/Toronto" });
    }
    return jsonResponse({ status: { message: "unexpected fixture endpoint" } }, 404);
  };

  const provider = new GeoNamesLocationProvider({
    username: "fixture-user",
    fetcher,
  });
  const [location] = await provider.search({
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
  });

  assert.equal(location.providerLocationId, "geonames:6167865");
  assert.equal(location.timezone, undefined);
  assert.deepEqual(location.coordinates, { latitude: 43.6532, longitude: -79.3832 });

  const timezoneResolver = new GeoNamesTimezoneResolver({
    username: "fixture-user",
    fetcher,
  });
  const timezone = await timezoneResolver.resolve({
    location,
    birthDate: "2024-07-01",
    birthTime: "12:00:00",
    birthTimePrecision: "exact",
  });

  assert.equal(timezone?.timezone, "America/Toronto");
  assert.equal(timezone?.offsetMinutes, -240);
  assert.equal(timezone?.resolvedInstant, "2024-07-01T16:00:00.000Z");
  assert.equal(timezone?.source, "geonames-timezone+iana-runtime");
  assert.equal(requests.filter((url) => url.pathname.endsWith("/searchJSON")).length, 1);
  assert.equal(requests.filter((url) => url.pathname.endsWith("/timezoneJSON")).length, 1);
  assert.ok(requests.every((url) => url.searchParams.get("username") === "fixture-user"));
});
