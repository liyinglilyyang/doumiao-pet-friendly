// TODO: re-enable auth after Supabase login is confirmed working
import { getPlaceById } from '@/lib/places'
import { notFound } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import PlaceForm from '@/components/PlaceForm'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const place = await getPlaceById(id)
  if (!place) notFound()

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
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-bold text-[#1E1209] leading-tight">编辑商家</h1>
            <Link
              href={`/places/${place.id}`}
              target="_blank"
              className="flex items-center gap-1.5 text-[13px] text-[#E0813D] hover:underline"
            >
              查看前台 <ExternalLink size={12} />
            </Link>
          </div>
          <p className="text-[14px] text-[#A09080] mt-1">{place.name}</p>
        </div>

        <div className="px-10 py-8">
          <PlaceForm mode="edit" initialData={place} placeId={id} />
        </div>
      </main>
    </div>
  )
}
