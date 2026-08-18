import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryFiles = [
  "profile-repository.ts",
  "birth-profile-repository.ts",
  "chart-repository.ts",
  "report-repository.ts",
  "conversation-repository.ts",
  "memory-repository.ts",
  "wallet-repository.ts",
  "order-repository.ts",
  "purchase-repository.ts",
];

test("repositories are scoped to an explicit user id", async () => {
  for (const file of repositoryFiles) {
    const source = await readFile(
      new URL(`../../server/repositories/${file}`, import.meta.url),
      "utf8",
    );

    assert.match(source, /extends ScopedRepository/, `${file} is not scoped`);
    assert.match(
      source,
      /this\.userId/,
      `${file} does not use its user scope`,
    );
  }
});

test("wallet, order, and purchase read repositories cannot mutate billing authority", async () => {
  for (const file of [
    "wallet-repository.ts",
    "order-repository.ts",
    "purchase-repository.ts",
  ]) {
    const source = await readFile(
      new URL(`../../server/repositories/${file}`, import.meta.url),
      "utf8",
    );

    assert.doesNotMatch(source, /\.insert\(/, `${file} inserts directly`);
    assert.doesNotMatch(source, /\.update\(/, `${file} updates directly`);
    assert.doesNotMatch(source, /\.delete\(/, `${file} deletes directly`);
    assert.doesNotMatch(source, /\.rpc\(/, `${file} exposes trusted RPC writes`);
  }
});

test("trusted billing writes are isolated behind RPC and admin-client factory", async () => {
  const [billingSource, indexSource] = await Promise.all([
    readFile(
      new URL("../../server/repositories/billing-repository.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../../server/repositories/index.ts", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(billingSource, /export class BillingReadRepository extends ScopedRepository/);
  assert.match(billingSource, /export class TrustedBillingRepository/);
  assert.match(billingSource, /\.rpc\("reserve_advisor_credit"/);
  assert.match(billingSource, /\.rpc\("commit_advisor_credit"/);
  assert.match(billingSource, /\.rpc\("release_advisor_credit"/);
  assert.doesNotMatch(billingSource, /\.from\("wallets"\)\s*\.update/s);
  assert.doesNotMatch(billingSource, /\.from\("credit_ledger"\)\s*\.insert/s);

  assert.match(indexSource, /createTrustedBillingRepository/);
  assert.match(indexSource, /new TrustedBillingRepository\(createSupabaseAdminClient\(\)\)/);
});
