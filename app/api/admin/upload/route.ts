import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseClient'

const BUCKET = 'place-images'

export async function POST(req: NextRequest) {
  // ── Parse form data ──────────────────────────────────────────
  let form: FormData
  try {
    form = await req.formData()
  } catch (e) {
    return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 })
  }

  const file = form.get('file') as File | null
  const placeId = (form.get('placeId') as string | null) ?? 'tmp'

  if (!file) {
    return NextResponse.json({ error: 'No file field in form data' }, { status: 400 })
  }
  if (!file.size) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 })
  }

  // ── Build storage path ───────────────────────────────────────
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
  const path = `places/${placeId}/${Date.now()}.${ext}`

  // ── Upload via service role (bypasses RLS) ───────────────────
  const client = createServiceClient()
  const bytes = await file.arrayBuffer()

  const { error: upErr } = await client.storage
    .from(BUCKET)
    .upload(path, new Uint8Array(bytes), {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (upErr) {
    console.error('[upload] storage error:', upErr)
    return NextResponse.json(
      { error: upErr.message, hint: 'Check that the "place-images" bucket exists and is set to Public in Supabase Storage.' },
      { status: 500 }
    )
  }

  // ── Return public URL ────────────────────────────────────────
  const { data } = client.storage.from(BUCKET).getPublicUrl(path)

  if (!data?.publicUrl) {
    return NextResponse.json({ error: 'Upload succeeded but could not get public URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.publicUrl })
}
