'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, ChevronRight, ArrowRight,
  Loader2, CheckCircle2, Phone, Users, Star,
  ChevronDown, X, Locate,
} from 'lucide-react'
import type { PlaceRow, CitySlug, PlaceCategory } from '@/lib/database.types'
import { CITY_LABELS, buildPlaceTags, buildVerifTag } from '@/lib/places'

// ── City data ─────────────────────────────────────────────────

const CITY_SLUGS: CitySlug[] = ['guangzhou', 'shenzhen', 'hongkong']

const CITY_DESCRIPTIONS: Record<CitySlug, string> = {
  guangzhou: '千年花城 · 美食之都',
  shenzhen:  '创意之城 · 湾区核心',
  hongkong:  '东方之珠 · 国际都会',
}

const GEO_CITIES: { slug: CitySlug; lat: number; lng: number }[] = [
  { slug: 'guangzhou', lat: 23.12, lng: 113.26 },
  { slug: 'shenzhen',  lat: 22.54, lng: 114.06 },
  { slug: 'hongkong',  lat: 22.32, lng: 114.17 },
]

// ── Category data ─────────────────────────────────────────────

const CATEGORIES: { value: PlaceCategory; label: string; emoji: string }[] = [
  { value: 'cafe',       label: '咖啡店',   emoji: '☕' },
  { value: 'restaurant', label: '餐厅',     emoji: '🍽️' },
  { value: 'hotel',      label: '酒店',     emoji: '🏨' },
  { value: 'park',       label: '公园',     emoji: '🌳' },
  { value: 'boarding',   label: '宠物寄养', emoji: '🏠' },
  { value: 'grooming',   label: '美容洗护', emoji: '✂️' },
  { value: 'transport',  label: '宠物运输', emoji: '🚗' },
]

// ── Hero photo mosaic ─────────────────────────────────────────

