import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hardeningUrl = new URL(
  "../../supabase/migrations/20260818010600_billing_contract_hardening.sql",
  import.meta.url,
);
const coreBillingUrl = new URL(
  "../../supabase/migrations/20260818010200_core_billing_analytics.sql",
  import.meta.url,
);
const billingRepositoryUrl = new URL(
  "../../server/repositories/billing-repository.ts",
  import.meta.url,
);

const [sql, coreBillingSql, billingRepositorySource] = await Promise.all([
  readFile(hardeningUrl, "utf8"),
  readFile(coreBillingUrl, "utf8"),
  readFile(billingRepositoryUrl, "utf8"),
]);

function functionBody(name) {
  const pattern = new RegExp(
    `create or replace function public\\.${name}\\([\\s\\S]*?\\n\\$\\$;`,
    "i",
  );
  const match = sql.match(pattern);
  assert.ok(match, `missing SQL function ${name}`);
  return match[0];
}

test("duplicate webhook delivery has a durable provider event identity and processed no-op", () => {
  assert.match(sql, /unique \(provider, provider_event_id\)/);
  assert.match(
    functionBody("record_payment_provider_event"),
    /on conflict \(provider, provider_event_id\) do nothing/,
  );
  assert.match(
    functionBody("fulfill_verified_payment_event"),
    /if v_event\.status = 'processed' then[\s\S]*return v_purchase;/,
  );
});

test("duplicate advisor credit grant is exactly-once by stable purchase ledger identity", () => {
  const body = functionBody("grant_advisor_credits");
  assert.match(body, /v_key := 'purchase:' \|\| v_purchase\.id::text \|\| ':grant'/);
  assert.match(body, /where idempotency_key = v_key/);
  assert.match(body, /if found then[\s\S]*return v_wallet;/);
  assert.match(coreBillingSql, /idempotency_key text not null unique/);
});

test("duplicate report entitlement reuses one stable identity", () => {
  assert.match(
    sql,
    /unique \(user_id, product_code, resource_id\)/,
  );
  assert.match(
    functionBody("grant_report_entitlement"),
    /on conflict \(user_id, product_code, resource_id\)[\s\S]*do update set/,
  );
});

test("one credit plus concurrent advisor requests serialize on wallet and count active reservations", () => {
  const body = functionBody("reserve_advisor_credit");
  assert.match(
    body,
    /from public\.wallets[\s\S]*where user_id = p_user_id[\s\S]*for update;/,
  );
  assert.match(
    body,
    /select coalesce\(sum\(credits_reserved\), 0\)::integer[\s\S]*state = 'reserved'[\s\S]*reservation_expires_at > now\(\)/,
  );
  assert.match(body, /v_wallet\.advisor_credits - v_reserved < 1/);
  assert.match(body, /Re-check retry identity after acquiring the per-user serialization lock/);
});

test("AI failure release simulation leaves wallet and ledger untouched", () => {
  const body = functionBody("release_advisor_credit");
  assert.match(body, /state = 'released'/);
  assert.match(body, /where id = v_request\.id[\s\S]*and state = 'reserved'/);
  assert.doesNotMatch(body, /insert into public\.credit_ledger/);
  assert.doesNotMatch(body, /update public\.wallets/);
});

test("advisor commit is exactly-once and performs debit plus ledger plus state transition together", () => {
  const body = functionBody("commit_advisor_credit");
  assert.match(body, /if v_request\.state = 'committed' then[\s\S]*return v_request;/);
  assert.match(body, /for update;/);
  assert.match(body, /'advisor_request:' \|\| v_request\.id::text \|\| ':commit'/);
  assert.match(body, /where idempotency_key = v_key/);
  assert.match(body, /insert into public\.credit_ledger/);
  assert.match(body, /advisor_credits = v_balance/);
  assert.match(body, /set state = 'committed'/);
});

test("advisor release is exactly-once and never reverses committed usage", () => {
  const body = functionBody("release_advisor_credit");
  assert.match(body, /if v_request\.state in \('released', 'committed'\) then[\s\S]*return v_request;/);
  assert.match(body, /and state = 'reserved'/);
});

test("wallet cannot become negative", () => {
  assert.match(coreBillingSql, /advisor_credits integer not null default 0 check \(advisor_credits >= 0\)/);
  assert.match(functionBody("commit_advisor_credit"), /if v_balance < 0 then/);
  assert.match(functionBody("commit_advisor_credit"), /v_wallet\.advisor_credits < 1/);
});

test("credit ledger is immutable and new facts require canonical reason/reference", () => {
  assert.match(sql, /alter column reason set not null/);
  assert.match(sql, /alter column reference_type set not null/);
  assert.match(sql, /alter column reference_id set not null/);
  assert.match(sql, /create trigger credit_ledger_immutable/);
  assert.match(
    functionBody("reject_credit_ledger_mutation"),
    /credit_ledger is immutable/,
  );
});

test("verified order fulfillment is one short database function and marks event processed last", () => {
  const body = functionBody("fulfill_verified_payment_event");
  assert.match(body, /v_event\.status <> 'verified'/);
  assert.match(body, /where id = p_order_id[\s\S]*for update;/);
  assert.match(body, /on conflict \(order_id\) do nothing/);
  assert.match(body, /status = 'processed'/);
  assert.match(body, /processed_at = now\(\)/);
  assert.doesNotMatch(body, /\b(?:fetch|openai|anthropic)\b|https?:\/\//i);
});

test("trusted repository routes billing mutations only through RPC", () => {
  for (const rpcName of [
    "record_payment_provider_event",
    "mark_payment_provider_event_verified",
    "grant_advisor_credits",
    "reserve_advisor_credit",
    "commit_advisor_credit",
    "release_advisor_credit",
    "grant_report_entitlement",
    "revoke_report_entitlement",
    "fulfill_verified_payment_event",
  ]) {
    assert.match(
      billingRepositorySource,
      new RegExp(`\\.rpc\\(\\s*"${rpcName}"`),
      `trusted repository does not call ${rpcName}`,
    );
  }
});
