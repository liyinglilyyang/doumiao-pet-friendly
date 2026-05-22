-- ============================================================
-- place_submissions: user-submitted place leads (not yet verified)
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS place_submissions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Basic info
  name          TEXT        NOT NULL,
  city          TEXT        NOT NULL,
  district      TEXT,
  address       TEXT,
  category      TEXT        NOT NULL DEFAULT 'other',
  -- pet_owner | business | staff | passerby
  submitter_type TEXT       DEFAULT 'passerby',

  -- Pet policy
  pet_rules_description TEXT,
  indoor_allowed        BOOLEAN DEFAULT false,
  outdoor_seating       BOOLEAN DEFAULT false,
  small_dog_allowed     BOOLEAN DEFAULT false,
  medium_dog_allowed    BOOLEAN DEFAULT false,
  large_dog_allowed     BOOLEAN DEFAULT false,
  water_provided        BOOLEAN DEFAULT false,

  -- Contact / links
  contact_phone    TEXT,
  contact_wechat   TEXT,
  xiaohongshu_url  TEXT,
  submitter_contact TEXT,

  -- Media
  images  TEXT[] DEFAULT '{}',

  -- Review state
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes   TEXT,
  reviewed_at   TIMESTAMPTZ,
  place_id      UUID REFERENCES places(id) ON DELETE SET NULL
);

-- RLS: public can only INSERT
ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_submissions" ON place_submissions;
CREATE POLICY "public_insert_submissions"
  ON place_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Indexes for admin filtering
CREATE INDEX IF NOT EXISTS idx_place_submissions_status
  ON place_submissions(status);
CREATE INDEX IF NOT EXISTS idx_place_submissions_created
  ON place_submissions(created_at DESC);
