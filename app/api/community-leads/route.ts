import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
  const { contact, city, pet_type, intent, source_page } = body as Record<string, unknown>

  if (typeof contact !== 'string' || !contact.trim()) {
    return NextResponse.json({ error: '请填写联系方式' }, { status: 400 })
  }

  const client = createServiceClient()
  const { error } = await client.from('community_leads').insert({
    contact:     contact.trim(),
    city:        typeof city === 'string' && city ? city : null,
    pet_type:    typeof pet_type === 'string' && pet_type ? pet_type : null,
    intent:      Array.isArray(intent) && intent.length > 0 ? intent : null,
    source_page: typeof source_page === 'string' && source_page ? source_page : null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
