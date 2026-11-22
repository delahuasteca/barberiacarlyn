-- Barberia Carlyn — Isolated Promotions Table (Neon Production)
-- Run manually in Neon SQL Editor ONLY when Production release is authorized.
-- Pure PostgreSQL (no Supabase roles/RLS blocks). Does not touch analytics_events.

CREATE TABLE IF NOT EXISTS public.promotions (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NULL,
  cta_label text NOT NULL,
  cta_url text NOT NULL,
  cta_type text NOT NULL DEFAULT 'whatsapp' CHECK (cta_type IN ('whatsapp', 'link')),
  target_branches text[] NOT NULL DEFAULT ARRAY['all']::text[],
  target_paths text[] NOT NULL DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'paused' CHECK (status IN ('active', 'paused')),
  starts_at timestamptz NULL,
  ends_at timestamptz NULL,
  frequency_mode text NOT NULL DEFAULT 'once_per_day' CHECK (
    frequency_mode IN ('once_per_session', 'once_per_day', 'every_n_days')
  ),
  frequency_days integer NOT NULL DEFAULT 1 CHECK (frequency_days >= 1 AND frequency_days <= 90),
  delay_seconds integer NOT NULL DEFAULT 3 CHECK (delay_seconds >= 0 AND delay_seconds <= 60),
  priority integer NOT NULL DEFAULT 10 CHECK (priority >= 0 AND priority <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotions_status_priority
  ON public.promotions (status, priority DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_promotions_schedule
  ON public.promotions (starts_at, ends_at);
