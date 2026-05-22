import { NextRequest, NextResponse } from 'next/server'
import { getPlaceById } from '@/lib/places'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const place = await getPlaceById(id)
    if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(place)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
