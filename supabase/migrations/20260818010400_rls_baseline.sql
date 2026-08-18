begin;

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

-- Drop Foundation policies so this migration can safely upgrade a database where
-- db/schema.sql was previously applied manually.
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "birth_profiles_own_all" on public.birth_profiles;
drop policy if exists "birth_profiles_select_own" on public.birth_profiles;
drop policy if exists "birth_profiles_insert_own" on public.birth_profiles;
drop policy if exists "birth_profiles_update_own" on public.birth_profiles;
drop policy if exists "birth_profiles_delete_own" on public.birth_profiles;
drop policy if exists "bazi_charts_select_own" on public.bazi_charts;
drop policy if exists "bazi_derived_features_select_own" on public.bazi_derived_features;
drop policy if exists "reports_select_own" on public.reports;
drop policy if exists "conversations_own_all" on public.conversations;
drop policy if exists "conversations_select_own" on public.conversations;
drop policy if exists "conversations_insert_own" on public.conversations;
drop policy if exists "conversations_update_own" on public.conversations;
drop policy if exists "conversations_delete_own" on public.conversations;
drop policy if exists "messages_select_own" on public.messages;
drop policy if exists "messages_insert_own" on public.messages;
drop policy if exists "user_memories_own_all" on public.user_memories;
drop policy if exists "user_memories_select_own" on public.user_memories;
drop policy if exists "user_memories_insert_own" on public.user_memories;
drop policy if exists "user_memories_update_own" on public.user_memories;
drop policy if exists "user_memories_delete_own" on public.user_memories;
drop policy if exists "wallets_select_own" on public.wallets;
drop policy if exists "credit_ledger_select_own" on public.credit_ledger;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "purchases_select_own" on public.purchases;

create policy "users_select_own"
on public.users for select
using (auth.uid() = id);

create policy "users_update_own"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "birth_profiles_select_own"
on public.birth_profiles for select
using (auth.uid() = user_id);

create policy "birth_profiles_insert_own"
on public.birth_profiles for insert
with check (auth.uid() = user_id);

create policy "birth_profiles_update_own"
on public.birth_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "birth_profiles_delete_own"
on public.birth_profiles for delete
using (auth.uid() = user_id);

create policy "bazi_charts_select_own"
on public.bazi_charts for select
using (auth.uid() = user_id);

create policy "bazi_derived_features_select_own"
on public.bazi_derived_features for select
using (auth.uid() = user_id);

create policy "reports_select_own"
on public.reports for select
using (auth.uid() = user_id);

commit;
