import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Lazy singletons — avoids "supabaseUrl is required" at build time
let _client: SupabaseClient<Database> | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _serviceClient: SupabaseClient<any> | null = null

export function getSupabase(): SupabaseClient<Database> {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    // Use createBrowserClient so auth session is stored in cookies,
    // which the SSR middleware (proxy.ts) can read. Without this,
    // login succeeds but middleware sees no session and bounces back.
    if (typeof window !== 'undefined') {
      _client = createBrowserClient<Database>(url, key)
    } else {
      _client = createClient<Database>(url, key)
    }
  }
  return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServiceClient(): SupabaseClient<any> {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) throw new Error('Missing Supabase service role env vars')
    _serviceClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _serviceClient
}

// Backwards compat: named export expected in some files
export const supabase = {
  get storage() { return getSupabase().storage },
  get auth() { return getSupabase().auth },
  from: (...args: Parameters<SupabaseClient<Database>['from']>) => getSupabase().from(...args),
} as unknown as SupabaseClient<Database>
