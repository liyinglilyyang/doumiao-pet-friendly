import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'
import type { VerificationSource } from '@/lib/database.types'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = createServiceClient()
  const { data, error } = await client
    .from('place_submissions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { action, admin_notes, edits } = body as {
    action: 'approve' | 'reject'
    admin_notes?: string
    edits?: Record<string, unknown>
  }

  const client = createServiceClient()

  if (action === 'approve') {
    const { data: sub, error: fetchErr } = await client
      .from('place_submissions')
      .select('*')
      .eq('id', id)
      .single()
    if (fetchErr || !sub) return NextResponse.json({ error: '未找到投稿' }, { status: 404 })

    const resolvedCategory = (edits?.category ?? sub.category) as string
    const validCategories = ['cafe', 'restaurant', 'hotel', 'park', 'boarding', 'grooming', 'transport']
    if (!validCategories.includes(resolvedCategory)) {
      return NextResponse.json({ error: '请先选择有效的商家类型（不能为「其他」）' }, { status: 400 })
    }

    const placeData = {
      name:             (edits?.name     as string) ?? sub.name,
      city:             (edits?.city     as string) ?? sub.city,
      district:         (edits?.district as string | null) ?? sub.district ?? null,
      address:          (edits?.address  as string | null) ?? sub.address ?? null,
      category:         resolvedCategory,
      indoor_allowed:   sub.indoor_allowed  ?? false,
      outdoor_allowed:  sub.outdoor_seating ?? false,
      outdoor_seating:  sub.outdoor_seating ?? false,
      large_dog_allowed: sub.large_dog_allowed ?? false,
      water_provided:   sub.water_provided ?? false,
      water_available:  sub.water_provided ?? false,
      pet_policy:       sub.pet_rules_description ?? null,
      images:           sub.images ?? [],
      contact_phone:    sub.contact_phone  ?? null,
      wechat:           sub.contact_wechat ?? null,
      xiaohongshu_url:  sub.xiaohongshu_url ?? null,
      verification_status: 'unverified' as const,
      source:           'user_submit' as VerificationSource,
      is_featured:      false,
      genuinely_welcoming: sub.genuinely_welcoming ?? null,
      large_dog_vibe:      sub.large_dog_vibe      ?? null,
      staff_engages:       sub.staff_engages       ?? null,
      dog_relaxed:         sub.dog_relaxed         ?? null,
      vibe_social:         sub.vibe_social         ?? null,
      weekend_crowded:     sub.weekend_crowded     ?? null,
      no_judgement:        sub.no_judgement        ?? null,
    }

    const { data: place, error: placeErr } = await client
      .from('places')
      .insert(placeData)
      .select('id')
      .single()
    if (placeErr) return NextResponse.json({ error: placeErr.message }, { status: 500 })

    await client
      .from('place_submissions')
      .update({ status: 'approved', place_id: place.id, reviewed_at: new Date().toISOString(), admin_notes: admin_notes ?? null })
      .eq('id', id)

    return NextResponse.json({ place_id: place.id })
  }

  if (action === 'reject') {
    const { error } = await client
      .from('place_submissions')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString(), admin_notes: admin_notes ?? null })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: '无效操作' }, { status: 400 })
}
