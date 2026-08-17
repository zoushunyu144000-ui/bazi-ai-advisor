-- Bazi AI Advisor foundation schema
-- Target: PostgreSQL / Supabase
-- NOTE: Supabase Auth remains canonical in auth.users. public.users stores app-level identity/state.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'disabled')),
  locale text not null default 'zh-Hans',
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  country_code char(2),
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.birth_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  label text not null default 'default',
  calendar_type text not null default 'gregorian' check (calendar_type in ('gregorian')),
  birth_date date not null,
  birth_time time,
  birth_time_precision text not null check (birth_time_precision in ('exact', 'approximate', 'unknown')),
  timezone text not null,
  place_name text,
  country_code char(2),
  latitude numeric(9,6),
  longitude numeric(9,6),
  sex_for_traditional_rules text not null default 'unspecified' check (sex_for_traditional_rules in ('male', 'female', 'unspecified')),
  input_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((birth_time_precision = 'unknown' and birth_time is null) or (birth_time_precision <> 'unknown' and birth_time is not null))
);

create table if not exists public.bazi_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  birth_profile_id uuid not null references public.birth_profiles(id) on delete cascade,
  chart jsonb not null,
  calculation_metadata jsonb not null,
  engine_version text not null,
  rule_profile_version text not null,
  created_at timestamptz not null default now(),
  unique (birth_profile_id, engine_version, rule_profile_version)
);

create table if not exists public.bazi_derived_features (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  chart_id uuid not null references public.bazi_charts(id) on delete cascade,
  features jsonb not null,
  engine_version text not null,
  rule_profile_version text not null,
  mapping_version text not null,
  created_at timestamptz not null default now(),
  unique (chart_id, mapping_version)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  chart_id uuid not null references public.bazi_charts(id) on delete restrict,
  derived_features_id uuid not null references public.bazi_derived_features(id) on delete restrict,
  tier text not null check (tier in ('tier_1', 'tier_2', 'tier_3')),
  status text not null default 'draft' check (status in ('draft', 'ready', 'failed')),
  title text,
  personality_profile jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  engine_version text not null,
  rule_profile_version text not null,
  mapping_version text not null,
  prompt_version text not null,
  report_schema_version text not null,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  report_id uuid references public.reports(id) on delete set null,
  title text,
  status text not null default 'active' check (status in ('active', 'archived')),
  model_provider text,
  model_name text,
  prompt_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  structured_payload jsonb,
  model_provider text,
  model_name text,
  prompt_version text,
  credit_cost integer not null default 0 check (credit_cost >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  memory_key text not null,
  memory_type text not null check (memory_type in ('preference', 'goal', 'constraint', 'fact', 'advisor_note')),
  value jsonb not null,
  confidence numeric(4,3) not null default 1.000 check (confidence >= 0 and confidence <= 1),
  is_user_editable boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists user_memories_active_key_uidx
  on public.user_memories(user_id, memory_key)
  where is_active = true;

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

create index if not exists birth_profiles_user_id_idx on public.birth_profiles(user_id);
create index if not exists bazi_charts_user_id_idx on public.bazi_charts(user_id);
create index if not exists bazi_derived_features_user_id_idx on public.bazi_derived_features(user_id);
create index if not exists reports_user_id_created_at_idx on public.reports(user_id, created_at desc);
create index if not exists conversations_user_id_updated_at_idx on public.conversations(user_id, updated_at desc);
create index if not exists messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);
create index if not exists credit_ledger_user_id_created_at_idx on public.credit_ledger(user_id, created_at desc);
create index if not exists orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index if not exists analytics_events_name_occurred_at_idx on public.analytics_events(event_name, occurred_at desc);

create trigger users_set_updated_at before update on public.users
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger birth_profiles_set_updated_at before update on public.birth_profiles
for each row execute function public.set_updated_at();
create trigger reports_set_updated_at before update on public.reports
for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
for each row execute function public.set_updated_at();
create trigger user_memories_set_updated_at before update on public.user_memories
for each row execute function public.set_updated_at();
create trigger wallets_set_updated_at before update on public.wallets
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id) values (new.id) on conflict (id) do nothing;
  insert into public.profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.wallets (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.birth_profiles enable row level security;
alter table public.bazi_charts enable row level security;
alter table public.bazi_derived_features enable row level security;
alter table public.reports enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_memories enable row level security;
alter table public.wallets enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.orders enable row level security;
alter table public.purchases enable row level security;
alter table public.analytics_events enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "birth_profiles_own_all" on public.birth_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bazi_charts_select_own" on public.bazi_charts for select using (auth.uid() = user_id);
create policy "bazi_derived_features_select_own" on public.bazi_derived_features for select using (auth.uid() = user_id);
create policy "reports_select_own" on public.reports for select using (auth.uid() = user_id);
create policy "conversations_own_all" on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "messages_select_own" on public.messages for select using (auth.uid() = user_id);
create policy "messages_insert_own" on public.messages for insert with check (auth.uid() = user_id);
create policy "user_memories_own_all" on public.user_memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wallets_select_own" on public.wallets for select using (auth.uid() = user_id);
create policy "credit_ledger_select_own" on public.credit_ledger for select using (auth.uid() = user_id);
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "purchases_select_own" on public.purchases for select using (auth.uid() = user_id);

-- No direct client mutation policies are intentionally provided for charts, derived features,
-- reports, wallets, ledger, purchases, or analytics ingestion. These writes belong to trusted
-- server-side code so deterministic-engine provenance, billing idempotency, and event hygiene are preserved.
