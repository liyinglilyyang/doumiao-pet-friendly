// TODO: re-enable session check after Supabase login is confirmed working
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json() as Record<string, unknown>
  const { id: _id, created_at: _c, updated_at: _u, ...safeBody } = body
  const client = createServiceClient()

  const { data, error } = await client
    .from('places')
    .update(safeBody)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const client = createServiceClient()

  const { error } = await client.from('places').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
