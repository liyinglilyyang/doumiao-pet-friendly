import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const city   = searchParams.get('city')
  const intent = searchParams.get('intent')
  const status = searchParams.get('status')

  const client = createServiceClient()
  let query = client
    .from('community_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (city && city !== 'all')   query = query.eq('city', city)
  if (intent && intent !== 'all') query = query.contains('intent', [intent])
  if (status === 'contacted')   query = query.eq('contacted', true)
  if (status === 'pending')     query = query.eq('contacted', false)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
