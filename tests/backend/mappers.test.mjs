import assert from "node:assert/strict";
import test from "node:test";

const { mapBirthProfileRow, mapOrderRow, mapWalletRow } = await import(
  new URL("../../server/repositories/mappers.ts", import.meta.url)
);

test("birth profile mapper converts relational location fields", () => {
  const result = mapBirthProfileRow({
    id: "birth-1",
    user_id: "user-1",
    label: "home",
    calendar_type: "gregorian",
    birth_date: "2000-01-02",
    birth_time: "03:04:00",
    birth_time_precision: "exact",
    timezone: "Asia/Kuala_Lumpur",
    place_name: "Penang",
    country_code: "MY",
    latitude: "5.414100",
    longitude: "100.328800",
    sex_for_traditional_rules: "unspecified",
    input_payload: {},
    created_at: "2026-08-18T00:00:00Z",
    updated_at: "2026-08-18T00:00:00Z",
  });

  assert.equal(result.userId, "user-1");
  assert.equal(result.birthPlace?.locality, "Penang");
  assert.deepEqual(result.birthPlace?.coordinates, {
    latitude: 5.4141,
    longitude: 100.3288,
  });
});

test("wallet mapper keeps integer credit balances", () => {
  const wallet = mapWalletRow({
    user_id: "user-1",
    advisor_credits: 10,
    lifetime_credits_purchased: 20,
    version: 3,
    created_at: "2026-08-18T00:00:00Z",
    updated_at: "2026-08-18T00:00:00Z",
  });

  assert.equal(wallet.advisorCredits, 10);
  assert.equal(wallet.version, 3);
});

test("order mapper rejects bigint values outside the JS safe integer range", () => {
  assert.throws(
    () =>
      mapOrderRow({
        id: "order-1",
        user_id: "user-1",
        product_code: "personality_report",
        status: "pending",
        provider: "placeholder",
        provider_order_id: null,
        currency: "CNY",
        amount_minor: "9007199254740992",
        credits_granted: 0,
        report_id: null,
        idempotency_key: "order-key",
        created_at: "2026-08-18T00:00:00Z",
        paid_at: null,
        updated_at: "2026-08-18T00:00:00Z",
      }),
    /safe integer/i,
  );
});
