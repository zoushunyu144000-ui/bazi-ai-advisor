begin;

create policy "conversations_select_own"
on public.conversations for select
using (auth.uid() = user_id);

create policy "conversations_insert_own"
on public.conversations for insert
with check (
  auth.uid() = user_id
  and (
    report_id is null
    or exists (
      select 1
      from public.reports r
      where r.id = report_id
        and r.user_id = auth.uid()
    )
  )
);

create policy "conversations_update_own"
on public.conversations for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    report_id is null
    or exists (
      select 1
      from public.reports r
      where r.id = report_id
        and r.user_id = auth.uid()
    )
  )
);

create policy "conversations_delete_own"
on public.conversations for delete
using (auth.uid() = user_id);

create policy "messages_select_own"
on public.messages for select
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

-- Direct user clients may append only their own zero-cost user messages.
-- Assistant/system/tool messages and any credit-bearing write require the server secret.
create policy "messages_insert_own"
on public.messages for insert
with check (
  auth.uid() = user_id
  and role = 'user'
  and credit_cost = 0
  and model_provider is null
  and model_name is null
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

create policy "user_memories_select_own"
on public.user_memories for select
using (auth.uid() = user_id);

create policy "user_memories_insert_own"
on public.user_memories for insert
with check (
  auth.uid() = user_id
  and is_user_editable = true
  and (
    conversation_id is null
    or exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  and (
    source_message_id is null
    or exists (
      select 1
      from public.messages m
      where m.id = source_message_id
        and m.user_id = auth.uid()
    )
  )
);

create policy "user_memories_update_own"
on public.user_memories for update
using (auth.uid() = user_id and is_user_editable = true)
with check (
  auth.uid() = user_id
  and is_user_editable = true
  and (
    conversation_id is null
    or exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  and (
    source_message_id is null
    or exists (
      select 1
      from public.messages m
      where m.id = source_message_id
        and m.user_id = auth.uid()
    )
  )
);

create policy "user_memories_delete_own"
on public.user_memories for delete
using (auth.uid() = user_id and is_user_editable = true);

create policy "wallets_select_own"
on public.wallets for select
using (auth.uid() = user_id);

create policy "credit_ledger_select_own"
on public.credit_ledger for select
using (auth.uid() = user_id);

create policy "orders_select_own"
on public.orders for select
using (auth.uid() = user_id);

create policy "purchases_select_own"
on public.purchases for select
using (auth.uid() = user_id);

-- Intentionally no direct client mutation policies for charts, derived features,
-- reports, wallets, credit_ledger, orders, purchases, or analytics_events.
-- These writes require a trusted server client using SUPABASE_SECRET_KEY (or legacy
-- service-role key), where higher-level services must provide authorization,
-- idempotency, and transaction semantics.

commit;
