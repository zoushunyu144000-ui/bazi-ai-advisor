import assert from "node:assert/strict";
import test from "node:test";

const { RepositoryError } = await import(
  new URL("../../server/repositories/errors.ts", import.meta.url)
);

test("RepositoryError maps missing rows", () => {
  const error = RepositoryError.from(
    { code: "PGRST116", message: "0 rows" },
    "birth profile",
  );

  assert.equal(error.code, "not_found");
  assert.match(error.message, /birth profile/i);
});

test("RepositoryError maps unique conflicts", () => {
  const error = RepositoryError.from(
    { code: "23505", message: "duplicate key" },
    "order",
  );

  assert.equal(error.code, "conflict");
});

test("RepositoryError maps RLS/permission errors", () => {
  const error = RepositoryError.from(
    { code: "42501", message: "permission denied" },
    "wallet",
  );

  assert.equal(error.code, "forbidden");
});

test("RepositoryError preserves unknown database failures", () => {
  const cause = { code: "XX000", message: "internal error" };
  const error = RepositoryError.from(cause, "report");

  assert.equal(error.code, "database");
  assert.equal(error.cause, cause);
});
