begin;

-- Compatibility when the Foundation snapshot was previously applied manually.
alter table public.reports alter column content set default '[]'::jsonb;

create index if not exists birth_profiles_user_id_idx on public.birth_profiles(user_id);
create index if not exists bazi_charts_user_id_idx on public.bazi_charts(user_id);
create index if not exists bazi_derived_features_user_id_idx on public.bazi_derived_features(user_id);
create index if not exists reports_user_id_created_at_idx on public.reports(user_id, created_at desc);
create index if not exists conversations_user_id_updated_at_idx on public.conversations(user_id, updated_at desc);
create index if not exists messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);
create index if not exists messages_user_id_created_at_idx on public.messages(user_id, created_at desc);
create index if not exists user_memories_user_id_updated_at_idx on public.user_memories(user_id, updated_at desc);
create index if not exists credit_ledger_user_id_created_at_idx on public.credit_ledger(user_id, created_at desc);
create index if not exists orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index if not exists purchases_user_id_created_at_idx on public.purchases(user_id, created_at desc);
create index if not exists analytics_events_name_occurred_at_idx on public.analytics_events(event_name, occurred_at desc);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists birth_profiles_set_updated_at on public.birth_profiles;
create trigger birth_profiles_set_updated_at before update on public.birth_profiles
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at before update on public.reports
for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists user_memories_set_updated_at on public.user_memories;
create trigger user_memories_set_updated_at before update on public.user_memories
for each row execute function public.set_updated_at();

drop trigger if exists wallets_set_updated_at on public.wallets;
create trigger wallets_set_updated_at before update on public.wallets
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (user_id) do nothing;

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

commit;
