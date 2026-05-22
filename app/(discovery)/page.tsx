'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, ChevronRight, ArrowRight,
  Loader2, CheckCircle2, Phone, Users, Star,
} from 'lucide-react'
import type { PlaceRow, CitySlug, PlaceCategory } from '@/lib/database.types'
import { CITY_LABELS, buildPlaceTags, buildVerifTag } from '@/lib/places'

const CITIES: CitySlug[] = ['guangzhou', 'shenzhen', 'hongkong']

const CATEGORIES: { value: PlaceCategory; label: string; emoji: string }[] = [
  { value: 'cafe',      label: '咖啡店',   emoji: '☕' },
  { value: 'restaurant',label: '餐厅',     emoji: '🍽️' },
  { value: 'hotel',     label: '酒店',     emoji: '🏨' },
  { value: 'park',      label: '公园',     emoji: '🌳' },
  { value: 'boarding',  label: '宠物寄养', emoji: '🏠' },
  { value: 'grooming',  label: '美容洗护', emoji: '✂️' },
  { value: 'transport', label: '宠物运输', emoji: '🚗' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCity, setActiveCity] = useState<CitySlug>('guangzhou')
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)

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

  const featured = places.filter((p) => p.is_featured).slice(0, 6)
  const display = featured.length > 0 ? featured : places.slice(0, 6)

  function handleSearch() {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    params.set('city', activeCity)
    window.location.href = `/places?${params}`
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0] shadow-[0_1px_8px_rgba(60,30,10,0.05)]">
        <div className="max-w-screen-xl mx-auto px-8 h-[64px] flex items-center gap-6">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places" className="text-[13px] font-medium text-[#7C5A42] hover:text-[#1E1209] transition-colors">探索地点</Link>
            <Link href="/about" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">关于</Link>
            <Link
              href="/partner"
              className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] transition-colors font-medium"
            >
              商家入驻
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FFF3E8] text-[#E0813D] text-[13px] font-medium px-3.5 py-1.5 rounded-full mb-7 border border-[#F5C49A]">
            <span>🐾</span> 广深港最全宠物友好地图
          </div>
          <h1 className="text-[52px] font-bold text-[#1E1209] leading-tight mb-4">
            发现真正欢迎<br />毛孩子的地方
          </h1>
          <p className="text-[17px] text-[#7C5A42] mb-10 leading-relaxed">
            标准化宠物友好信息，经过实地验证，可搜索，可信赖
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(60,30,10,0.10)] border border-[#EDE8E0] p-2 flex items-center gap-2">
            <div className="flex gap-1 pl-1">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                    activeCity === city
                      ? 'bg-[#1E1209] text-white'
                      : 'text-[#7C5A42] hover:bg-[#F5EBD8]'
                  }`}
                >
                  <MapPin size={11} />
                  {CITY_LABELS[city]}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-[#EDE8E0] shrink-0" />
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索咖啡店、酒店、寄养..."
                className="w-full pl-9 pr-4 py-2.5 text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none bg-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#E0813D] hover:bg-[#CC7030] text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors shrink-0"
            >
              搜索
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-screen-xl mx-auto px-8 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#1E1209]">按类型探索</h2>
          <Link href="/places" className="flex items-center gap-1 text-[13px] text-[#E0813D] font-medium hover:underline">
            查看全部 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <Link
              key={value}
              href={`/places?category=${value}`}
              className="flex flex-col items-center gap-2.5 bg-white rounded-2xl border border-[#EDE8E0] py-6 hover:border-[#F5A462] hover:shadow-[0_2px_12px_rgba(224,129,61,0.12)] transition-all group"
            >
              <span className="text-[26px] group-hover:scale-110 transition-transform leading-none">{emoji}</span>
              <span className="text-[12px] font-medium text-[#5C3D20]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured places */}
      <section className="max-w-screen-xl mx-auto px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#1E1209]">精选宠物友好地点</h2>
            <p className="text-[13px] text-[#A09080] mt-1">{CITY_LABELS[activeCity]} · 豆苗精选推荐</p>
          </div>
          <Link href={`/places?city=${activeCity}`} className="flex items-center gap-1 text-[13px] text-[#E0813D] font-medium hover:underline">
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#E0813D]" />
          </div>
        ) : display.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {display.map((place) => <PlaceCard key={place.id} place={place} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[#C4A07E]">
            <div className="text-4xl mb-3">🐾</div>
            <div className="text-[14px]">该城市暂无数据，敬请期待</div>
          </div>
        )}

        {display.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/places?city=${activeCity}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E8DCCB] text-[14px] font-medium text-[#7C5A42] hover:bg-white hover:shadow-[0_2px_8px_rgba(60,30,10,0.08)] transition-all"
            >
              查看 {CITY_LABELS[activeCity]} 全部地点 <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Trust pillars */}
      <section className="bg-white border-y border-[#EDE8E0] py-14">
        <div className="max-w-screen-xl mx-auto px-8">
          <h2 className="text-[20px] font-bold text-[#1E1209] text-center mb-10">三重验证机制，确保信息可信</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: CheckCircle2, label: '实地探访', desc: '豆苗团队亲赴现场，亲眼确认宠物友好政策与实际环境', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { icon: Phone,        label: '电话确认', desc: '直接联系商家，核实最新宠物政策与进入限制条件',     color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-100' },
              { icon: Users,        label: '用户反馈', desc: '收集真实带宠用户的体验反馈，持续更新信息准确性',   color: 'text-sky-600',    bg: 'bg-sky-50',     border: 'border-sky-100' },
            ].map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-7`}>
                <div className={`w-11 h-11 rounded-xl border ${border} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="font-semibold text-[#1E1209] text-[15px] mb-2">{label}</div>
                <div className="text-[13px] text-[#7C5A42] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Partner */}
      <section className="max-w-screen-xl mx-auto px-8 py-16 grid grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#1E1209] text-white p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-[18px]">关于豆苗</span>
          </div>
          <p className="text-white/75 text-[14px] leading-relaxed mb-6">
            豆苗宠物友好希望建立一个更透明、更可信的宠物友好信息平台。我们通过电话确认、实地探访、用户反馈和商家自提交，持续更新城市里的宠物友好信息。
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: String(places.length || '—'), label: '已收录地点' },
              { num: '3', label: '覆盖城市' },
              { num: '100%', label: '人工验证' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="font-bold text-[18px]">{num}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#FFF0E2] to-[#FFF8EE] border border-[#F5C49A] p-8 flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-bold text-[#1E1209] text-[18px] mb-2">成为豆苗认证商家</h3>
            <p className="text-[14px] text-[#7C5A42] leading-relaxed">
              免费入驻，触达广深港数万宠物主，展示您的宠物友好政策，吸引宠物家庭来访。
            </p>
          </div>
          <Link
            href="/partner"
            className="mt-6 flex items-center justify-center gap-2 bg-[#E0813D] hover:bg-[#CC7030] text-white py-3.5 rounded-xl font-medium text-[14px] transition-colors"
          >
            立即申请入驻 <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDE8E0] py-8">
        <div className="max-w-screen-xl mx-auto px-8 flex items-center justify-between text-[12px] text-[#B09880]">
          <span>© 2025 豆苗宠物友好 · 让每次出行都有毛孩子的位置</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#7C5A42] transition-colors">关于我们</Link>
            <Link href="/partner" className="hover:text-[#7C5A42] transition-colors">商家入驻</Link>
            <Link href="/places" className="hover:text-[#7C5A42] transition-colors">探索地点</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PlaceCard({ place }: { place: PlaceRow }) {
  const cover = (place.images ?? [])[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  const verifTag = buildVerifTag(place.verification_status)
  const tags = buildPlaceTags(place)

  return (
    <Link
      href={`/places/${place.id}`}
      className="group bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden hover:shadow-[0_4px_20px_rgba(60,30,10,0.10)] transition-all"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={cover}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {verifTag && (
          <span className={`absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${verifTag.style}`}>
            {verifTag.label}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-[14px] text-[#1E1209] leading-snug">{place.name}</h3>
          {place.doumiao_score != null && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star size={12} className="fill-[#F0BE56] text-[#F0BE56]" />
              <span className="text-[12px] font-semibold text-[#1E1209]">{place.doumiao_score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[#A09080] mb-3">
          <MapPin size={11} />
          <span>{[place.district, CITY_LABELS[place.city]].filter(Boolean).join(' · ')}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag.key} className="text-[11px] bg-[#F5EBD8] text-[#7C5A42] px-2 py-0.5 rounded-full">{tag.label}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
