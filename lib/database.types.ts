export type VerificationStatus =
  | 'unverified'
  | 'phone_verified'
  | 'visited'
  | 'doumiao_verified'
  | 'visited_verified'
  | 'partner_verified'

export type PlaceCategory =
  | 'cafe'
  | 'restaurant'
  | 'hotel'
  | 'park'
  | 'boarding'
  | 'grooming'
  | 'transport'

export type CitySlug = 'guangzhou' | 'shenzhen' | 'hongkong'

export type PetSizeAllowed = 'small' | 'medium' | 'large' | 'all' | 'unknown'

export type VerificationSource =
  | 'phone_call'
  | 'visit'
  | 'user_submit'
  | 'merchant_submit'
  | 'web'

export interface PlaceRow {
  // ── Identity ─────────────────────────────────────────────
  id: string
  name: string
  city: CitySlug
  district: string | null
  address: string | null
  category: PlaceCategory

  // ── Description ──────────────────────────────────────────
  description: string | null
  pet_policy: string | null
  rules_text: string | null
  business_hours: string | null

  // ── Pet rules (boolean) ──────────────────────────────────
  indoor_allowed: boolean
  outdoor_allowed: boolean
  outdoor_seating: boolean
  large_dog_allowed: boolean
  cat_allowed: boolean
  water_available: boolean
  water_provided: boolean
  pet_menu: boolean
  leash_required: boolean
  carrier_required: boolean
  pet_size_allowed: PetSizeAllowed

  // ── 豆苗观察 ─────────────────────────────────────────────
  genuinely_welcoming: boolean | null
  large_dog_vibe:      boolean | null
  staff_engages:       boolean | null
  dog_relaxed:         boolean | null
  vibe_social:         boolean | null
  weekend_crowded:     boolean | null
  no_judgement:        boolean | null

  // ── Verification ─────────────────────────────────────────
  verification_status: VerificationStatus
  verification_notes: string | null
  source: VerificationSource
  last_verified_at: string | null

  // ── Scores (0–5) ─────────────────────────────────────────
  doumiao_score: number | null
  environment_score: number | null
  staff_score: number | null
  staff_friendliness_score: number | null
  freedom_score: number | null
  large_dog_score: number | null
  pet_friendliness_score: number | null

  // ── Media & links ────────────────────────────────────────
  images: string[] | null
  phone: string | null
  contact_phone: string | null
  wechat: string | null
  xiaohongshu_url: string | null
  booking_url: string | null

  // ── Location ─────────────────────────────────────────────
  latitude: number | null
  longitude: number | null

  // ── Meta ─────────────────────────────────────────────────
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type SubmissionCategory = PlaceCategory | 'other'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'
export type SubmitterType = 'pet_owner' | 'business' | 'staff' | 'passerby'

export interface PlaceSubmission {
  id: string
  created_at: string

  name: string
  city: string
  district: string | null
  address: string | null
  category: SubmissionCategory
  submitter_type: SubmitterType | null

  pet_rules_description: string | null
  indoor_allowed: boolean | null
  outdoor_seating: boolean | null
  small_dog_allowed: boolean | null
  medium_dog_allowed: boolean | null
  large_dog_allowed: boolean | null
  water_provided: boolean | null

  contact_phone: string | null
  contact_wechat: string | null
  xiaohongshu_url: string | null
  submitter_contact: string | null

  images: string[]

  // ── 豆苗观察 (user-reported perceptions) ─────────────────
  genuinely_welcoming: boolean | null
  large_dog_vibe:      boolean | null
  staff_engages:       boolean | null
  dog_relaxed:         boolean | null
  vibe_social:         boolean | null
  weekend_crowded:     boolean | null
  no_judgement:        boolean | null

  status: SubmissionStatus
  admin_notes: string | null
  reviewed_at: string | null
  place_id: string | null
}

export interface Database {
  public: {
    Tables: {
      places: {
        Row: PlaceRow
        Insert: Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>>
      }
      place_submissions: {
        Row: PlaceSubmission
        Insert: Omit<PlaceSubmission, 'id' | 'created_at' | 'status' | 'reviewed_at' | 'place_id'>
        Update: Partial<PlaceSubmission>
      }
    }
  }
}
