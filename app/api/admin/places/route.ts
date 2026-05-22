// TODO: re-enable session check after Supabase login is confirmed working
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const client = createServiceClient()
  const { data, error } = await client
    .from('places')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
