'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Crown, Medal, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { PlaceRow, CitySlug } from '@/lib/database.types'
import { CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/places'

const CITIES: { value: CitySlug | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hongkong', label: '香港' },
]

const RANK_ICONS = [
  <Crown key={1} size={14} className="text-yellow-500" />,
  <Medal key={2} size={14} className="text-slate-400" />,
  <Medal key={3} size={14} className="text-amber-600" />,
]

export default function RankingsPage() {
  const [city, setCity] = useState<CitySlug | 'all'>('all')
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (city !== 'all') params.set('city', city)
    fetch(`/api/places?${params}`)
      .then((r) => r.json())
      .then((data: PlaceRow[]) => setPlaces([...data].sort((a, b) => (b.doumiao_score ?? 0) - (a.doumiao_score ?? 0))))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false))
  }, [city])

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <div className="bg-gradient-to-br from-[#FFF8EE] to-[#FFE4C0] px-4 pt-10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} className="text-[#E0813D]" />
          <h1 className="font-bold text-[#1E1209] text-xl">豆苗推荐榜</h1>
        </div>
        <p className="text-sm text-[#A07855]">按豆苗推荐指数排名，持续更新</p>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {CITIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCity(value as CitySlug | 'all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              city === value ? 'bg-[#E0813D] text-white' : 'bg-white text-[#7C5A42] border border-[#E8DCCB]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={22} className="animate-spin text-[#E0813D]" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 text-[#C4A07E]">
            <div className="text-4xl mb-3">🐾</div>
            <div className="text-sm">暂无数据</div>
          </div>
        ) : (
          <div className="space-y-3">
            {places.map((place, idx) => {
              const cover = (place.images ?? [])[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=160&q=80'
              return (
                <Link href={`/places/${place.id}`} key={place.id}>
                  <div className="bg-white rounded-2xl border border-[#E8DCCB] overflow-hidden flex shadow-[0_1px_6px_rgba(60,30,10,0.06)] hover:shadow-md transition-shadow">
                    <div className={`w-12 flex flex-col items-center justify-center shrink-0 ${
                      idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-slate-50' : idx === 2 ? 'bg-amber-50' : 'bg-[#FDFAF4]'
                    }`}>
                      {idx < 3 ? RANK_ICONS[idx] : <span className="text-sm font-bold text-[#C4A07E]">{idx + 1}</span>}
                    </div>
                    <div className="relative w-20 h-20 shrink-0">
                      <Image src={cover} alt={place.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <h3 className="font-semibold text-[#1E1209] text-sm truncate">{place.name}</h3>
                      <p className="text-xs text-[#A07855] mb-1.5">
                        {CATEGORY_EMOJIS[place.category]} {CITY_LABELS[place.city]} · {place.district}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-[#F0BE56] text-[#F0BE56]" />
                        <span className="font-bold text-[#1E1209] text-sm">{place.doumiao_score?.toFixed(1) ?? '—'}</span>
                        <span className="text-[10px] text-[#C4A07E]">豆苗推荐指数</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
