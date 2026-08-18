# Supabase database workflow

`db/schema.sql` is the Foundation schema reference retained for architectural review.

`supabase/migrations/` is the executable source of truth for database rollout and is used by the Supabase CLI.
Migration files are append-only after they have been applied to any shared environment.

## Local verification

Prerequisites:

- Supabase CLI
- Docker-compatible runtime

Commands:

```bash
supabase start
supabase db reset
npm test
```

`supabase db reset` recreates the local database from the committed migration chain; do not execute `db/schema.sql` as an additional migration.
`npm test` adds fast source/security checks that do not require a live Supabase instance.

## First remote project

After the user creates a real Supabase project:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Then configure the application environment with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server only; preferred)
- or legacy `SUPABASE_SERVICE_ROLE_KEY` (server only)

Never expose either server secret through a `NEXT_PUBLIC_*` variable.

## Security boundary

RLS is the client-facing authorization boundary. The server secret bypasses RLS, so code
using `createSupabaseAdminClient()` must perform explicit user scoping and business
authorization before writes.

Wallet/ledger mutation semantics are intentionally not implemented in this layer.
The payment/billing workstream must add transactional, idempotent business operations
rather than directly decrementing wallet values in application code.
