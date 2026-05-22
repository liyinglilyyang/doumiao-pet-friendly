'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, ChevronRight, Star, CheckCircle2, Phone,
  Users, ArrowRight, Loader2,
} from 'lucide-react'
import PlaceCard from '@/components/PlaceCard'
import CategoryGrid from '@/components/CategoryGrid'
import type { PlaceRow, CitySlug } from '@/lib/database.types'
import { CITY_LABELS } from '@/lib/places'
import { RATING_CRITERIA } from '@/config/ratings'

const CITIES: CitySlug[] = ['guangzhou', 'shenzhen', 'hongkong']

export default function HomePage() {
  const [activeCity, setActiveCity] = useState<CitySlug>('guangzhou')
  const [searchQuery, setSearchQuery] = useState('')
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/places?city=${activeCity}`)
        if (res.ok) {
          const data = await res.json()
          setPlaces(data)
        }
      } catch {
        // silently fail — shows empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCity])

  const featuredPlaces = places.filter((p) => p.is_featured).slice(0, 6)
  const displayPlaces = featuredPlaces.length > 0 ? featuredPlaces : places.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      {/* ── Hero ── */}
      <div className="hero-gradient px-4 pt-10 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#E0813D] flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🌱</span>
          </div>
          <div>
            <div className="font-bold text-[#1E1209] text-base leading-tight">豆苗宠物友好</div>
            <div className="text-[10px] text-[#A07855] tracking-wide font-medium">DOUMIAO PET FRIENDLY</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1E1209] leading-snug mb-1">
          发现真正欢迎<br />毛孩子的地方
        </h1>
        <p className="text-sm text-[#A07855] mb-5">标准化的宠物友好信息，可搜索，可验证</p>

        <div className="flex gap-2 mb-4">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCity === city
                  ? 'bg-[#E0813D] text-white shadow-md'
                  : 'bg-white/70 text-[#7C5A42] border border-[#E8DCCB]'
              }`}
            >
              <MapPin size={11} />
              {CITY_LABELS[city]}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索酒店 / 餐厅 / 咖啡店 / 寄养..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E] shadow-[0_2px_8px_rgba(60,30,10,0.06)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim())
                window.location.href = `/places?q=${encodeURIComponent(searchQuery)}`
            }}
          />
          {searchQuery && (
            <Link
              href={`/places?q=${encodeURIComponent(searchQuery)}`}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#E0813D] text-white text-xs px-2.5 py-1 rounded-xl"
            >
              搜索
            </Link>
          )}
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1E1209] text-base">按类型探索</h2>
          <Link href="/places" className="flex items-center gap-0.5 text-xs text-[#E0813D] font-medium">
            全部 <ChevronRight size={13} />
          </Link>
        </div>
        <CategoryGrid />
      </div>

      {/* ── Rating System Intro ── */}
      <div className="mx-4 mb-6 rounded-2xl bg-gradient-to-br from-[#FFF8EE] to-[#FFF0DC] border border-[#F5C49A] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#E0813D] flex items-center justify-center">
            <Star size={14} className="fill-white text-white" />
          </div>
          <div>
            <div className="font-bold text-[#1E1209] text-sm">豆苗推荐指数</div>
            <div className="text-[11px] text-[#A07855]">6 维度专项评分体系</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {RATING_CRITERIA.map((c) => (
            <div key={c.key} className="flex items-start gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#E0813D]/15 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E0813D]" />
              </div>
              <span className="text-[11px] text-[#5C3D20] leading-tight">{c.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-[#F5C49A]/60 flex items-center justify-between">
          <span className="text-xs text-[#A07855]">综合信任评估体系</span>
          <div className="flex items-center gap-1">
            {[1,2,3,4].map((i) => <Star key={i} size={12} className="fill-[#F0BE56] text-[#F0BE56]" />)}
            <Star size={12} className="fill-[#E8DCCB] text-[#E8DCCB]" />
            <span className="text-xs font-semibold text-[#1E1209] ml-1">4.6</span>
          </div>
        </div>
      </div>

      {/* ── Verification Methods ── */}
      <div className="px-4 mb-6">
        <h2 className="font-bold text-[#1E1209] text-base mb-3">三重验证机制</h2>
        <div className="flex gap-2.5">
          {[
            { icon: CheckCircle2, label: '实地探访', desc: '豆苗团队亲自验证', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { icon: Phone, label: '电话确认', desc: '致电商家核实政策', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
            { icon: Users, label: '用户反馈', desc: '真实用户体验投稿', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`flex-1 rounded-xl border p-2.5 ${bg}`}>
              <Icon size={16} className={`${color} mb-1.5`} />
              <div className="text-xs font-semibold text-[#1E1209] mb-0.5">{label}</div>
              <div className="text-[10px] text-[#A07855] leading-tight">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Places ── */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#1E1209] text-base">精选宠物友好地点</h2>
            <p className="text-xs text-[#A07855] mt-0.5">{CITY_LABELS[activeCity]} · 豆苗精选推荐</p>
          </div>
          <Link href={`/places?city=${activeCity}`} className="flex items-center gap-0.5 text-xs text-[#E0813D] font-medium">
            查看全部 <ChevronRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-[#E0813D]" />
          </div>
        ) : displayPlaces.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {displayPlaces.map((place) => (
              <PlaceCardDB key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#C4A07E]">
            <div className="text-3xl mb-2">🐾</div>
            <div className="text-sm">该城市暂无数据，敬请期待</div>
          </div>
        )}

        {displayPlaces.length > 0 && (
          <Link
            href={`/places?city=${activeCity}`}
            className="flex items-center justify-center gap-1.5 w-full mt-4 py-3 rounded-2xl border border-[#E8DCCB] text-sm font-medium text-[#7C5A42] hover:bg-white transition-colors"
          >
            查看 {CITY_LABELS[activeCity]} 全部地点 <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* ── About ── */}
      <div className="mx-4 mb-6 rounded-2xl bg-[#1E1209] text-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🌱</span>
          <span className="font-bold text-base">关于豆苗</span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          豆苗宠物友好希望建立一个更透明、更可信的宠物友好信息平台。我们通过电话确认、实地探访、用户反馈和商家自提交，持续更新城市里的宠物友好信息。
        </p>
        <div className="flex gap-2">
          {[
            { num: String(places.length || '—'), label: '已收录地点' },
            { num: '3', label: '覆盖城市' },
            { num: '100%', label: '人工验证' },
          ].map(({ num, label }) => (
            <div key={label} className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg">{num}</div>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partner CTA ── */}
      <div className="mx-4 mb-8 rounded-2xl bg-gradient-to-br from-[#FFF0E2] to-[#FFF8EE] border border-[#F5C49A] p-5">
        <div className="text-2xl mb-2">🤝</div>
        <h3 className="font-bold text-[#1E1209] text-base mb-1">成为豆苗认证商家</h3>
        <p className="text-sm text-[#7C5A42] mb-4 leading-relaxed">
          免费入驻，触达广深港数万宠物主，展示您的宠物友好政策。
        </p>
        <Link
          href="/partner"
          className="flex items-center justify-center gap-1.5 bg-[#E0813D] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#CC7030] transition-colors"
        >
          立即申请入驻 <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// Thin adapter: PlaceRow → PlaceCard props
function PlaceCardDB({ place }: { place: PlaceRow }) {
  const images = place.images ?? []
  const cover = images[0] ?? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  const verif = (place.verification_status === 'doumiao_verified' || place.verification_status === 'visited')
    ? 'onsite'
    : place.verification_status === 'phone_verified'
    ? 'phone'
    : 'user'

  // Map PlaceRow to the legacy Place shape PlaceCard expects
  const adapted = {
    id: place.id,
    name: place.name,
    city: place.city as 'guangzhou' | 'shenzhen' | 'hongkong',
    district: place.district ?? '',
    type: place.category as 'hotel' | 'cafe' | 'restaurant' | 'boarding' | 'service' | 'transport',
    images,
    coverImage: cover,
    tags: buildTags(place),
    rating: place.doumiao_score ?? 0,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: place.large_dog_score ?? 3,
      outdoorSpace: place.environment_score ?? 3,
      staffAttitude: place.staff_score ?? 3,
      petFacilities: 3,
      userFeedback: 3,
    },
    verification: {
      status: verif as 'onsite' | 'phone' | 'user',
      lastUpdated: place.updated_at,
      summary: place.pet_policy ?? '',
    },
    petRules: {
      canEnterIndoor: place.indoor_allowed,
      largeDogAllowed: place.large_dog_allowed,
      leashRequired: place.leash_required,
      appointmentRequired: false,
    },
    address: place.address ?? '',
    description: place.description ?? '',
  }
  return <PlaceCard place={adapted as Parameters<typeof PlaceCard>[0]['place']} />
}

function buildTags(place: PlaceRow): string[] {
  const tags: string[] = []
  if (place.indoor_allowed) tags.push('可进室内')
  if (place.outdoor_allowed) tags.push('有户外位')
  if (place.large_dog_allowed) tags.push('可带大型犬')
  if (place.water_available) tags.push('提供水碗')
  if (place.pet_menu) tags.push('宠物菜单')
  return tags.slice(0, 3)
}
