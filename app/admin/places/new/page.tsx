// TODO: re-enable auth after Supabase login is confirmed working
import AdminNav from '@/components/AdminNav'
import PlaceForm from '@/components/PlaceForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewPlacePage() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="px-10 py-7 border-b border-[#EDE8E0] bg-white">
          <Link
            href="/admin/places"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#A09080] hover:text-[#6B5744] mb-3 transition-colors"
          >
            <ChevronLeft size={14} />
            返回商家列表
          </Link>
          <h1 className="text-[28px] font-bold text-[#1E1209] leading-tight">新增商家</h1>
        </div>

        <div className="px-10 py-8">
          <PlaceForm mode="create" />
        </div>
      </main>
    </div>
  )
}
