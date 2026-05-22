import { NextRequest, NextResponse } from 'next/server'
import { getPlaces } from '@/lib/places'
import type { CitySlug, PlaceCategory, VerificationStatus } from '@/lib/database.types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const city = searchParams.get('city') as CitySlug | null
  const category = searchParams.get('category') as PlaceCategory | null
  const search = searchParams.get('q') ?? undefined
  const featured = searchParams.get('featured') === 'true'
  const indoor = searchParams.get('indoor') === 'true' ? true : undefined
  const large_dog = searchParams.get('large_dog') === 'true' ? true : undefined
  const outdoor_seating = searchParams.get('outdoor_seating') === 'true' ? true : undefined
  const water_provided = searchParams.get('water_provided') === 'true' ? true : undefined
  const verification = searchParams.get('verification') as VerificationStatus | null

  try {
    const places = await getPlaces({
      city: city ?? undefined,
      category: category ?? undefined,
      search,
      featured: featured || undefined,
      indoor,
      large_dog,
      outdoor_seating,
      water_provided,
      verification: verification ?? undefined,
    })
    return NextResponse.json(places)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
