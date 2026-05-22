import { getSupabase, createServiceClient } from './supabaseClient'
import type { PlaceRow, CitySlug, PlaceCategory, VerificationStatus, PetSizeAllowed, VerificationSource } from './database.types'

export type { PlaceRow, CitySlug, PlaceCategory, VerificationStatus, PetSizeAllowed, VerificationSource }

// ── Read (public) ──────────────────────────────────────────────

export interface PlaceFilters {
  city?: CitySlug
  category?: PlaceCategory
  featured?: boolean
  search?: string
  indoor?: boolean
  large_dog?: boolean
  outdoor_seating?: boolean
  water_provided?: boolean
  verification?: VerificationStatus
}

export async function getPlaces(filters?: PlaceFilters): Promise<PlaceRow[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('places')
    .select('*')
    .order('doumiao_score', { ascending: false })

  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.featured) query = query.eq('is_featured', true)
  if (filters?.indoor === true) query = query.eq('indoor_allowed', true)
  if (filters?.large_dog === true) query = query.eq('large_dog_allowed', true)
  if (filters?.outdoor_seating === true) query = query.eq('outdoor_seating', true)
  if (filters?.water_provided === true) query = query.eq('water_provided', true)
  if (filters?.verification) query = query.eq('verification_status', filters.verification)
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,district.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getPlaceById(id: string): Promise<PlaceRow | null> {
  const { data, error } = await getSupabase()
    .from('places')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

// ── Write (admin, uses service role via API route) ─────────────

export async function createPlace(
  data: Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>
): Promise<PlaceRow> {
  const client = createServiceClient()
  const { data: row, error } = await client
    .from('places')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row
}

export async function updatePlace(
  id: string,
  data: Partial<Omit<PlaceRow, 'id' | 'created_at' | 'updated_at'>>
): Promise<PlaceRow> {
  const client = createServiceClient()
  const { data: row, error } = await client
    .from('places')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return row
}

export async function deletePlace(id: string): Promise<void> {
  const client = createServiceClient()
  const { error } = await client.from('places').delete().eq('id', id)
  if (error) throw error
}

// ── Image upload ───────────────────────────────────────────────

export async function uploadPlaceImage(
  placeId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `places/${placeId}/${Date.now()}.${ext}`

  const sb = getSupabase()
  const { error: uploadError } = await sb.storage
    .from('place-images')
    .upload(path, file, { upsert: false })

  if (uploadError) throw uploadError

  const { data } = sb.storage.from('place-images').getPublicUrl(path)
  return data.publicUrl
}

export async function deletePlaceImage(url: string): Promise<void> {
  const marker = '/place-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await getSupabase().storage.from('place-images').remove([path])
}

// ── Label maps ────────────────────────────────────────────────

export const CITY_LABELS: Record<CitySlug, string> = {
  guangzhou: '广州',
  shenzhen: '深圳',
  hongkong: '香港',
}

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  cafe: '咖啡店',
  restaurant: '餐厅',
  hotel: '酒店',
  park: '公园',
  boarding: '宠物寄养',
  grooming: '美容洗护',
  transport: '宠物运输',
}

export const CATEGORY_EMOJIS: Record<PlaceCategory, string> = {
  cafe: '☕',
  restaurant: '🍽️',
  hotel: '🏨',
  park: '🌳',
  boarding: '🏠',
  grooming: '✂️',
  transport: '🚗',
}

export const VERIFICATION_LABELS: Record<VerificationStatus, { label: string; color: string }> = {
  unverified:       { label: '未验证',   color: 'gray' },
  phone_verified:   { label: '已电话确认', color: 'orange' },
  visited:          { label: '已实地探访', color: 'blue' },
  visited_verified: { label: '已实地验证', color: 'blue' },
  doumiao_verified: { label: '豆苗认证',  color: 'green' },
  partner_verified: { label: '合作认证',  color: 'green' },
}

export const PET_SIZE_LABELS: Record<PetSizeAllowed, string> = {
  small:   '小型犬猫',
  medium:  '中型犬',
  large:   '大型犬',
  all:     '全部体型',
  unknown: '体型不限',
}

export const SOURCE_LABELS: Record<VerificationSource, string> = {
  phone_call:      '电话核实',
  visit:           '实地探访',
  user_submit:     '用户提交',
  merchant_submit: '商家入驻',
  web:             '网络收录',
}

// ── Tag helpers ────────────────────────────────────────────────

export interface PlaceTag {
  key: string
  label: string
  style: string
}

export function buildPlaceTags(p: PlaceRow): PlaceTag[] {
  const tags: PlaceTag[] = []
  if (p.genuinely_welcoming === true)
    tags.push({ key: 'genuine', label: '真心欢迎', style: 'bg-emerald-50 text-emerald-700' })
  if (p.indoor_allowed)
    tags.push({ key: 'indoor', label: '可进室内', style: 'bg-blue-50 text-blue-700' })
  if (p.outdoor_seating || p.outdoor_allowed)
    tags.push({ key: 'outdoor', label: '有户外位', style: 'bg-green-50 text-green-700' })
  if (p.large_dog_allowed)
    tags.push({ key: 'large_dog', label: '大型犬友好', style: 'bg-amber-50 text-amber-700' })
  if (p.water_provided || p.water_available)
    tags.push({ key: 'water', label: '提供饮水', style: 'bg-sky-50 text-sky-700' })
  if (p.pet_menu)
    tags.push({ key: 'menu', label: '宠物菜单', style: 'bg-purple-50 text-purple-700' })
  if (p.cat_allowed)
    tags.push({ key: 'cat', label: '猫咪欢迎', style: 'bg-pink-50 text-pink-700' })
  if (p.leash_required)
    tags.push({ key: 'leash', label: '需牵引绳', style: 'bg-gray-50 text-gray-600' })
  return tags
}

export function buildVerifTag(status: VerificationStatus): PlaceTag | null {
  const verified: VerificationStatus[] = ['phone_verified', 'visited', 'visited_verified', 'doumiao_verified', 'partner_verified']
  if (!verified.includes(status)) return null
  const styleMap: Partial<Record<VerificationStatus, string>> = {
    phone_verified:   'bg-orange-50 text-orange-600',
    visited:          'bg-blue-50 text-blue-700',
    visited_verified: 'bg-blue-50 text-blue-700',
    doumiao_verified: 'bg-emerald-50 text-emerald-700',
    partner_verified: 'bg-emerald-50 text-emerald-700',
  }
  return {
    key: 'verif',
    label: VERIFICATION_LABELS[status].label,
    style: styleMap[status] ?? 'bg-gray-50 text-gray-500',
  }
}

export function computeOverallScore(row: PlaceRow): number {
  const scores = [
    row.doumiao_score,
    row.pet_friendliness_score,
    row.environment_score,
    row.staff_score ?? row.staff_friendliness_score,
    row.freedom_score,
    row.large_dog_score,
  ].filter((s): s is number => s !== null)
  if (scores.length === 0) return 0
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg * 10) / 10
}
