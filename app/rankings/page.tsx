'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Crown, Medal, Loader2 } from 'lucide-react'
import Link from 'next/link'
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
      .then((data: PlaceRow[]) =>
        setPlaces([...data].sort((a, b) => (b.doumiao_score ?? 0) - (a.doumiao_score ?? 0)))
      )
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false))
  }, [city])

  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
        <div className="max-w-screen-xl mx-auto w-full px-8 h-[64px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places" className="text-[13px] text-[#7C5A42] font-medium hover:text-[#1E1209]">探索地点</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] font-medium">商家入驻</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFF8EE] to-[#FFE4C0] px-4 md:px-8 pt-10 pb-6 md:py-12">
        <div className="max-w-screen-xl md:mx-auto flex items-center gap-3">
          <Trophy size={22} className="text-[#E0813D]" />
          <div>
            <h1 className="font-bold text-[#1E1209] text-[20px] md:text-[28px]">豆苗推荐榜</h1>
            <p className="text-[12px] md:text-[14px] text-[#A07855] mt-0.5">按豆苗推荐指数排名，持续更新</p>
          </div>
        </div>
      </div>

      {/* City filter */}
      <div className="flex gap-2 px-4 md:px-8 py-3 md:py-4 max-w-screen-xl md:mx-auto overflow-x-auto scrollbar-hide">
        {CITIES.map(({ value, label }) => (
          <button key={value} onClick={() => setCity(value as CitySlug | 'all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
              city === value ? 'bg-[#E0813D] text-white' : 'bg-white text-[#7C5A42] border border-[#E8DCCB]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 md:px-8 pb-8 max-w-screen-xl md:mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={22} className="animate-spin text-[#E0813D]" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 text-[#C4A07E]">
            <div className="text-4xl mb-3">🐾</div>
            <div className="text-[14px]">暂无数据</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {places.map((place, idx) => {
              const cover = (place.images ?? [])[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=160&q=80'
              return (
                <Link href={`/places/${place.id}`} key={place.id}>
                  <div className="bg-white rounded-2xl border border-[#E8DCCB] overflow-hidden flex shadow-soft hover:shadow-card transition-shadow">
                    <div className={`w-12 flex flex-col items-center justify-center shrink-0 ${
                      idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-slate-50' : idx === 2 ? 'bg-amber-50' : 'bg-[#FDFAF4]'
                    }`}>
                      {idx < 3 ? RANK_ICONS[idx] : <span className="text-[13px] font-bold text-[#C4A07E]">{idx + 1}</span>}
                    </div>
                    <div className="w-20 h-20 shrink-0 overflow-hidden">
                      <img src={cover} alt={place.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <h3 className="font-semibold text-[#1E1209] text-[13px] md:text-[14px] truncate">{place.name}</h3>
                      <p className="text-[11px] md:text-[12px] text-[#A07855] mb-1.5">
                        {CATEGORY_EMOJIS[place.category]} {CITY_LABELS[place.city]} · {place.district}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-[#F0BE56] text-[#F0BE56]" />
                        <span className="font-bold text-[#1E1209] text-[13px]">{place.doumiao_score?.toFixed(1) ?? '—'}</span>
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
