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

test("wallet repository is read-only until billing business rules land", async () => {
  const source = await readFile(
    new URL("../../server/repositories/wallet-repository.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /\.insert\(/);
  assert.doesNotMatch(source, /\.update\(/);
  assert.doesNotMatch(source, /\.delete\(/);
});