// Column A: portrait-ish photos, warmer tones
const COL_A = [
  { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=320&q=70', label: '咖啡店里的狗狗', h: 184 },
  { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=320&q=70', label: '户外漫步时光',   h: 148 },
  { url: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=320&q=70', label: '宠物友好空间',   h: 200 },
]

// Column B: landscape-ish photos, slightly cooler offset
const COL_B = [
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=320&q=70', label: '一起出行',   h: 160 },
  { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=320&q=70', label: '城市生活',   h: 196 },
  { url: 'https://images.unsplash.com/photo-1534361960057-19f4434a4d37?auto=format&fit=crop&w=320&q=70', label: '狗狗的一天', h: 168 },
]

// ── Observation cards (小红书 style) ──────────────────────────

const OBSERVATIONS = [
  {
    emoji: '💚', tag: '真心欢迎',
    text: '老板自己养了一只边牧，客人带狗来会主动出来迎接，连名字都记住了。',
    city: '广州', type: '咖啡店',
  },
  {
    emoji: '🐕', tag: '大型犬自在',
    text: '工作日下午带金毛来，桌间距足够，完全没有被"特别看待"的感觉。',
    city: '广州', type: '餐厅',
  },
  {
    emoji: '🤝', tag: '店员主动',
    text: '不需要开口，点单时直接问：需要给狗狗准备个水碗吗？',
    city: '深圳', type: '咖啡店',
  },
  {
    emoji: '😌', tag: '狗狗放松',
    text: '在这里趴了两小时，一直没有焦虑感。适合第一次带狗外出的新手铲屎官。',
    city: '香港', type: '咖啡厅',
  },
  {
    emoji: '📅', tag: '时间有讲究',
    text: '周末高峰期较挤，大型犬建议工作日下午 2—5 点来，空间感完全不同。',
    city: '广州', type: '公园',
  },
  {
    emoji: '✨', tag: '找到同类',
    text: '周围几乎都是带宠物的客人，完全不用担心被投来奇怪的眼神。',
    city: '深圳', type: '咖啡店',
  },
]

// ── Collection data ───────────────────────────────────────────

const COLLECTIONS = [
  {
    emoji: '🐕',
    title: '大型犬友好空间',
    desc: '真正欢迎大型犬，不只是勉强接受',
    link: '/places?large_dog=true',
    gradient: 'from-amber-50 to-[#FFF8EE]',
    border: 'border-amber-100',
  },
  {
    emoji: '☕',
    title: '宠物友好咖啡',
    desc: '一杯咖啡，一只狗，一个安静的下午',
    link: '/places?category=cafe',
    gradient: 'from-[#FFF8EE] to-[#FFFBF3]',
    border: 'border-[#F0E4C8]',
  },
  {
    emoji: '🌳',
    title: '户外自由空间',
    desc: '公园和户外座位区，让它尽情奔跑',
    link: '/places?category=park',
    gradient: 'from-emerald-50 to-green-50',
    border: 'border-emerald-100',
  },
  {
    emoji: '🏨',
    title: '一起旅行住宿',
    desc: '宠物友好酒店，不再和它说"对不起"',
    link: '/places?category=hotel',
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-100',
  },
]

function findNearestCity(lat: number, lng: number): CitySlug {
  return GEO_CITIES.reduce((nearest, city) => {
    const d  = Math.hypot(lat - city.lat,    lng - city.lng)
    const dn = Math.hypot(lat - nearest.lat, lng - nearest.lng)
    return d < dn ? city : nearest
  }).slug
}

// ── Page ──────────────────────────────────────────────────────

export default function HomePage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeCity, setActiveCity]     = useState<CitySlug>('guangzhou')
  const [places, setPlaces]             = useState<PlaceRow[]>([])
  const [loading, setLoading]           = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sheetOpen, setSheetOpen]       = useState(false)
  const [locating, setLocating]         = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('city') as CitySlug | null
    if (param && CITY_SLUGS.includes(param)) { setActiveCity(param); return }
    const saved = localStorage.getItem('doumiao_city') as CitySlug | null
    if (saved && CITY_SLUGS.includes(saved)) { setActiveCity(saved); return }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const city = findNearestCity(pos.coords.latitude, pos.coords.longitude)
          setActiveCity(city)
          localStorage.setItem('doumiao_city', city)
        },
        () => {},
        { timeout: 4000, maximumAge: 3600000 }
      )
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/places?city=${activeCity}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setPlaces(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setPlaces([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [activeCity])

  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const selectCity = useCallback((city: CitySlug) => {
    setActiveCity(city)
    localStorage.setItem('doumiao_city', city)
    const url = new URL(window.location.href)
    url.searchParams.set('city', city)
    window.history.pushState({}, '', url)
    setDropdownOpen(false)
    setSheetOpen(false)
  }, [])

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { selectCity(findNearestCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false) },
      () => setLocating(false),
      { timeout: 6000 }
    )
  }, [selectCity])

  function handleSearch() {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    params.set('city', activeCity)
    window.location.href = `/places?${params}`
  }

  const featured = places.filter((p) => p.is_featured).slice(0, 6)
  const display  = featured.length > 0 ? featured : places.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">

      {/* ── Desktop sticky header ── */}
      <header className="hidden md:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0] shadow-[0_1px_8px_rgba(60,30,10,0.05)]">
        <div className="max-w-screen-xl mx-auto w-full px-8 h-[64px] flex items-center gap-6">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places"       className="text-[13px] font-medium text-[#7C5A42] hover:text-[#1E1209] transition-colors">探索地点</Link>
            <Link href="/rankings"     className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">榜单</Link>
            <Link href="/about"        className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">关于</Link>
            <Link href="/submit-place" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">投稿地点</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] transition-colors font-medium">
              商家入驻
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile hero ── */}
      <div className="md:hidden pb-6" style={{ background: 'linear-gradient(160deg, #FFF8EE 0%, #FDFAF4 100%)' }}>

        {/* Mobile: horizontal auto-scrolling photo strip */}
        <div className="overflow-hidden mb-5">
          <div className="flex gap-2 pl-4"
            style={{ animation: 'photoStripH 28s linear infinite', width: 'max-content', willChange: 'transform' }}>
            {[...COL_A, ...COL_B, ...COL_A, ...COL_B].map((p, i) => (
              <div key={i} className="relative w-[88px] h-[64px] rounded-xl overflow-hidden shrink-0 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.label} className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.78) brightness(0.93)' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/20 to-[#E0813D]/12" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#E0813D] flex items-center justify-center shadow-md">
            <span className="text-white text-base">🌱</span>
          </div>
          <div>
            <div className="font-bold text-[#1E1209] text-[15px] leading-tight">豆苗宠物友好</div>
            <div className="text-[10px] text-[#A07855] tracking-wide font-medium">DOUMIAO PET FRIENDLY</div>
          </div>
        </div>
        <h1 className="text-[22px] font-bold text-[#1E1209] leading-snug mb-2">
          发现真正欢迎<br />毛孩子的地方
        </h1>
        <p className="text-[12px] text-[#A07855] mb-5 leading-relaxed">
          标准化、真实验证、可搜索的宠物友好地图
        </p>

        <div className="flex gap-2">
          <button onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-[#E8DCCB] rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#1E1209] shrink-0 shadow-sm">
            <MapPin size={12} className="text-[#E0813D]" />
            {CITY_LABELS[activeCity]}
            <ChevronDown size={12} className="text-[#A09080]" />
          </button>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={`在${CITY_LABELS[activeCity]}找地方…`}
              className="w-full pl-9 pr-12 py-2.5 bg-white rounded-xl border border-[#E8DCCB] text-[13px] text-[#1E1209] placeholder-[#C4A07E] shadow-sm focus:outline-none" />
            {searchQuery && (
              <button onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E0813D] text-white text-[11px] px-2.5 py-1 rounded-lg font-medium">
                搜索
              </button>
            )}
          </div>
        </div>
        </div>{/* /px-4 */}
      </div>

      {/* ── Desktop hero: 2-col ── */}
      <section className="hidden md:block relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #FFF8EE 0%, #FDFAF4 60%, #F5EBD8 100%)' }}>
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-[#E0813D]/4 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F0BE56]/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-screen-xl mx-auto px-8 pt-20 pb-20 flex items-center gap-16 lg:gap-24 relative z-10">

          {/* Left: headline + search */}
          <div className="flex-1 min-w-0 max-w-[520px]">
            <h1 className="text-[46px] lg:text-[54px] font-bold text-[#1E1209] leading-[1.12] tracking-tight mb-5">
              发现真正欢迎<br />毛孩子的地方
            </h1>
            <p className="text-[16px] text-[#9C7055] mb-10 leading-relaxed">
              标准化、真实验证、可搜索的宠物友好地图
            </p>

            {/* City selector + search */}
            <div className="flex items-center gap-3 max-w-[500px]">
              <div ref={dropdownRef} className="relative shrink-0">
                <button onClick={() => setDropdownOpen((o) => !o)}
                  className={`flex items-center gap-2 bg-white border rounded-2xl px-4 py-3 text-[14px] font-medium transition-all shadow-sm ${
                    dropdownOpen ? 'border-[#E0813D] shadow-[0_0_0_3px_rgba(224,129,61,0.12)]' : 'border-[#EDE8E0] hover:border-[#D4C5B0]'
                  }`}>
                  <MapPin size={14} className="text-[#E0813D]" />
                  {CITY_LABELS[activeCity]}
                  <ChevronDown size={13} className={`text-[#A09080] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-[0_8px_40px_rgba(30,18,9,0.14)] border border-[#EDE8E0] py-1.5 min-w-[190px] z-30">
                    <div className="px-3.5 pt-1 pb-2 text-[11px] font-semibold text-[#B09880] uppercase tracking-wider">选择城市</div>
                    {CITY_SLUGS.map((city) => (
                      <button key={city} onClick={() => selectCity(city)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                          activeCity === city ? 'text-[#1E1209]' : 'text-[#6B5744] hover:bg-[#FAF5EE]'
                        }`}>
                        <div className={`w-2 h-2 rounded-full shrink-0 ${activeCity === city ? 'bg-[#E0813D]' : 'bg-[#E8DCCB]'}`} />
                        <div>
                          <div className={`text-[14px] ${activeCity === city ? 'font-semibold' : 'font-medium'}`}>{CITY_LABELS[city]}</div>
                          <div className="text-[11px] text-[#B09880]">{CITY_DESCRIPTIONS[city]}</div>
                        </div>
                        {activeCity === city && <CheckCircle2 size={14} className="text-[#E0813D] ml-auto shrink-0" />}
                      </button>
                    ))}
                    <div className="mx-3 my-1 border-t border-[#F0EAE0]" />
                    <button onClick={handleGeolocate} disabled={locating}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#A09080] hover:text-[#6B5744] hover:bg-[#FAF5EE] transition-colors">
                      {locating ? <Loader2 size={13} className="animate-spin" /> : <Locate size={13} />}
                      自动定位
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 relative bg-white rounded-2xl border border-[#EDE8E0] shadow-sm hover:border-[#D4C5B0] focus-within:border-[#E0813D] focus-within:shadow-[0_0_0_3px_rgba(224,129,61,0.10)] transition-all">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={`在${CITY_LABELS[activeCity]}搜索…`}
                  className="w-full pl-9 pr-4 py-3 text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none bg-transparent" />
              </div>

              <button onClick={handleSearch}
                className="bg-[#E0813D] hover:bg-[#CC7030] text-white px-5 py-3 rounded-2xl text-[14px] font-semibold transition-colors shrink-0 shadow-sm">
                搜索
              </button>
            </div>
          </div>

          {/* Right: slow-scrolling photo mosaic */}
          <div className="w-[272px] lg:w-[308px] shrink-0">
            <div className="relative h-[440px] overflow-hidden rounded-2xl"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)',
              }}>
              <div className="flex gap-2.5 h-full">

                {/* Column A — scrolls at one speed */}
                <div className="flex-1 flex flex-col gap-2.5"
                  style={{ animation: 'photoMosaicA 32s linear infinite', willChange: 'transform' }}>
                  {[...COL_A, ...COL_A].map((p, i) => (
                    <div key={i}
                      className="relative shrink-0 rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(30,18,9,0.13)]"
                      style={{ height: p.h }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.78) brightness(0.92)' }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/18 to-[#E0813D]/14" />
                    </div>
                  ))}
                </div>

                {/* Column B — different speed + time offset for stagger */}
                <div className="flex-1 flex flex-col gap-2.5"
                  style={{ animation: 'photoMosaicB 42s linear infinite', animationDelay: '-16s', willChange: 'transform' }}>
                  {[...COL_B, ...COL_B].map((p, i) => (
                    <div key={i}
                      className="relative shrink-0 rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(30,18,9,0.13)]"
                      style={{ height: p.h }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.78) brightness(0.92)' }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8EE]/18 to-[#E0813D]/14" />
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 真实宠物主观察 — 小红书精选 style ── */}
      <section className="pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="px-4 md:max-w-screen-xl md:mx-auto md:px-8 mb-5 md:mb-6">
          <h2 className="text-[16px] md:text-[20px] font-bold text-[#1E1209]">真实宠物主观察</h2>
          <p className="text-[11px] md:text-[13px] text-[#A09080] mt-1">来自铲屎官的第一手记录</p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 md:gap-4 px-4 md:px-8 pb-2" style={{ width: 'max-content' }}>
            {OBSERVATIONS.map((obs) => (
              <div key={obs.text}
                className="w-[210px] md:w-[236px] bg-white rounded-2xl border border-[#EDE8E0] p-4 flex flex-col gap-3 shrink-0 hover:border-[#D4C5B0] hover:shadow-[0_4px_20px_rgba(30,18,9,0.07)] transition-all">
                {/* Tag + city */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E0813D] bg-[#FFF0E2] px-2.5 py-1 rounded-full">
                    <span>{obs.emoji}</span>
                    <span>{obs.tag}</span>
                  </span>
                  <span className="text-[11px] text-[#C0B0A0]">{obs.city}</span>
                </div>
                {/* Text */}
                <p className="text-[13px] text-[#3A2518] leading-relaxed flex-1">
                  &ldquo;{obs.text}&rdquo;
                </p>
                {/* Category */}
                <div className="text-[11px] text-[#B09880] pt-2 border-t border-[#F5EFE6]">
                  {obs.type}
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="w-[180px] md:w-[200px] bg-gradient-to-br from-[#FFF0E2] to-[#FFF8EE] rounded-2xl border border-[#F5C49A] p-4 shrink-0 flex flex-col justify-center">
              <div className="text-2xl mb-2.5">🐾</div>
              <p className="text-[13px] font-semibold text-[#1E1209] mb-1.5">你也发现了？</p>
              <p className="text-[12px] text-[#A07855] leading-relaxed mb-3.5">投稿你遇到的宠物友好地点</p>
              <Link href="/submit-place"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#E0813D] hover:underline">
                去投稿 <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <div className="px-4 md:max-w-screen-xl md:mx-auto md:px-8 pb-8 md:pb-12">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-[16px] md:text-[20px] font-bold text-[#1E1209]">按类型探索</h2>
          <Link href="/places" className="flex items-center gap-1 text-[12px] md:text-[13px] text-[#E0813D] font-medium">
            查看全部 <ChevronRight size={13} />
          </Link>
        </div>
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2.5 pb-1 min-w-max">
            {CATEGORIES.map(({ value, label, emoji }) => (
              <Link key={value} href={`/places?category=${value}&city=${activeCity}`}
                className="flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-[#EDE8E0] px-4 py-3 hover:border-[#F5A462] transition-colors min-w-[68px]">
                <span className="text-[22px]">{emoji}</span>
                <span className="text-[11px] font-medium text-[#5C3D20] whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <Link key={value} href={`/places?category=${value}&city=${activeCity}`}
              className="flex flex-col items-center gap-2.5 bg-white rounded-2xl border border-[#EDE8E0] py-5 hover:border-[#D4C5B0] hover:shadow-[0_2px_12px_rgba(30,18,9,0.07)] transition-all group">
              <span className="text-[24px] group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-[12px] font-medium text-[#5C3D20]">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured places ── */}
      <div className="px-4 md:max-w-screen-xl md:mx-auto md:px-8 pb-8 md:pb-14">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-[16px] md:text-[20px] font-bold text-[#1E1209]">精选宠物友好地点</h2>
            <p className="text-[11px] md:text-[13px] text-[#A09080] mt-0.5">{CITY_LABELS[activeCity]} · 豆苗精选推荐</p>
          </div>
          <Link href={`/places?city=${activeCity}`} className="flex items-center gap-1 text-[12px] md:text-[13px] text-[#E0813D] font-medium">
            查看全部 <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-16">
            <Loader2 size={22} className="animate-spin text-[#E0813D]" />
          </div>
        ) : display.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6">
            {display.map((place) => <HomeCard key={place.id} place={place} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-[#C4A07E]">
            <div className="text-3xl mb-2">🐾</div>
            <div className="text-[13px]">该城市暂无数据，敬请期待</div>
          </div>
        )}

        {display.length > 0 && (
          <div className="mt-5 md:mt-8 text-center">
            <Link href={`/places?city=${activeCity}`}
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl border border-[#E8DCCB] text-[13px] md:text-[14px] font-medium text-[#7C5A42] hover:bg-white hover:border-[#D4C5B0] transition-all">
              查看 {CITY_LABELS[activeCity]} 全部地点 <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* ── 城市宠物生活 collections ── */}
      <div className="px-4 md:max-w-screen-xl md:mx-auto md:px-8 pb-10 md:pb-16">
        <div className="mb-4 md:mb-6">
          <h2 className="text-[16px] md:text-[20px] font-bold text-[#1E1209]">城市宠物生活</h2>
          <p className="text-[11px] md:text-[13px] text-[#A09080] mt-0.5">为养宠人发现更多城市空间</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLLECTIONS.map((col) => (
            <Link key={col.title} href={`${col.link}&city=${activeCity}`}
              className={`rounded-2xl border ${col.border} bg-gradient-to-br ${col.gradient} p-4 md:p-5 hover:shadow-[0_4px_20px_rgba(60,30,10,0.08)] transition-all group`}>
              <span className="text-2xl md:text-3xl block mb-2 md:mb-3 group-hover:scale-110 transition-transform">{col.emoji}</span>
              <h3 className="font-bold text-[#1E1209] text-[13px] md:text-[14px] leading-snug mb-1">{col.title}</h3>
              <p className="text-[11px] md:text-[12px] text-[#7C5A42] leading-relaxed">{col.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Trust section ── */}
      <section className="bg-white border-y border-[#EDE8E0] py-10 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-[17px] md:text-[22px] font-bold text-[#1E1209]">
              我们真的去过，真的打过电话
            </h2>
            <p className="text-[12px] md:text-[14px] text-[#A09080] mt-2">每一条信息背后，都有人工核实</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: CheckCircle2, label: '实地探访', desc: '豆苗团队亲自带狗到访，确认真实的宠物友好氛围与空间条件', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { icon: Phone,        label: '电话确认', desc: '直接致电商家，核实最新宠物政策，避免铲屎官白跑一趟',       color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-100' },
              { icon: Users,        label: '用户投稿', desc: '真实铲屎官的观察和投稿，持续丰富和更新地点信息',           color: 'text-sky-600',    bg: 'bg-sky-50',     border: 'border-sky-100' },
            ].map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`flex gap-4 sm:flex-col sm:gap-0 rounded-2xl border ${border} ${bg} p-5 md:p-7`}>
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl border ${border} flex items-center justify-center shrink-0 sm:mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="font-semibold text-[#1E1209] text-[14px] md:text-[15px] mb-1">{label}</div>
                  <div className="text-[12px] md:text-[13px] text-[#7C5A42] leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About + Partner ── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="rounded-2xl bg-[#1E1209] text-white p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <span className="text-xl md:text-2xl">🌱</span>
            <span className="font-bold text-[16px] md:text-[18px]">关于豆苗</span>
          </div>
          <p className="text-white/70 text-[13px] md:text-[14px] leading-relaxed mb-5 md:mb-6">
            我们理解养宠人走进一家店时那种"不知道会不会被白眼"的感受。豆苗希望让这种感受越来越少。通过真实核实和持续更新，让城市对毛孩子更开放一点。
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { num: String(places.length || '—'), label: '已收录地点' },
              { num: '3', label: '覆盖城市' },
              { num: '100%', label: '人工验证' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-2.5 md:p-3 text-center">
                <div className="font-bold text-[16px] md:text-[18px]">{num}</div>
                <div className="text-[10px] md:text-[11px] text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#FFF0E2] to-[#FFF8EE] border border-[#F5C49A] p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="text-2xl md:text-3xl mb-2 md:mb-3">🤝</div>
            <h3 className="font-bold text-[#1E1209] text-[16px] md:text-[18px] mb-2">欢迎毛孩子，不只是一句话</h3>
            <p className="text-[13px] md:text-[14px] text-[#7C5A42] leading-relaxed">
              如果你的空间真的欢迎宠物，让更多养宠人在地图上找到你。免费加入，由豆苗实地或电话核实。
            </p>
          </div>
          <Link href="/partner"
            className="mt-5 md:mt-6 flex items-center justify-center gap-2 bg-[#E0813D] hover:bg-[#CC7030] text-white py-3 md:py-3.5 rounded-xl font-medium text-[13px] md:text-[14px] transition-colors">
            加入宠物友好地图 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Footer (desktop only) ── */}
      <footer className="hidden md:block border-t border-[#EDE8E0] py-8">
        <div className="max-w-screen-xl mx-auto px-8 flex items-center justify-between text-[12px] text-[#B09880]">
          <span>© 2025 豆苗宠物友好 · 让每次出行都有毛孩子的位置</span>
          <div className="flex items-center gap-4">
            <Link href="/about"        className="hover:text-[#7C5A42] transition-colors">关于我们</Link>
            <Link href="/partner"      className="hover:text-[#7C5A42] transition-colors">商家入驻</Link>
            <Link href="/places"       className="hover:text-[#7C5A42] transition-colors">探索地点</Link>
            <Link href="/submit-place" className="hover:text-[#7C5A42] transition-colors">投稿地点</Link>
          </div>
        </div>
      </footer>

      {/* ── Mobile city bottom sheet ── */}
      {sheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#E8DCCB]" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-bold text-[#1E1209] text-[16px]">选择城市</span>
              <button onClick={() => setSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5EFE6] flex items-center justify-center">
                <X size={14} className="text-[#7C5A42]" />
              </button>
            </div>
            <div className="px-4 pb-2 space-y-1">
              {CITY_SLUGS.map((city) => (
                <button key={city} onClick={() => selectCity(city)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-colors text-left ${
                    activeCity === city ? 'bg-[#FFF0E2] border border-[#F5C49A]' : 'hover:bg-[#FAF7F2]'
                  }`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${activeCity === city ? 'bg-[#E0813D]' : 'bg-[#F5EBD8]'}`}>
                    <MapPin size={16} className={activeCity === city ? 'text-white' : 'text-[#C4A07E]'} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-[15px] font-semibold ${activeCity === city ? 'text-[#1E1209]' : 'text-[#3A2518]'}`}>{CITY_LABELS[city]}</div>
                    <div className="text-[12px] text-[#A09080] mt-0.5">{CITY_DESCRIPTIONS[city]}</div>
                  </div>
                  {activeCity === city && <CheckCircle2 size={16} className="text-[#E0813D] shrink-0" />}
                </button>
              ))}
              <button onClick={handleGeolocate} disabled={locating}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-[#F5EBD8] flex items-center justify-center shrink-0">
                  {locating ? <Loader2 size={16} className="text-[#C4A07E] animate-spin" /> : <Locate size={16} className="text-[#C4A07E]" />}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-[#3A2518]">自动定位</div>
                  <div className="text-[12px] text-[#A09080] mt-0.5">根据当前位置选择最近城市</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function HomeCard({ place }: { place: PlaceRow }) {
  const cover = (place.images ?? [])[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  const verifTag = buildVerifTag(place.verification_status)
  const tags = buildPlaceTags(place)
  return (
    <Link href={`/places/${place.id}`} className="group bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden hover:shadow-[0_4px_24px_rgba(30,18,9,0.10)] transition-all">
      <div className="aspect-[4/3] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {verifTag && (
          <span className={`absolute top-2.5 left-2.5 text-[11px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${verifTag.style}`}>
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
          <span>{[place.district, CITY_LABELS[place.city]].filter(Boolean).join(' · ')}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {tags.slice(0, 2).map((tag) => (
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
