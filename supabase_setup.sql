-- ============================================================
-- 豆苗宠物友好 · DouMiao Pet Friendly
-- Supabase 数据库建表 SQL
-- 在 Supabase Dashboard → SQL Editor 中运行
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── places 表 ────────────────────────────────────────────────
create table if not exists public.places (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  city                text not null check (city in ('guangzhou', 'shenzhen', 'hongkong')),
  district            text,
  address             text,
  category            text not null check (category in ('cafe','restaurant','hotel','park','boarding','grooming','transport')),
  description         text,
  pet_policy          text,

  -- Pet rules
  indoor_allowed      boolean not null default false,
  outdoor_allowed     boolean not null default true,
  large_dog_allowed   boolean not null default false,
  cat_allowed         boolean not null default true,
  water_available     boolean not null default false,
  pet_menu            boolean not null default false,
  leash_required      boolean not null default true,

  -- Verification
  verification_status text not null default 'unverified'
                       check (verification_status in ('unverified','phone_verified','visited','doumiao_verified')),

  -- Scores (0–5 range)
  doumiao_score       numeric(3,1) check (doumiao_score between 0 and 5),
  environment_score   numeric(3,1) check (environment_score between 0 and 5),
  staff_score         numeric(3,1) check (staff_score between 0 and 5),
  freedom_score       numeric(3,1) check (freedom_score between 0 and 5),
  large_dog_score     numeric(3,1) check (large_dog_score between 0 and 5),

  -- Media & links
  images              text[],
  phone               text,
  wechat              text,
  xiaohongshu_url     text,
  booking_url         text,

  -- Location
  latitude            double precision,
  longitude           double precision,

  -- Meta
  is_featured         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists places_updated_at on public.places;
create trigger places_updated_at
  before update on public.places
  for each row execute function public.handle_updated_at();

-- Indexes
create index if not exists places_city_idx on public.places (city);
create index if not exists places_category_idx on public.places (category);
create index if not exists places_featured_idx on public.places (is_featured) where is_featured = true;
create index if not exists places_score_idx on public.places (doumiao_score desc nulls last);

-- ── Row Level Security ────────────────────────────────────────
alter table public.places enable row level security;

-- Public can read all places
create policy "Public read access"
  on public.places for select
  using (true);

-- Only authenticated users (admins) can write
create policy "Auth write access"
  on public.places for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Storage bucket for images ─────────────────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: place-images
-- Public: true
-- OR run this SQL (requires storage schema):
-- insert into storage.buckets (id, name, public)
-- values ('place-images', 'place-images', true)
-- on conflict (id) do nothing;

-- ── Seed data (optional — mirrors mock data) ─────────────────
insert into public.places (
  name, city, district, address, category, description, pet_policy,
  indoor_allowed, outdoor_allowed, large_dog_allowed, cat_allowed,
  water_available, pet_menu, leash_required,
  verification_status, doumiao_score, environment_score, staff_score,
  freedom_score, large_dog_score,
  images, phone, wechat, is_featured
) values
(
  'W酒店广州', 'guangzhou', '天河区', '广州市天河区天河路385号',
  'hotel',
  'W酒店广州对宠物极为欢迎，大型犬和小型犬均可入住。酒店员工经过专业培训，能够为毛孩子提供温馨服务。',
  '需提前48小时预约告知宠物品种及体重，提供宠物专属欢迎礼包。清洁押金¥200/晚，退房归还。',
  true, true, true, true, true, false, true,
  'visited', 4.6, 4.5, 4.8, 4.0, 5.0,
  ARRAY['https://images.unsplash.com/photo-1566073771905-5df06b3e4f2e?auto=format&fit=crop&w=800&q=80'],
  '020-12345678', 'wgz_petfriendly', true
),
(
  'KUDDO COFFEE', 'guangzhou', '海珠区', '广州市海珠区滨江东路200号',
  'cafe',
  'KUDDO COFFEE 是广州海珠区知名宠物友好咖啡店，拥有宽敞的半户外空间。店主本身是狗狗爱好者，定期举办宠物社交活动。',
  '室内限20kg以内犬只，大型犬仅限户外区域。店内常备水碗，提供宠物零食。',
  true, true, false, true, true, true, true,
  'phone_verified', 4.8, 4.9, 5.0, 4.8, 4.0,
  ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'],
  '020-98765432', 'kuddo_coffee_gz', true
),
(
  'THE YARD 庭院餐厅', 'guangzhou', '越秀区', '广州市越秀区东风中路166号',
  'restaurant',
  '历史建筑改造的庭院餐厅，环境优雅，绿植丰富。宽敞的庭院区域非常适合带宠物一起用餐。',
  '仅庭院区域允许宠物，室内不可进入。请确保宠物不打扰其他用餐客人。限15kg以内犬只。',
  false, true, false, false, false, false, true,
  'unverified', 4.3, 4.5, 4.0, 3.5, 2.0,
  ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
  null, 'theyard_gz', false
),
(
  '萌宠之家 宠物酒店', 'guangzhou', '白云区', '广州市白云区机场路1288号',
  'boarding',
  '萌宠之家是广州知名宠物寄养机构，提供大中小型犬猫一站式寄养服务。24小时专业看护，配备户外运动区。',
  '需提前预约，携带宠物疫苗证明及健康证。可提供定制饮食服务，需提前告知。',
  true, true, true, true, true, false, false,
  'visited', 4.7, 4.5, 5.0, 4.5, 5.0,
  ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80'],
  '020-33344455', 'mengchong_gz', true
),
(
  'BREW BEAR COFFEE', 'shenzhen', '福田区', '深圳市福田区车公庙泰然工业园',
  'cafe',
  'BREW BEAR 是深圳口碑最好的宠物友好咖啡店，无论大型犬还是小猫咪都热烈欢迎。工业风格空间宽敞。',
  '全场宠物友好，无需牵引绳（建议控制）。提供宠物饮水站，可自助取用。有宠物专属菜单。',
  true, true, true, true, true, true, false,
  'visited', 4.9, 5.0, 5.0, 5.0, 5.0,
  ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'],
  '0755-87654321', 'brewbear_sz', true
),
(
  'Hotel ICON 深圳', 'shenzhen', '南山区', '深圳市南山区科技园南路88号',
  'hotel',
  'Hotel Icon 深圳位于南山科技园核心区，商务与宠物友好并重，提供专业宠物服务。',
  '接受25kg以下宠物，需提前预订宠物友好房型。宠物附加费¥150/晚。不可进入餐厅泳池区域。',
  true, true, false, true, false, false, true,
  'phone_verified', 4.5, 4.5, 4.8, 3.8, 3.0,
  ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
  '0755-12345678', 'hotelicon_sz', false
),
(
  'The Murray Hong Kong', 'hongkong', '中环', 'Murray Rd, Central, Hong Kong',
  'hotel',
  'The Murray 是香港中环标志性历史建筑改造的精品酒店，宠物政策友好，紧邻香港公园。',
  '接受30kg以下宠物，需提前72小时通知。押金HKD 500，退房归还。不可进入餐厅及酒吧。',
  true, true, true, true, false, false, true,
  'phone_verified', 4.4, 4.3, 4.8, 3.8, 4.0,
  ARRAY['https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80'],
  '+852-12345678', 'themurray_hk', true
),
(
  '毛毛上门服务', 'guangzhou', '天河区 / 越秀区 / 海珠区', '广州市（上门服务）',
  'transport',
  '毛毛上门服务团队拥有2年以上专业宠物护理经验，提供上门喂养、遛狗、洗澡、美容等全方位服务。',
  '提前1天预约，服务结束发送实时打卡记录。服务区域覆盖天河、越秀、海珠区。',
  true, true, true, true, true, false, false,
  'unverified', 4.6, 4.0, 4.8, 4.5, 4.5,
  ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'],
  '137-xxxx-xxxx', 'maomao_petservice', false
);
