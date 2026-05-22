import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  const client = createServiceClient()

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  let totalQ    = client.from('places').select('id', { count: 'exact', head: true })
  let verifiedQ = client.from('places').select('id', { count: 'exact', head: true })
    .neq('verification_status', 'unverified')
  let newQ      = client.from('places').select('id', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo)

  if (city) {
    totalQ    = totalQ.eq('city', city)
    verifiedQ = verifiedQ.eq('city', city)
    newQ      = newQ.eq('city', city)
  }

  const [totalRes, verifiedRes, newRes] = await Promise.all([totalQ, verifiedQ, newQ])

  return NextResponse.json({
    total:        totalRes.count    ?? 0,
    verified:     verifiedRes.count ?? 0,
    new_this_week: newRes.count      ?? 0,
  })
}
