'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Loader2, Star, MapPin, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import type { PlaceRow, CitySlug, PlaceCategory, VerificationStatus } from '@/lib/database.types'
import {
  CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS,
  VERIFICATION_LABELS, buildPlaceTags, buildVerifTag,
} from '@/lib/places'

const CITIES: { value: CitySlug | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hongkong', label: '香港' },
]

const CATEGORIES: { value: PlaceCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',        label: '全部',     emoji: '🐾' },
  { value: 'cafe',       label: '咖啡店',   emoji: '☕' },
  { value: 'restaurant', label: '餐厅',     emoji: '🍽️' },
  { value: 'hotel',      label: '酒店',     emoji: '🏨' },
  { value: 'park',       label: '公园',     emoji: '🌳' },
  { value: 'boarding',   label: '宠物寄养', emoji: '🏠' },
  { value: 'grooming',   label: '美容洗护', emoji: '✂️' },
  { value: 'transport',  label: '宠物运输', emoji: '🚗' },
]

const VERIF_OPTS: { value: VerificationStatus | 'all'; label: string }[] = [
  { value: 'all',              label: '全部' },
  { value: 'partner_verified', label: '合作认证' },
  { value: 'doumiao_verified', label: '豆苗认证' },
  { value: 'visited_verified', label: '已实地验证' },
  { value: 'visited',          label: '已探访' },
  { value: 'phone_verified',   label: '已电话确认' },
]

