import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrls = [
  "20260818010000_core_identity_birth.sql",
  "20260818010100_core_generated_conversation.sql",
  "20260818010200_core_billing_analytics.sql",
  "20260818010300_core_triggers_auth.sql",
  "20260818010400_rls_baseline.sql",
  "20260818010500_rls_owned_data.sql",
  "20260818010600_billing_contract_hardening.sql",
].map(
  (file) =>
    new URL(`../../supabase/migrations/${file}`, import.meta.url),
);
const clientUrl = new URL("../../lib/supabase/client.ts", import.meta.url);
const publicEnvUrl = new URL("../../lib/supabase/public-env.ts", import.meta.url);
const adminUrl = new URL("../../lib/supabase/admin.ts", import.meta.url);

const [migrationSqlParts, clientSource, publicEnvSource, adminSource] =
  await Promise.all([
    Promise.all(migrationUrls.map((url) => readFile(url, "utf8"))),
    readFile(clientUrl, "utf8"),
    readFile(publicEnvUrl, "utf8"),
    readFile(adminUrl, "utf8"),
  ]);
const sql = migrationSqlParts.join("\n");

const tables = [
  "users",
  "profiles",
  "birth_profiles",
  "bazi_charts",
  "bazi_derived_features",
  "reports",
  "conversations",
  "messages",
  "user_memories",
  "wallets",
  "credit_ledger",
  "orders",
  "purchases",
  "analytics_events",
  "payment_provider_events",
  "report_entitlements",
  "advisor_requests",
];

test("migration chain contains the required Supabase core tables", () => {
  for (const table of tables) {
    assert.match(
      sql,
      new RegExp(`create table if not exists public\\.${table}`),
      `missing table migration for ${table}`,
    );
  }
});

test("RLS is enabled for every application table", () => {
  for (const table of tables) {
    assert.match(
      sql,
      new RegExp(`alter table public\\.${table} enable row level security;`),
      `missing RLS enable for ${table}`,
    );
  }
});

test("required user-owned tables expose own-row select policies", () => {
  const required = [
    "birth_profiles",
    "bazi_charts",
    "reports",
    "messages",
    "user_memories",
    "wallets",
    "credit_ledger",
    "orders",
    "purchases",
    "report_entitlements",
    "advisor_requests",
  ];

  for (const table of required) {
    assert.match(
      sql,
      new RegExp(
        `create policy "[^"]+"\\s+on public\\.${table} for select(?:\\s+to authenticated)?\\s+using \\([^;]*auth\\.uid\\(\\)[^;]*\\);`,
        "s",
      ),
      `missing own-row select policy for ${table}`,
    );
  }
});

test("sensitive generated and billing tables have no direct mutation policy", () => {
  const sensitive = [
    "bazi_charts",
    "bazi_derived_features",
    "reports",
    "wallets",
    "credit_ledger",
    "orders",
    "purchases",
    "payment_provider_events",
    "report_entitlements",
    "advisor_requests",
    "analytics_events",
  ];

  const policies = [
    ...sql.matchAll(
      /create policy "([^"]+)"\s+on public\.(\w+) for (select|insert|update|delete|all)/g,
    ),
  ].map((match) => ({
    table: match[2],
    operation: match[3],
  }));

  for (const table of sensitive) {
    const mutations = policies.filter(
      (policy) => policy.table === table && policy.operation !== "select",
    );
    assert.deepEqual(mutations, [], `unexpected client mutation policy on ${table}`);
  }
});

test("billing mutation RPCs are service-role only", () => {
  const functions = [
    "record_payment_provider_event",
    "mark_payment_provider_event_verified",
    "mark_payment_provider_event_failed",
    "grant_advisor_credits",
    "reserve_advisor_credit",
    "commit_advisor_credit",
    "release_advisor_credit",
    "grant_report_entitlement",
    "revoke_report_entitlement",
    "fulfill_verified_payment_event",
  ];

  for (const functionName of functions) {
    assert.match(
      sql,
      new RegExp(`revoke execute on function public\\.${functionName}\\(`),
      `missing execute revoke for ${functionName}`,
    );
    assert.match(
      sql,
      new RegExp(`grant execute on function public\\.${functionName}\\([^;]+\\) to service_role;`),
      `missing service-role grant for ${functionName}`,
    );
  }

  assert.match(
    sql,
    /revoke insert, update, delete on public\.orders,[\s\S]*public\.payment_provider_events[\s\S]*from anon, authenticated;/,
  );
  assert.match(
    sql,
    /revoke select on public\.payment_provider_events from anon, authenticated;/,
  );
});

test("direct message writes are restricted to owned zero-cost user messages", () => {
  assert.match(sql, /role = 'user'/);
  assert.match(sql, /credit_cost = 0/);
  assert.match(sql, /from public\.conversations c/);
  assert.match(sql, /c\.user_id = auth\.uid\(\)/);
});

test("server secret cannot enter browser/public Supabase modules", () => {
  const clientFacing = `${clientSource}\n${publicEnvSource}`;

  assert.doesNotMatch(clientFacing, /SUPABASE_SECRET_KEY/);
  assert.doesNotMatch(clientFacing, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(adminSource, /import "server-only"/);
  assert.match(adminSource, /SUPABASE_SECRET_KEY/);
});
