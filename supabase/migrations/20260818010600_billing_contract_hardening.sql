begin;

-- Wave 2 Billing Contract forward migration.
-- This migration intentionally does not edit Wave 1 migration history.

create table if not exists public.payment_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'received'
    check (status in ('received', 'verified', 'processed', 'ignored', 'failed')),
  order_id uuid references public.orders(id) on delete set null,
  normalized_payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  verified_at timestamptz,
  processed_at timestamptz,
  failed_at timestamptz,
  retry_count integer not null default 0 check (retry_count >= 0),
  last_error text,
  updated_at timestamptz not null default now(),
  unique (provider, provider_event_id),
  check (status <> 'verified' or verified_at is not null),
  check (status <> 'processed' or processed_at is not null),
  check (status <> 'failed' or failed_at is not null)
);

create index if not exists payment_provider_events_order_idx
  on public.payment_provider_events(order_id);
create index if not exists payment_provider_events_status_received_idx
  on public.payment_provider_events(status, received_at);

create table if not exists public.report_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  product_code text not null default 'personality_report'
    check (product_code = 'personality_report'),
  resource_id uuid not null references public.reports(id) on delete restrict,
  source_purchase_id uuid not null references public.purchases(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, product_code, resource_id),
  check (
    (status = 'active' and revoked_at is null)
    or (status = 'revoked' and revoked_at is not null)
  )
);

create index if not exists report_entitlements_user_status_idx
  on public.report_entitlements(user_id, status);

