'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Loader2, SlidersHorizontal, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import type { PlaceRow, CitySlug, PlaceCategory, VerificationStatus } from '@/lib/database.types'
import {
  CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS,
  VERIFICATION_LABELS, buildPlaceTags, buildVerifTag,
} from '@/lib/places'

const CITIES: { value: CitySlug | 'all'; label: string }[] = [
  { value: 'all', label: '全部城市' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hongkong', label: '香港' },
]

const CATEGORIES: { value: PlaceCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: '全部类型', emoji: '🐾' },
  { value: 'cafe', label: '咖啡店', emoji: '☕' },
  { value: 'restaurant', label: '餐厅', emoji: '🍽️' },
  { value: 'hotel', label: '酒店', emoji: '🏨' },
  { value: 'park', label: '公园', emoji: '🌳' },
  { value: 'boarding', label: '宠物寄养', emoji: '🏠' },
  { value: 'grooming', label: '美容洗护', emoji: '✂️' },
  { value: 'transport', label: '宠物运输', emoji: '🚗' },
]

const VERIF_OPTS: { value: VerificationStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'partner_verified', label: '合作认证' },
  { value: 'doumiao_verified', label: '豆苗认证' },
  { value: 'visited_verified', label: '已实地验证' },
  { value: 'visited', label: '已探访' },
  { value: 'phone_verified', label: '已电话确认' },
]

function PlacesContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [city, setCity] = useState<CitySlug | 'all'>((searchParams.get('city') as CitySlug) ?? 'all')
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all')
  const [verification, setVerification] = useState<VerificationStatus | 'all'>('all')
  const [indoor, setIndoor] = useState(false)
  const [largeDog, setLargeDog] = useState(false)
  const [waterProvided, setWaterProvided] = useState(false)
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (city !== 'all') params.set('city', city)
    if (category !== 'all') params.set('category', category)
    if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim())
    if (indoor) params.set('indoor', 'true')
    if (largeDog) params.set('large_dog', 'true')
    if (waterProvided) params.set('water_provided', 'true')
    if (verification !== 'all') params.set('verification', verification)

    fetch(`/api/places?${params}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setPlaces(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setPlaces([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [city, category, debouncedQuery, indoor, largeDog, waterProvided, verification])

  const activeCount = [indoor, largeDog, waterProvided, city !== 'all', category !== 'all', verification !== 'all'].filter(Boolean).length

  function clearAll() {
    setQuery(''); setCity('all'); setCategory('all'); setVerification('all')
    setIndoor(false); setLargeDog(false); setWaterProvided(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Sticky top header ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0] shadow-[0_1px_8px_rgba(60,30,10,0.05)]">
        <div className="max-w-screen-xl mx-auto px-8 h-[64px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>

          <div className="flex-1 max-w-lg relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索地名、区域、关键词..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DCCB] text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#F5A462] focus:bg-white transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A07E] hover:text-[#7C5A42]">
                <X size={13} />
              </button>
            )}
          </div>

          {/* City pills in header */}
          <div className="flex items-center gap-1.5">
            {CITIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCity(value)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                  city === value
                    ? 'bg-[#1E1209] text-white'
                    : 'text-[#7C5A42] hover:bg-[#F5EBD8]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 shrink-0">
            <Link href="/about" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">关于</Link>
            <Link href="/partner" className="text-[13px] px-3 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] transition-colors font-medium">
              商家入驻
            </Link>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-8 py-8 gap-8">

        {/* Left sidebar */}
        <aside className="w-[220px] xl:w-[240px] shrink-0">
          <div className="sticky top-24 space-y-7">

            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF0E2] border border-[#F5C49A] text-[13px] text-[#E0813D] font-medium hover:bg-[#FFE4CC] transition-colors"
              >
                <span className="flex items-center gap-1.5"><SlidersHorizontal size={12} />已筛选 {activeCount} 项</span>
                <X size={12} />
              </button>
            )}

            <SideSection title="商家类型">
              <div className="space-y-0.5">
                {CATEGORIES.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => setCategory(value)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all text-left ${
                      category === value
                        ? 'bg-[#FFF0E2] text-[#E0813D] font-semibold'
                        : 'text-[#6B5744] hover:bg-[#FAF5EE]'
                    }`}
                  >
                    <span className="text-[15px] w-5 text-center">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </SideSection>

            <SideSection title="宠物友好条件">
              <div className="space-y-2.5">
                <SideToggle label="可进室内" emoji="🏠" checked={indoor} onChange={setIndoor} />
                <SideToggle label="大型犬友好" emoji="🐕" checked={largeDog} onChange={setLargeDog} />
                <SideToggle label="提供饮水" emoji="💧" checked={waterProvided} onChange={setWaterProvided} />
              </div>
            </SideSection>

            <SideSection title="认证状态">
              <div className="space-y-0.5">
                {VERIF_OPTS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setVerification(value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] transition-all text-left ${
                      verification === value
                        ? 'bg-[#FFF0E2] text-[#E0813D] font-semibold'
                        : 'text-[#6B5744] hover:bg-[#FAF5EE]'
                    }`}
                  >
                    {value !== 'all' && (
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        value.includes('partner') || value.includes('doumiao') ? 'bg-emerald-500'
                        : value.includes('visited') ? 'bg-blue-500'
                        : value.includes('phone') ? 'bg-orange-400'
                        : 'bg-gray-300'
                      }`} />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </SideSection>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[14px] text-[#A09080]">
              {loading
                ? <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin text-[#E0813D]" />搜索中...</span>
                : <span>共 <span className="font-semibold text-[#1E1209]">{places.length}</span> 个宠物友好地点</span>
              }
            </p>
            {activeCount > 0 && !loading && (
              <button onClick={clearAll} className="text-[13px] text-[#C4A07E] hover:text-[#E0813D] transition-colors">
                清除所有筛选
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-28">
              <Loader2 size={32} className="animate-spin text-[#E0813D]" />
            </div>
          ) : places.length === 0 ? (
            <div className="flex flex-col items-center py-28 gap-3">
              <div className="text-6xl">🐾</div>
              <p className="text-[16px] font-semibold text-[#7C5A42]">没有找到匹配的地点</p>
              <p className="text-[13px] text-[#A09080]">试试调整筛选条件或搜索关键词</p>
              <button onClick={clearAll} className="mt-2 px-5 py-2.5 bg-[#E0813D] text-white rounded-xl text-[14px] font-medium hover:bg-[#CC7030] transition-colors">
                清除所有筛选
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {places.map((place) => <PlaceCard key={place.id} place={place} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Place card (Airbnb style) ────────────────────────────────

const VERIF_BADGE: Record<string, string> = {
  doumiao_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partner_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  visited_verified: 'bg-blue-50 text-blue-700 border-blue-200',
  visited:          'bg-blue-50 text-blue-700 border-blue-200',
  phone_verified:   'bg-orange-50 text-orange-700 border-orange-200',
  unverified:       'bg-white/80 text-gray-400 border-gray-200',
}

function PlaceCard({ place }: { place: PlaceRow }) {
  const cover = (place.images ?? [])[0]
    ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
  const score = place.doumiao_score ?? place.pet_friendliness_score
  const tags = buildPlaceTags(place).slice(0, 3)

  return (
    <Link href={`/places/${place.id}`} className="group block">
      {/* Image */}
      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-[#F5EBD8] relative shadow-[0_2px_12px_rgba(60,30,10,0.08)] group-hover:shadow-[0_8px_28px_rgba(60,30,10,0.14)] transition-shadow duration-300">
        <img
          src={cover}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/92 backdrop-blur-sm text-[#7C5A42] text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
            {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium backdrop-blur-sm ${VERIF_BADGE[place.verification_status]}`}>
            {VERIFICATION_LABELS[place.verification_status]?.label}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="px-0.5">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="font-semibold text-[#1E1209] text-[14px] leading-snug line-clamp-1 flex-1 group-hover:text-[#E0813D] transition-colors">
            {place.name}
          </h3>
          {score != null && (
            <span className="flex items-center gap-0.5 shrink-0 ml-1">
              <Star size={11} className="fill-[#F0BE56] text-[#F0BE56]" />
              <span className="text-[13px] font-semibold text-[#1E1209]">{score.toFixed(1)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[12px] text-[#A09080] mb-2">
          <MapPin size={10} />
          {CITY_LABELS[place.city]}{place.district ? ` · ${place.district}` : ''}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t.key} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${t.style}`}>
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Sidebar sub-components ───────────────────────────────────

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#A09080] uppercase tracking-widest mb-3 px-1">{title}</p>
      {children}
    </div>
  )
}

function SideToggle({ label, emoji, checked, onChange }: {
  label: string; emoji: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer px-1 py-0.5 group" onClick={() => onChange(!checked)}>
      <span className="flex items-center gap-2 text-[13px] text-[#6B5744] group-hover:text-[#1E1209] transition-colors select-none">
        <span>{emoji}</span>{label}
      </span>
      <div
        className={`w-8 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-[#E0813D]' : 'bg-[#DDD5C8]'}`}
        style={{ height: 18 }}
      >
        <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-[14px]' : 'translate-x-0.5'}`} />
      </div>
    </label>
  )
}

export default function PlacesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF4]">
        <Loader2 size={24} className="animate-spin text-[#E0813D]" />
      </div>
    }>
      <PlacesContent />
    </Suspense>
  )
}
