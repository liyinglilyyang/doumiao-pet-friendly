-- Migration v2: 豆苗观察 fields
-- Run this in Supabase SQL Editor

-- Add observation fields to place_submissions (user-reported when submitting)
ALTER TABLE place_submissions
  ADD COLUMN IF NOT EXISTS genuinely_welcoming boolean,
  ADD COLUMN IF NOT EXISTS large_dog_vibe      boolean,
  ADD COLUMN IF NOT EXISTS staff_engages       boolean,
  ADD COLUMN IF NOT EXISTS dog_relaxed         boolean,
  ADD COLUMN IF NOT EXISTS vibe_social         boolean,
  ADD COLUMN IF NOT EXISTS weekend_crowded     boolean,
  ADD COLUMN IF NOT EXISTS no_judgement        boolean;

-- Add observation fields to places (admin-curated after verification)
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS genuinely_welcoming boolean,
  ADD COLUMN IF NOT EXISTS large_dog_vibe      boolean,
  ADD COLUMN IF NOT EXISTS staff_engages       boolean,
  ADD COLUMN IF NOT EXISTS dog_relaxed         boolean,
  ADD COLUMN IF NOT EXISTS vibe_social         boolean,
  ADD COLUMN IF NOT EXISTS weekend_crowded     boolean,
  ADD COLUMN IF NOT EXISTS no_judgement        boolean;
