begin;

create table if not exists public.wallets (
  user_id uuid primary key references public.users(id) on delete cascade,
  advisor_credits integer not null default 0 check (advisor_credits >= 0),
  lifetime_credits_purchased integer not null default 0 check (lifetime_credits_purchased >= 0),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  product_code text not null check (product_code in ('personality_report', 'advisor_10')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'expired')),
  provider text not null,
  provider_order_id text,
  currency char(3) not null,
  amount_minor bigint not null check (amount_minor >= 0),
  credits_granted integer not null default 0 check (credits_granted >= 0),
  report_id uuid references public.reports(id) on delete set null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (provider, provider_order_id)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete restrict,
  product_code text not null check (product_code in ('personality_report', 'advisor_10')),
  quantity integer not null default 1 check (quantity > 0),
  currency char(3) not null,
  unit_amount_minor bigint not null check (unit_amount_minor >= 0),
  entitlement jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wallets(user_id) on delete restrict,
  delta integer not null check (delta <> 0),
  balance_after integer not null check (balance_after >= 0),
  entry_type text not null check (entry_type in ('purchase', 'usage', 'refund', 'adjustment', 'bonus')),
  idempotency_key text not null unique,
  order_id uuid references public.orders(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  anonymous_id text,
  session_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  check (user_id is not null or anonymous_id is not null)
);

commit;
