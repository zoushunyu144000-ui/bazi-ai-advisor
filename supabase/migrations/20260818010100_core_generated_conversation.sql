begin;

create table if not exists public.bazi_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  birth_profile_id uuid not null references public.birth_profiles(id) on delete cascade,
  chart jsonb not null,
  calculation_metadata jsonb not null,
  relations jsonb not null default '[]'::jsonb,
  luck jsonb not null,
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
  content jsonb not null default '[]'::jsonb,
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

commit;
