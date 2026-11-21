-- Barberia Carlyn — Isolated Commercial Analytics Table
-- Run this script ONLY in the dedicated Preview/Analytics Supabase project.
-- Does not touch any client, appointment, or DIGITA3 Fideliza tables.

create table if not exists public.analytics_events (
  id text primary key,
  type text not null check (
    type in (
      'branch_view',
      'service_view',
      'whatsapp_click',
      'booking_request',
      'chat_started',
      'chat_lead',
      'review_click'
    )
  ),
  stage text not null check (
    stage in (
      'visita',
      'interaccion',
      'clic',
      'contacto',
      'solicitud_cita',
      'cita_confirmada',
      'servicio_realizado'
    )
  ),
  timestamp timestamptz not null default now(),
  branch_id text null check (
    branch_id is null or branch_id in ('aviacion-civil', 'ex-glorieta', 'jacarandas')
  ),
  service_name text null,
  source text not null,
  origin_url text not null default '/',
  session_id text not null,
  dedup_key text not null,
  metadata jsonb null,
  is_test boolean not null default false,
  created_at timestamptz not null default now()
);

-- Performance indexes for dashboard windows, branch breakdowns, and deduplication
create index if not exists idx_analytics_events_timestamp
  on public.analytics_events (timestamp desc);

create index if not exists idx_analytics_events_branch_timestamp
  on public.analytics_events (branch_id, timestamp desc);

create index if not exists idx_analytics_events_dedup_timestamp
  on public.analytics_events (dedup_key, timestamp desc);

create index if not exists idx_analytics_events_is_test_timestamp
  on public.analytics_events (is_test, timestamp desc);

-- Strict Row Level Security: backend-only via Service Role
alter table public.analytics_events enable row level security;
alter table public.analytics_events force row level security;

-- Explicitly revoke direct access from public/anon/authenticated client roles
revoke all on table public.analytics_events from anon, authenticated, public;
