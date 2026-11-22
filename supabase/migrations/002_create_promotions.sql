-- Barberia Carlyn — Isolated Promotions Table (Supabase Preview)
-- Run ONLY in the dedicated Preview Supabase project.
-- Does not touch analytics_events, client tables, or Production.

create table if not exists public.promotions (
  id text primary key,
  title text not null,
  description text not null default '',
  image_url text null,
  cta_label text not null,
  cta_url text not null,
  cta_type text not null default 'whatsapp' check (cta_type in ('whatsapp', 'link')),
  target_branches text[] not null default array['all']::text[],
  target_paths text[] not null default array[]::text[],
  status text not null default 'paused' check (status in ('active', 'paused')),
  starts_at timestamptz null,
  ends_at timestamptz null,
  frequency_mode text not null default 'once_per_day' check (
    frequency_mode in ('once_per_session', 'once_per_day', 'every_n_days')
  ),
  frequency_days integer not null default 1 check (frequency_days >= 1 and frequency_days <= 90),
  delay_seconds integer not null default 3 check (delay_seconds >= 0 and delay_seconds <= 60),
  priority integer not null default 10 check (priority >= 0 and priority <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_promotions_status_priority
  on public.promotions (status, priority desc, created_at desc);

create index if not exists idx_promotions_schedule
  on public.promotions (starts_at, ends_at);

-- Strict Row Level Security: backend-only via Service Role
alter table public.promotions enable row level security;
alter table public.promotions force row level security;

revoke all on table public.promotions from anon, authenticated, public;
grant all on table public.promotions to service_role;
