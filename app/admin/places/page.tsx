// TODO: re-enable auth after Supabase login is confirmed working
import { getPlaces } from '@/lib/places'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import AdminPlacesClient from './AdminPlacesClient'

export default async function AdminPlacesPage() {
  let places: Awaited<ReturnType<typeof getPlaces>> = []
  try {
    places = await getPlaces()
  } catch {
    /* db not connected yet */
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-10 py-7 border-b border-[#EDE8E0] bg-white">
          <div>
            <h1 className="text-[28px] font-bold text-[#1E1209] leading-tight">商家管理</h1>
            <p className="text-[14px] text-[#A09080] mt-0.5">共 {places.length} 条记录</p>
          </div>
          <Link
            href="/admin/places/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E0813D] text-white rounded-xl text-[14px] font-medium hover:bg-[#CC7030] transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            新增商家
          </Link>
        </div>

        <div className="px-10 py-8">
          <AdminPlacesClient initialPlaces={places} />
        </div>
      </main>
    </div>
  )
}
