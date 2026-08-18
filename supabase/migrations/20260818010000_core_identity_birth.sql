-- Bazi AI Advisor Supabase core schema
-- Canonical identity: auth.users
-- Sensitive generated/billing writes are service-only and rely on a server secret that bypasses RLS.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
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
  resolved_birth_instant timestamptz,
  utc_offset_minutes_at_birth integer,
  place_name text,
  country_code char(2),
  latitude numeric(9,6),
  longitude numeric(9,6),
  sex_for_traditional_rules text not null default 'unspecified'
    check (sex_for_traditional_rules in ('male', 'female', 'unspecified')),
  input_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (birth_time_precision = 'unknown' and birth_time is null)
    or (birth_time_precision <> 'unknown' and birth_time is not null)
  ),
  check (
    (resolved_birth_instant is null and utc_offset_minutes_at_birth is null)
    or (resolved_birth_instant is not null and utc_offset_minutes_at_birth is not null)
  ),
  check (
    utc_offset_minutes_at_birth is null
    or utc_offset_minutes_at_birth between -840 and 840
  )
);

commit;
