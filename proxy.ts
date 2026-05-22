import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: re-enable Supabase session check after login is confirmed working
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
