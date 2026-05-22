-- ============================================================
-- 豆苗宠物友好 · Migration v2
-- 增加宠物友好标准化字段
-- 在 Supabase Dashboard → SQL Editor 中运行
-- 安全：只增加列，不删除任何现有数据
-- ============================================================

-- ── 1. 扩展 verification_status 的 CHECK 约束 ──────────────
-- 先删除旧的约束，再添加包含新值的约束
ALTER TABLE public.places
  DROP CONSTRAINT IF EXISTS places_verification_status_check;

ALTER TABLE public.places
  ADD CONSTRAINT places_verification_status_check
  CHECK (verification_status IN (
    'unverified',
    'phone_verified',
    'visited',
    'doumiao_verified',
    'visited_verified',
    'partner_verified'
  ));

-- ── 2. 新增字段 ─────────────────────────────────────────────

-- 宠物体型限制 (small/medium/large/all/unknown)
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS pet_size_allowed TEXT NOT NULL DEFAULT 'unknown'
  CHECK (pet_size_allowed IN ('small', 'medium', 'large', 'all', 'unknown'));

-- 户外座位（区别于 outdoor_allowed - 是否有专门的户外用餐/活动区域）
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS outdoor_seating BOOLEAN NOT NULL DEFAULT false;

-- 提供饮水（更标准化的字段名，water_available 保留做兼容）
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS water_provided BOOLEAN NOT NULL DEFAULT false;

-- 是否需要携带笼/袋
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS carrier_required BOOLEAN NOT NULL DEFAULT false;

-- 宠物综合友好度评分 (0–5)
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS pet_friendliness_score NUMERIC(3,1)
  CHECK (pet_friendliness_score BETWEEN 0 AND 5);

-- 店员对宠物友好度评分 (0–5)，与 staff_score 语义一致，作为标准字段
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS staff_friendliness_score NUMERIC(3,1)
  CHECK (staff_friendliness_score BETWEEN 0 AND 5);

-- 认证备注
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- 信息来源
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'web'
  CHECK (source IN ('phone_call', 'visit', 'user_submit', 'merchant_submit', 'web'));

-- 最后验证时间
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

-- 联系电话（标准化字段名，phone 保留做兼容）
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- 营业时间
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS business_hours TEXT;

-- 宠物规则原文（比 pet_policy 更结构化，用于存储商家公布的原始规则）
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS rules_text TEXT;

-- ── 3. 同步旧字段值到新字段 ────────────────────────────────
-- 将现有 phone → contact_phone (如果 contact_phone 为空)
UPDATE public.places
  SET contact_phone = phone
  WHERE contact_phone IS NULL AND phone IS NOT NULL;

-- 将现有 water_available → water_provided
UPDATE public.places
  SET water_provided = water_available
  WHERE water_provided = false AND water_available = true;

-- 将现有 outdoor_allowed → outdoor_seating
UPDATE public.places
  SET outdoor_seating = outdoor_allowed
  WHERE outdoor_seating = false AND outdoor_allowed = true;

-- ── 4. 新索引 ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS places_pet_size_idx ON public.places (pet_size_allowed);
CREATE INDEX IF NOT EXISTS places_last_verified_idx ON public.places (last_verified_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS places_source_idx ON public.places (source);
