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
    "orders",
  ];

  for (const table of required) {
    assert.match(
      sql,
      new RegExp(
        `create policy "[^"]+"\\s+on public\\.${table} for select\\s+using \\([^;]*auth\\.uid\\(\\)[^;]*\\);`,
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
