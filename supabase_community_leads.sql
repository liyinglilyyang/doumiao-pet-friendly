-- Community leads table for lightweight private domain conversion
-- Run this in Supabase SQL Editor

create table if not exists community_leads (
  id          uuid        primary key default gen_random_uuid(),
  contact     text        not null,
  city        text,
  pet_type    text,
  intent      text[],
  source_page text,
  contacted   boolean     not null default false,
  created_at  timestamptz not null default now()
);

alter table community_leads enable row level security;

-- Block all direct client access — inserts go through the API route (service role)
-- No select policy needed for anonymous users

-- Verify
select count(*) from community_leads;
