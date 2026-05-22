import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

const ALLOWED_FIELDS = [
  'name', 'city', 'district', 'address', 'category', 'submitter_type',
  'pet_rules_description', 'indoor_allowed', 'outdoor_seating',
  'small_dog_allowed', 'medium_dog_allowed', 'large_dog_allowed',
  'water_provided', 'contact_phone', 'contact_wechat',
  'xiaohongshu_url', 'submitter_contact', 'images',
  'genuinely_welcoming', 'large_dog_vibe', 'staff_engages',
  'dog_relaxed', 'vibe_social', 'weekend_crowded', 'no_judgement',
] as const

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name || !body.city || !body.category) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  const client = createServiceClient()
  const { data: result, error } = await client
    .from('place_submissions')
    .insert(data)
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: result.id }, { status: 201 })
}