create table if not exists public.advisor_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  conversation_id uuid not null references public.conversations(id) on delete restrict,
  user_message_id uuid not null references public.messages(id) on delete restrict,
  assistant_message_id uuid references public.messages(id) on delete restrict,
  credits_reserved integer not null default 1 check (credits_reserved = 1),
  state text not null default 'reserved'
    check (state in ('reserved', 'committed', 'released')),
  idempotency_key text not null,
  reservation_expires_at timestamptz not null,
  commit_ledger_entry_id uuid unique references public.credit_ledger(id) on delete restrict,
  release_reason text check (
    release_reason is null
    or release_reason in (
      'provider_error',
      'timeout',
      'invalid_output',
      'server_error',
      'reservation_expired'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  committed_at timestamptz,
  released_at timestamptz,
  unique (user_id, idempotency_key),
  check (reservation_expires_at > created_at),
  check (
    (state = 'reserved'
      and commit_ledger_entry_id is null
      and committed_at is null
      and release_reason is null
      and released_at is null)
    or
    (state = 'committed'
      and assistant_message_id is not null
      and commit_ledger_entry_id is not null
      and committed_at is not null
      and release_reason is null
      and released_at is null)
    or
    (state = 'released'
      and commit_ledger_entry_id is null
      and committed_at is null
      and release_reason is not null
      and released_at is not null)
  )
);

create index if not exists advisor_requests_user_state_idx
  on public.advisor_requests(user_id, state);
create index if not exists advisor_requests_reserved_expiry_idx
  on public.advisor_requests(user_id, reservation_expires_at)
  where state = 'reserved';

alter table public.purchases
  add column if not exists resource_id uuid references public.reports(id) on delete restrict;

update public.purchases p
set resource_id = o.report_id
from public.orders o
where p.order_id = o.id
  and p.product_code = 'personality_report'
  and p.resource_id is null
  and o.report_id is not null;

alter table public.purchases
  drop constraint if exists purchases_resource_consistency;
alter table public.purchases
  add constraint purchases_resource_consistency check (
    (product_code = 'personality_report' and resource_id is not null)
    or (product_code = 'advisor_10' and resource_id is null)
  ) not valid;
alter table public.purchases validate constraint purchases_resource_consistency;

alter table public.credit_ledger
  add column if not exists reason text,
  add column if not exists reference_type text,
  add column if not exists reference_id text;

alter table public.credit_ledger
  drop constraint if exists credit_ledger_reason_check,
  drop constraint if exists credit_ledger_reference_type_check;
alter table public.credit_ledger
  add constraint credit_ledger_reason_check check (
    reason in (
      'purchase_grant',
      'advisor_usage',
      'refund_reversal',
      'manual_adjustment',
      'promo_bonus'
    )
  ) not valid,
  add constraint credit_ledger_reference_type_check check (
    reference_type in (
      'purchase',
      'advisor_request',
      'order',
      'ledger_entry',
      'manual_adjustment',
      'promotion'
    )
  ) not valid;

-- Only facts that can be proven from existing relational references are backfilled.
update public.credit_ledger l
set reason = 'purchase_grant',
    reference_type = 'purchase',
    reference_id = p.id::text
from public.purchases p
where l.reason is null
  and l.entry_type = 'purchase'
  and l.order_id = p.order_id;

update public.credit_ledger
set reason = 'refund_reversal',
    reference_type = 'order',
    reference_id = order_id::text
where reason is null
  and entry_type = 'refund'
  and order_id is not null;

-- Ambiguous Wave 1 development rows must be explicitly handled rather than guessed.
do $$
begin
  if exists (
    select 1
    from public.credit_ledger
    where reason is null
       or reference_type is null
       or reference_id is null
  ) then
    raise exception
      'Wave 2 billing migration cannot prove reason/reference for one or more legacy credit_ledger rows. Explicitly repair or remove those development rows, then rerun the migration.';
  end if;
end
$$;

alter table public.credit_ledger
  alter column reason set not null,
  alter column reference_type set not null,
  alter column reference_id set not null;
alter table public.credit_ledger validate constraint credit_ledger_reason_check;
alter table public.credit_ledger validate constraint credit_ledger_reference_type_check;

create index if not exists credit_ledger_user_created_idx
  on public.credit_ledger(user_id, created_at desc);
create index if not exists credit_ledger_reference_idx
  on public.credit_ledger(reference_type, reference_id);

create or replace function public.reject_credit_ledger_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'credit_ledger is immutable; append a reversal or adjustment fact instead';
end;
$$;

drop trigger if exists credit_ledger_immutable on public.credit_ledger;
create trigger credit_ledger_immutable
before update or delete on public.credit_ledger
for each row execute function public.reject_credit_ledger_mutation();

create or replace function public.record_payment_provider_event(
  p_provider text,
  p_provider_event_id text,
  p_event_type text,
  p_normalized_payload jsonb default '{}'::jsonb
)
returns public.payment_provider_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.payment_provider_events%rowtype;
begin
  insert into public.payment_provider_events (
    provider,
    provider_event_id,
    event_type,
    normalized_payload
  ) values (
    p_provider,
    p_provider_event_id,
    p_event_type,
    coalesce(p_normalized_payload, '{}'::jsonb)
  )
  on conflict (provider, provider_event_id) do nothing;

  select * into v_event
  from public.payment_provider_events
  where provider = p_provider
    and provider_event_id = p_provider_event_id;

  return v_event;
end;
$$;

create or replace function public.mark_payment_provider_event_verified(
  p_provider text,
  p_provider_event_id text
)
returns public.payment_provider_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.payment_provider_events%rowtype;
begin
  select * into v_event
  from public.payment_provider_events
  where provider = p_provider
    and provider_event_id = p_provider_event_id
  for update;

  if not found then
    raise exception 'provider event not found';
  end if;

  if v_event.status in ('processed', 'ignored') then
    return v_event;
  end if;

  update public.payment_provider_events
  set status = 'verified',
      verified_at = coalesce(verified_at, now()),
      failed_at = null,
      last_error = null,
      updated_at = now()
  where id = v_event.id
  returning * into v_event;

  return v_event;
end;
$$;

create or replace function public.mark_payment_provider_event_failed(
  p_provider text,
  p_provider_event_id text,
  p_error text
)
returns public.payment_provider_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.payment_provider_events%rowtype;
begin
  select * into v_event
  from public.payment_provider_events
  where provider = p_provider
    and provider_event_id = p_provider_event_id
  for update;

  if not found then
    raise exception 'provider event not found';
  end if;

  if v_event.status in ('processed', 'ignored') then
    return v_event;
  end if;

  update public.payment_provider_events
  set status = 'failed',
      failed_at = now(),
      retry_count = retry_count + 1,
      last_error = p_error,
      updated_at = now()
  where id = v_event.id
  returning * into v_event;

  return v_event;
end;
$$;

create or replace function public.grant_advisor_credits(
  p_user_id uuid,
  p_purchase_id uuid
)
returns public.wallets
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_purchase public.purchases%rowtype;
  v_wallet public.wallets%rowtype;
  v_existing public.credit_ledger%rowtype;
  v_delta integer;
  v_balance integer;
  v_key text;
begin
  select * into v_purchase
  from public.purchases
  where id = p_purchase_id
    and user_id = p_user_id
    and product_code = 'advisor_10';

  if not found then
    raise exception 'advisor credit purchase not found';
  end if;

  v_delta := 10 * v_purchase.quantity;
  v_key := 'purchase:' || v_purchase.id::text || ':grant';

  insert into public.wallets(user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select * into v_wallet
  from public.wallets
  where user_id = p_user_id
  for update;

  select * into v_existing
  from public.credit_ledger
  where idempotency_key = v_key;

  if found then
    return v_wallet;
  end if;

  v_balance := v_wallet.advisor_credits + v_delta;

  insert into public.credit_ledger (
    user_id,
    delta,
    balance_after,
    entry_type,
    reason,
    reference_type,
    reference_id,
    idempotency_key,
    metadata
  ) values (
    p_user_id,
    v_delta,
    v_balance,
    'purchase',
    'purchase_grant',
    'purchase',
    v_purchase.id::text,
    v_key,
    jsonb_build_object('quantity', v_purchase.quantity)
  );

  update public.wallets
  set advisor_credits = v_balance,
      lifetime_credits_purchased = lifetime_credits_purchased + v_delta,
      version = version + 1,
      updated_at = now()
  where user_id = p_user_id
  returning * into v_wallet;

  return v_wallet;
end;
$$;

create or replace function public.reserve_advisor_credit(
  p_user_id uuid,
  p_conversation_id uuid,
  p_user_message_id uuid,
  p_idempotency_key text,
  p_reservation_expires_at timestamptz
)
returns public.advisor_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.advisor_requests%rowtype;
  v_wallet public.wallets%rowtype;
  v_reserved integer;
begin
  select * into v_request
  from public.advisor_requests
  where user_id = p_user_id
    and idempotency_key = p_idempotency_key;

  if found then
    return v_request;
  end if;

  if p_reservation_expires_at <= now() then
    raise exception 'reservation expiry must be in the future';
  end if;

  if not exists (
    select 1
    from public.conversations c
    join public.messages m
      on m.id = p_user_message_id
     and m.conversation_id = c.id
    where c.id = p_conversation_id
      and c.user_id = p_user_id
      and m.user_id = p_user_id
      and m.role = 'user'
  ) then
    raise exception 'advisor request conversation/user message ownership mismatch';
  end if;

  insert into public.wallets(user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select * into v_wallet
  from public.wallets
  where user_id = p_user_id
  for update;

  -- Re-check retry identity after acquiring the per-user serialization lock.
  select * into v_request
  from public.advisor_requests
  where user_id = p_user_id
    and idempotency_key = p_idempotency_key;

  if found then
    return v_request;
  end if;

  select coalesce(sum(credits_reserved), 0)::integer
  into v_reserved
  from public.advisor_requests
  where user_id = p_user_id
    and state = 'reserved'
    and reservation_expires_at > now();

  if v_wallet.advisor_credits - v_reserved < 1 then
    raise exception 'insufficient available advisor credits';
  end if;

  insert into public.advisor_requests (
    user_id,
    conversation_id,
    user_message_id,
    idempotency_key,
    reservation_expires_at
  ) values (
    p_user_id,
    p_conversation_id,
    p_user_message_id,
    p_idempotency_key,
    p_reservation_expires_at
  )
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.commit_advisor_credit(
  p_user_id uuid,
  p_advisor_request_id uuid,
  p_assistant_message_id uuid
)
returns public.advisor_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.advisor_requests%rowtype;
  v_wallet public.wallets%rowtype;
  v_ledger public.credit_ledger%rowtype;
  v_balance integer;
  v_key text;
begin
  select * into v_request
  from public.advisor_requests
  where id = p_advisor_request_id
    and user_id = p_user_id
  for update;

  if not found then
    raise exception 'advisor request not found';
  end if;

  if v_request.state = 'committed' then
    return v_request;
  end if;

  if v_request.state = 'released' then
    return v_request;
  end if;

  if v_request.reservation_expires_at <= now() then
    update public.advisor_requests
    set state = 'released',
        release_reason = 'reservation_expired',
        released_at = now(),
        updated_at = now()
    where id = v_request.id
      and state = 'reserved'
    returning * into v_request;
    return v_request;
  end if;

  if not exists (
    select 1
    from public.messages m
    where m.id = p_assistant_message_id
      and m.user_id = p_user_id
      and m.conversation_id = v_request.conversation_id
      and m.role = 'assistant'
  ) then
    raise exception 'assistant message ownership mismatch';
  end if;

  select * into v_wallet
  from public.wallets
  where user_id = p_user_id
  for update;

  if not found or v_wallet.advisor_credits < 1 then
    raise exception 'wallet has no committed advisor credit to consume';
  end if;

  v_key := 'advisor_request:' || v_request.id::text || ':commit';

  select * into v_ledger
  from public.credit_ledger
  where idempotency_key = v_key;

  if not found then
    v_balance := v_wallet.advisor_credits - 1;

    if v_balance < 0 then
      raise exception 'wallet cannot become negative';
    end if;

    insert into public.credit_ledger (
      user_id,
      delta,
      balance_after,
      entry_type,
      reason,
      reference_type,
      reference_id,
      idempotency_key,
      message_id,
      metadata
    ) values (
      p_user_id,
      -1,
      v_balance,
      'usage',
      'advisor_usage',
      'advisor_request',
      v_request.id::text,
      v_key,
      p_assistant_message_id,
      '{}'::jsonb
    )
    returning * into v_ledger;

    update public.wallets
    set advisor_credits = v_balance,
        version = version + 1,
        updated_at = now()
    where user_id = p_user_id
    returning * into v_wallet;
  end if;

  update public.advisor_requests
  set state = 'committed',
      assistant_message_id = p_assistant_message_id,
      commit_ledger_entry_id = v_ledger.id,
      committed_at = coalesce(committed_at, now()),
      updated_at = now()
  where id = v_request.id
    and state = 'reserved'
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.release_advisor_credit(
  p_user_id uuid,
  p_advisor_request_id uuid,
  p_release_reason text
)
returns public.advisor_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.advisor_requests%rowtype;
begin
  if p_release_reason not in (
    'provider_error',
    'timeout',
    'invalid_output',
    'server_error',
    'reservation_expired'
  ) then
    raise exception 'invalid advisor release reason';
  end if;

  select * into v_request
  from public.advisor_requests
  where id = p_advisor_request_id
    and user_id = p_user_id
  for update;

  if not found then
    raise exception 'advisor request not found';
  end if;

  if v_request.state in ('released', 'committed') then
    return v_request;
  end if;

  update public.advisor_requests
  set state = 'released',
      release_reason = p_release_reason,
      released_at = now(),
      updated_at = now()
  where id = v_request.id
    and state = 'reserved'
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.grant_report_entitlement(
  p_user_id uuid,
  p_purchase_id uuid
)
returns public.report_entitlements
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_purchase public.purchases%rowtype;
  v_entitlement public.report_entitlements%rowtype;
begin
  select * into v_purchase
  from public.purchases
  where id = p_purchase_id
    and user_id = p_user_id
    and product_code = 'personality_report';

  if not found or v_purchase.resource_id is null then
    raise exception 'report purchase with resource is required';
  end if;

  insert into public.report_entitlements (
    user_id,
    product_code,
    resource_id,
    source_purchase_id
  ) values (
    p_user_id,
    'personality_report',
    v_purchase.resource_id,
    v_purchase.id
  )
  on conflict (user_id, product_code, resource_id)
  do update set
    source_purchase_id = excluded.source_purchase_id,
    status = 'active',
    granted_at = case
      when public.report_entitlements.status = 'revoked' then now()
      else public.report_entitlements.granted_at
    end,
    revoked_at = null,
    updated_at = now()
  returning * into v_entitlement;

  return v_entitlement;
end;
$$;

create or replace function public.revoke_report_entitlement(
  p_user_id uuid,
  p_resource_id uuid
)
returns public.report_entitlements
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_entitlement public.report_entitlements%rowtype;
begin
  select * into v_entitlement
  from public.report_entitlements
  where user_id = p_user_id
    and product_code = 'personality_report'
    and resource_id = p_resource_id
  for update;

  if not found then
    raise exception 'report entitlement not found';
  end if;

  if v_entitlement.status = 'revoked' then
    return v_entitlement;
  end if;

  update public.report_entitlements
  set status = 'revoked',
      revoked_at = now(),
      updated_at = now()
  where id = v_entitlement.id
  returning * into v_entitlement;

  return v_entitlement;
end;
$$;

create or replace function public.fulfill_verified_payment_event(
  p_provider text,
  p_provider_event_id text,
  p_order_id uuid
)
returns public.purchases
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.payment_provider_events%rowtype;
  v_order public.orders%rowtype;
  v_purchase public.purchases%rowtype;
  v_wallet public.wallets%rowtype;
  v_ledger public.credit_ledger%rowtype;
  v_delta integer;
  v_balance integer;
  v_key text;
begin
  select * into v_event
  from public.payment_provider_events
  where provider = p_provider
    and provider_event_id = p_provider_event_id
  for update;

  if not found then
    raise exception 'provider event not found';
  end if;

  if v_event.status = 'processed' then
    select * into v_purchase
    from public.purchases
    where order_id = coalesce(v_event.order_id, p_order_id);
    return v_purchase;
  end if;

  if v_event.status <> 'verified' then
    raise exception 'provider event must be verified before fulfillment';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  if v_order.provider <> p_provider then
    raise exception 'provider/order mismatch';
  end if;

  if v_order.status = 'pending' then
    update public.orders
    set status = 'paid',
        paid_at = coalesce(paid_at, now()),
        updated_at = now()
    where id = v_order.id
    returning * into v_order;
  elsif v_order.status <> 'paid' then
    raise exception 'invalid order transition to paid from %', v_order.status;
  end if;

  if v_order.product_code = 'personality_report' and v_order.report_id is null then
    raise exception 'personality_report order requires report_id';
  end if;

  insert into public.purchases (
    user_id,
    order_id,
    product_code,
    quantity,
    currency,
    unit_amount_minor,
    resource_id,
    entitlement
  ) values (
    v_order.user_id,
    v_order.id,
    v_order.product_code,
    1,
    v_order.currency,
    v_order.amount_minor,
    case when v_order.product_code = 'personality_report' then v_order.report_id else null end,
    '{}'::jsonb
  )
  on conflict (order_id) do nothing;

  select * into v_purchase
  from public.purchases
  where order_id = v_order.id;

  if v_purchase.product_code = 'personality_report' then
    insert into public.report_entitlements (
      user_id,
      product_code,
      resource_id,
      source_purchase_id
    ) values (
      v_purchase.user_id,
      'personality_report',
      v_purchase.resource_id,
      v_purchase.id
    )
    on conflict (user_id, product_code, resource_id)
    do update set
      source_purchase_id = excluded.source_purchase_id,
      status = 'active',
      granted_at = case
        when public.report_entitlements.status = 'revoked' then now()
        else public.report_entitlements.granted_at
      end,
      revoked_at = null,
      updated_at = now();
  else
    v_delta := 10 * v_purchase.quantity;
    v_key := 'purchase:' || v_purchase.id::text || ':grant';

    insert into public.wallets(user_id)
    values (v_purchase.user_id)
    on conflict (user_id) do nothing;

    select * into v_wallet
    from public.wallets
    where user_id = v_purchase.user_id
    for update;

    select * into v_ledger
    from public.credit_ledger
    where idempotency_key = v_key;

    if not found then
      v_balance := v_wallet.advisor_credits + v_delta;

      insert into public.credit_ledger (
        user_id,
        delta,
        balance_after,
        entry_type,
        reason,
        reference_type,
        reference_id,
        idempotency_key,
        order_id,
        metadata
      ) values (
        v_purchase.user_id,
        v_delta,
        v_balance,
        'purchase',
        'purchase_grant',
        'purchase',
        v_purchase.id::text,
        v_key,
        v_order.id,
        jsonb_build_object('quantity', v_purchase.quantity)
      )
      returning * into v_ledger;

      update public.wallets
      set advisor_credits = v_balance,
          lifetime_credits_purchased = lifetime_credits_purchased + v_delta,
          version = version + 1,
          updated_at = now()
      where user_id = v_purchase.user_id
      returning * into v_wallet;
    end if;

    update public.orders
    set credits_granted = v_delta,
        updated_at = now()
    where id = v_order.id;
  end if;

  update public.payment_provider_events
  set status = 'processed',
      order_id = v_order.id,
      processed_at = now(),
      last_error = null,
      updated_at = now()
  where id = v_event.id;

  return v_purchase;
end;
$$;

alter table public.payment_provider_events enable row level security;
alter table public.report_entitlements enable row level security;
alter table public.advisor_requests enable row level security;

create policy "report_entitlements_select_own"
on public.report_entitlements for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "advisor_requests_select_own"
on public.advisor_requests for select
to authenticated
using ((select auth.uid()) = user_id);

-- Defense in depth: browser/authenticated roles can read their own billing state,
-- but cannot mutate any billing authority tables directly.
grant select on public.orders,
  public.purchases,
  public.report_entitlements,
  public.wallets,
  public.credit_ledger,
  public.advisor_requests
to authenticated;

revoke insert, update, delete on public.orders,
  public.purchases,
  public.report_entitlements,
  public.wallets,
  public.credit_ledger,
  public.advisor_requests,
  public.payment_provider_events
from anon, authenticated;

revoke select on public.payment_provider_events from anon, authenticated;

revoke execute on function public.record_payment_provider_event(text, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.mark_payment_provider_event_verified(text, text) from public, anon, authenticated;
revoke execute on function public.mark_payment_provider_event_failed(text, text, text) from public, anon, authenticated;
revoke execute on function public.grant_advisor_credits(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.reserve_advisor_credit(uuid, uuid, uuid, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.commit_advisor_credit(uuid, uuid, uuid) from public, anon, authenticated;
revoke execute on function public.release_advisor_credit(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.grant_report_entitlement(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.revoke_report_entitlement(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.fulfill_verified_payment_event(text, text, uuid) from public, anon, authenticated;

grant execute on function public.record_payment_provider_event(text, text, text, jsonb) to service_role;
grant execute on function public.mark_payment_provider_event_verified(text, text) to service_role;
grant execute on function public.mark_payment_provider_event_failed(text, text, text) to service_role;
grant execute on function public.grant_advisor_credits(uuid, uuid) to service_role;
grant execute on function public.reserve_advisor_credit(uuid, uuid, uuid, text, timestamptz) to service_role;
grant execute on function public.commit_advisor_credit(uuid, uuid, uuid) to service_role;
grant execute on function public.release_advisor_credit(uuid, uuid, text) to service_role;
grant execute on function public.grant_report_entitlement(uuid, uuid) to service_role;
grant execute on function public.revoke_report_entitlement(uuid, uuid) to service_role;
grant execute on function public.fulfill_verified_payment_event(text, text, uuid) to service_role;

commit;
