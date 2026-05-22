import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
  const { contacted } = body as { contacted?: boolean }
  if (typeof contacted !== 'boolean') {
    return NextResponse.json({ error: '缺少 contacted 字段' }, { status: 400 })
  }

  const client = createServiceClient()
  const { error } = await client
    .from('community_leads')
    .update({ contacted })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
