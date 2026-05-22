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

export interface Database {
  public: {
    Tables: {
      places: {
        Row: PlaceRow
        Insert: Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