function PlacesContent() {
  const searchParams = useSearchParams()
  const [query, setQuery]               = useState(searchParams.get('q') ?? '')
  const [debouncedQuery, setDebounced]  = useState(query)
  const [city, setCity]                 = useState<CitySlug | 'all'>((searchParams.get('city') as CitySlug) ?? 'all')
  const [category, setCategory]         = useState<PlaceCategory | 'all'>((searchParams.get('category') as PlaceCategory) ?? 'all')
  const [verification, setVerification] = useState<VerificationStatus | 'all'>('all')
  const [indoor, setIndoor]             = useState(false)
  const [largeDog, setLargeDog]         = useState(false)
  const [waterProvided, setWater]       = useState(false)
  const [places, setPlaces]             = useState<PlaceRow[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const p = new URLSearchParams()
    if (city !== 'all') p.set('city', city)
    if (category !== 'all') p.set('category', category)
    if (debouncedQuery.trim()) p.set('q', debouncedQuery.trim())
    if (indoor) p.set('indoor', 'true')
    if (largeDog) p.set('large_dog', 'true')
    if (waterProvided) p.set('water_provided', 'true')
    if (verification !== 'all') p.set('verification', verification)
    fetch(`/api/places?${p}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setPlaces(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setPlaces([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [city, category, debouncedQuery, indoor, largeDog, waterProvided, verification])

  const activeCount = [indoor, largeDog, waterProvided, city !== 'all', category !== 'all', verification !== 'all'].filter(Boolean).length

  function clearAll() {
    setQuery(''); setCity('all'); setCategory('all')
    setVerification('all'); setIndoor(false); setLargeDog(false); setWater(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">

      {/* ── Unified responsive header ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0] shadow-[0_1px_8px_rgba(60,30,10,0.05)]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-[56px] md:h-[64px] flex items-center gap-3 md:gap-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🌱</span>
            <span className="hidden sm:block font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[320px] md:max-w-lg relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索地名、区域..."
              className="w-full pl-9 pr-8 py-2 md:py-2.5 bg-[#FAF7F2] rounded-xl md:rounded-2xl border border-[#E8DCCB] text-[13px] md:text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#F5A462] focus:bg-white transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A07E] hover:text-[#7C5A42]">
                <X size={12} />
              </button>
            )}
          </div>

          {/* City pills — tablet+ */}
          <div className="hidden md:flex items-center gap-1.5">
            {CITIES.map(({ value, label }) => (
              <button key={value} onClick={() => setCity(value)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                  city === value ? 'bg-[#1E1209] text-white' : 'text-[#7C5A42] hover:bg-[#F5EBD8]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Nav links — desktop */}
          <div className="ml-auto hidden lg:flex items-center gap-4 shrink-0">
            <Link href="/about" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">关于</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] transition-colors font-medium">
              商家入驻
            </Link>
          </div>

          {/* Mobile result count */}
          <div className="ml-auto lg:hidden">
            <span className="text-[12px] text-[#A09080]">{places.length} 家</span>
          </div>
        </div>
      </header>

      {/* ── Mobile/tablet filter chips (hidden on lg+) ── */}
      <div className="lg:hidden bg-white border-b border-[#EDE8E0] sticky top-[56px] md:top-[64px] z-10">
        <div className="overflow-x-auto scrollbar-hide px-4 py-2.5">
          <div className="flex gap-2 min-w-max items-center">
            {/* City chips (mobile only — tablet already has them in header) */}
            {CITIES.map(({ value, label }) => (
              <button key={value} onClick={() => setCity(value)}
                className={`md:hidden px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all ${
                  city === value ? 'bg-[#1E1209] text-white border-[#1E1209]' : 'bg-white text-[#7C5A42] border-[#E8DCCB]'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="md:hidden w-px h-4 bg-[#E8DCCB] shrink-0" />
            {/* Category chips */}
            {CATEGORIES.map(({ value, label, emoji }) => (
              <button key={value} onClick={() => setCategory(value)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all ${
                  category === value ? 'bg-[#E0813D] text-white border-[#E0813D]' : 'bg-white text-[#7C5A42] border-[#E8DCCB]'
                }`}
              >
                {emoji} {label}
              </button>
            ))}
            <div className="w-px h-4 bg-[#E8DCCB] shrink-0" />
            {/* Toggle chips */}
            {[
              { key: 'indoor',   label: '可进室内', val: indoor,   set: setIndoor },
              { key: 'dog',      label: '大型犬',   val: largeDog, set: setLargeDog },
              { key: 'water',    label: '提供饮水', val: waterProvided, set: setWater },
            ].map(({ key, label, val, set }) => (
              <button key={key} onClick={() => set(!val)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all ${
                  val ? 'bg-[#E0813D] text-white border-[#E0813D]' : 'bg-white text-[#7C5A42] border-[#E8DCCB]'
                }`}
              >
                {label}
              </button>
            ))}
            {activeCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 px-2 py-1 text-[11px] text-[#A09080] hover:text-[#E0813D]">
                <X size={11} />清除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-4 md:px-8 py-4 md:py-8 gap-6 lg:gap-8">

        {/* ── Desktop sidebar (lg+) ── */}
        <aside className="hidden lg:block w-[220px] shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <p className="text-[11px] font-semibold text-[#A09080] uppercase tracking-wider mb-2.5">类型</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(({ value, label, emoji }) => (
                  <button key={value} onClick={() => setCategory(value)}
                    className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                      category === value
                        ? 'bg-[#E0813D] text-white'
                        : 'bg-[#F5EBD8] text-[#7C5A42] hover:bg-[#EDD8B8]'
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet filters */}
            <div>
              <p className="text-[11px] font-semibold text-[#A09080] uppercase tracking-wider mb-2.5">宠物条件</p>
              <div className="space-y-2">
                {[
                  { key: 'indoor', label: '🏠 可进室内', val: indoor,       set: setIndoor },
                  { key: 'dog',    label: '🐕 接受大型犬', val: largeDog,    set: setLargeDog },
                  { key: 'water',  label: '💧 提供饮水',  val: waterProvided, set: setWater },
                ].map(({ key, label, val, set }) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div onClick={() => set(!val)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                        val ? 'bg-[#E0813D] border-[#E0813D]' : 'border-[#C4A07E] group-hover:border-[#E0813D]'
                      }`}
                    >
                      {val && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className="text-[13px] text-[#5C3D20] select-none">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div>
              <p className="text-[11px] font-semibold text-[#A09080] uppercase tracking-wider mb-2.5">验证级别</p>
              <div className="flex flex-wrap gap-1.5">
                {VERIF_OPTS.map(({ value, label }) => (
                  <button key={value} onClick={() => setVerification(value)}
                    className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                      verification === value
                        ? 'bg-[#1E1209] text-white'
                        : 'bg-[#F5EBD8] text-[#7C5A42] hover:bg-[#EDD8B8]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {activeCount > 0 && (
              <button onClick={clearAll}
                className="w-full text-[12px] text-[#E0813D] border border-[#F5C49A] rounded-xl py-2 hover:bg-[#FFF0E2] transition-colors"
              >
                清除全部筛选 ({activeCount})
              </button>
            )}
          </div>
        </aside>

        {/* ── Main grid ── */}
        <main className="flex-1 min-w-0">
          {/* Result count — desktop */}
          <div className="hidden lg:flex items-center justify-between mb-5">
            <p className="text-[14px] text-[#A09080]">
              共 <span className="font-semibold text-[#1E1209]">{loading ? '…' : places.length}</span> 家宠物友好地点
            </p>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-[12px] text-[#E0813D] hover:underline flex items-center gap-1">
                <X size={11} />清除筛选
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#E0813D]" />
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-[15px] text-[#A09080]">暂无匹配地点</p>
              <button onClick={clearAll} className="mt-3 text-[13px] text-[#E0813D] hover:underline">清除筛选</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {places.map((place) => <PlaceCard key={place.id} place={place} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function PlacesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF4]">
        <Loader2 size={28} className="animate-spin text-[#E0813D]" />
      </div>
    }>
      <PlacesContent />
    </Suspense>
  )
}

function PlaceCard({ place }: { place: PlaceRow }) {
  const cover = (place.images ?? [])[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  const verifTag = buildVerifTag(place.verification_status)
  const tags = buildPlaceTags(place)
  return (
    <Link href={`/places/${place.id}`} className="group bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden hover:shadow-card-hover transition-all">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={cover} alt={place.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" />
        {verifTag && (
          <span className={`absolute top-2.5 left-2.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${verifTag.style}`}>
            {verifTag.label}
          </span>
        )}
      </div>
      <div className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[13px] md:text-[14px] text-[#1E1209] leading-snug">{place.name}</h3>
          {place.doumiao_score != null && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star size={11} className="fill-[#F0BE56] text-[#F0BE56]" />
              <span className="text-[11px] md:text-[12px] font-semibold text-[#1E1209]">{place.doumiao_score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] md:text-[12px] text-[#A09080] mb-2">
          <MapPin size={10} />
          <span className="truncate">{[place.district, CITY_LABELS[place.city]].filter(Boolean).join(' · ')}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag.key} className="text-[10px] md:text-[11px] bg-[#F5EBD8] text-[#7C5A42] px-1.5 md:px-2 py-0.5 rounded-full">
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
