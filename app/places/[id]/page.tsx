'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Clock,
  CheckCircle2, XCircle, Star, ExternalLink,
  ChevronLeft, ChevronRight, X, Loader2,
} from 'lucide-react'
import type { PlaceRow } from '@/lib/database.types'
import CommunityModal from '@/components/CommunityModal'
import {
  CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS, VERIFICATION_LABELS,
  PET_SIZE_LABELS, SOURCE_LABELS, buildPlaceTags, buildVerifTag,
} from '@/lib/places'

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [place, setPlace] = useState<PlaceRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/places/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setPlace)
      .catch(() => setPlace(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFAF4]">
      <Loader2 size={28} className="animate-spin text-[#C07A4E]" />
    </div>
  )

  if (!place) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFAF4] pb-20 md:pb-0">
      <div className="text-5xl">🐾</div>
      <p className="text-[#7C5A42] text-[16px]">找不到该商家</p>
      <Link href="/places" className="text-[14px] text-[#C07A4E] hover:underline">← 返回列表</Link>
    </div>
  )

  const fallback = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
  const images = (place.images ?? []).length > 0 ? place.images! : [fallback]
  const score = place.doumiao_score ?? place.pet_friendliness_score
  const petTags = buildPlaceTags(place)
  const verifTag = buildVerifTag(place.verification_status)
  const phone = place.contact_phone ?? place.phone

  const SCORES = [
    { label: '豆苗推荐', value: place.doumiao_score },
    { label: '宠物友好', value: place.pet_friendliness_score },
    { label: '环境', value: place.environment_score },
    { label: '店员', value: place.staff_friendliness_score ?? place.staff_score },
    { label: '自由度', value: place.freedom_score },
    { label: '大型犬', value: place.large_dog_score },
  ].filter((s) => s.value != null)

  const RULES = [
    { label: '可进室内', value: place.indoor_allowed },
    { label: '有户外座位', value: place.outdoor_seating || place.outdoor_allowed },
    { label: '接受大型犬', value: place.large_dog_allowed },
    { label: '接受猫咪', value: place.cat_allowed },
    { label: '提供饮水', value: place.water_provided || place.water_available },
    { label: '有宠物菜单', value: place.pet_menu },
    { label: '需要牵引绳', value: place.leash_required },
    { label: '需要携带笼/袋', value: place.carrier_required },
  ]

  const verifBadge: Record<string, string> = {
    doumiao_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partner_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    visited_verified: 'bg-blue-50 text-blue-700 border-blue-200',
    visited:          'bg-blue-50 text-blue-700 border-blue-200',
    phone_verified:   'bg-orange-50 text-orange-700 border-orange-200',
    unverified:       'bg-gray-50 text-gray-400 border-gray-200',
  }

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length) }}>
            <ChevronLeft size={22} />
          </button>
          <img src={images[lightboxIndex]} alt="" className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length) }}>
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-5 text-white/60 text-[13px]">{lightboxIndex + 1} / {images.length}</div>
        </div>
      )}

      <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-[56px] md:h-[60px] flex items-center gap-3 md:gap-4">
            <Link href="/places" className="flex items-center gap-1.5 text-[14px] text-[#7C5A42] hover:text-[#1E1209] transition-colors font-medium">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">返回列表</span>
            </Link>
            <span className="hidden sm:inline text-[#E8DCCB]">/</span>
            <span className="hidden sm:inline text-[14px] text-[#A09080] truncate max-w-[200px] md:max-w-xs">{place.name}</span>
            <div className="ml-auto flex items-center gap-4">
              <Link href="/submit-place" className="hidden md:inline text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">投稿地点</Link>
              <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-[#1E1209]">
                <span>🌱</span>
                <span className="hidden md:inline">豆苗宠物友好</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-8">

          {/* ── Image gallery — desktop 4×2 grid, mobile single hero ── */}
          {/* Mobile: single hero image */}
          <div className="md:hidden rounded-2xl overflow-hidden mb-5 aspect-[4/3] relative cursor-pointer"
            onClick={() => setLightboxIndex(0)}>
            <img src={images[0]} alt={place.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <button className="absolute bottom-3 right-3 bg-black/50 text-white text-[12px] px-3 py-1.5 rounded-xl backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0) }}>
                查看全部 {images.length} 张
              </button>
            )}
          </div>

          {/* Desktop: 4×2 grid */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[380px] lg:h-[420px] rounded-2xl overflow-hidden mb-8">
            <div className="col-span-2 row-span-2 cursor-pointer relative group overflow-hidden"
              onClick={() => setLightboxIndex(0)}>
              <img src={images[0]} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`relative overflow-hidden cursor-pointer group ${images[i] ? '' : 'bg-[#F5EBD8]'}`}
                onClick={() => images[i] && setLightboxIndex(i)}>
                {images[i] ? (
                  <>
                    <img src={images[i]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    {i === 4 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-[13px] font-semibold">+{images.length - 4} 张</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D4C0A8] text-2xl">
                    {i === 1 ? '🐾' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Body: flex-col on mobile, flex-row on lg+ ── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

            {/* ── Left: main content ── */}
            <div className="flex-1 min-w-0 space-y-6 md:space-y-7">

              {/* Title block */}
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[13px] bg-[#F5EBD8] text-[#7C5A42] px-2.5 py-0.5 rounded-full font-medium">
                        {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
                      </span>
                      <span className={`text-[12px] px-2.5 py-0.5 rounded-full border font-medium ${verifBadge[place.verification_status]}`}>
                        {VERIFICATION_LABELS[place.verification_status]?.label}
                      </span>
                    </div>
                    <h1 className="text-[24px] md:text-[28px] font-bold text-[#1E1209] leading-tight mb-2">{place.name}</h1>
                    <div className="flex items-center gap-1.5 text-[13px] md:text-[14px] text-[#A09080] flex-wrap">
                      <MapPin size={13} />
                      {CITY_LABELS[place.city]}{place.district ? ` · ${place.district}` : ''}
                      {place.address && <span className="text-[#D4C0A8]">· {place.address}</span>}
                    </div>
                  </div>
                  {score != null && (
                    <div className="shrink-0 flex items-center gap-1.5 bg-white rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-[#EDE8E0] shadow-sm">
                      <Star size={16} className="fill-[#F0BE56] text-[#F0BE56]" />
                      <span className="text-[20px] md:text-[24px] font-bold text-[#1E1209]">{score.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {petTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {petTags.map((t) => (
                      <span key={t.key} className={`text-[12px] px-3 py-1 rounded-full font-medium ${t.style}`}>{t.label}</span>
                    ))}
                    {verifTag && (
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${verifTag.style}`}>{verifTag.label}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile: community update CTA */}
              <div className="lg:hidden">
                <div className="bg-[#FFF8EE] rounded-2xl border border-[#E8C4A8]/60 px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-[12px] text-[#7C5A42] leading-snug">
                    加入社群，获取最新宠物友好情报
                  </p>
                  <button onClick={() => setModalOpen(true)}
                    className="shrink-0 px-3 py-1.5 rounded-xl border border-[#E8C4A8] text-[12px] font-medium text-[#C07A4E] bg-white hover:bg-[#FAF0E8] transition-colors">
                    加入社群
                  </button>
                </div>
              </div>

              {/* Mobile: contact card (shows on mobile, hidden on lg where it's in sidebar) */}
              <div className="lg:hidden bg-white rounded-2xl border border-[#EDE8E0] shadow-sm p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F5EFE6]">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5EBD8] shrink-0">
                    {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">🐾</div>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[14px] text-[#1E1209] truncate">{place.name}</p>
                    <p className="text-[12px] text-[#A09080]">{CITY_LABELS[place.city]}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {place.wechat && (
                    <button className="flex items-center justify-center gap-2 bg-[#C07A4E] text-white py-2.5 rounded-xl text-[13px] font-medium">
                      <MessageCircle size={15} />微信咨询
                    </button>
                  )}
                  {phone && (
                    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-[#FAF7F2] text-[#1E1209] py-2.5 rounded-xl text-[13px] font-medium border border-[#EDE8E0]">
                      <Phone size={15} />{phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              {place.description && (
                <Section title="商家介绍">
                  <p className="text-[14px] md:text-[15px] text-[#5C3D20] leading-relaxed">{place.description}</p>
                </Section>
              )}

              {/* Pet rules */}
              <Section title="🐾 宠物入场规则">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-3">
                  {RULES.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[#F5EFE6]">
                      <span className="text-[13px] md:text-[14px] text-[#5C3D20]">{label}</span>
                      <span className={`flex items-center gap-1 text-[12px] md:text-[13px] font-medium ${value ? 'text-emerald-600' : 'text-rose-400'}`}>
                        {value ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {value ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
                {place.pet_size_allowed && place.pet_size_allowed !== 'unknown' && (
                  <div className="mt-3 flex items-center gap-2 text-[13px] md:text-[14px] text-[#6B5744]">
                    <span className="text-[#C4A07E]">允许体型：</span>
                    <span className="font-medium">{PET_SIZE_LABELS[place.pet_size_allowed]}</span>
                  </div>
                )}
                {(place.pet_policy || place.rules_text) && (
                  <div className="mt-4 space-y-3">
                    {place.pet_policy && (
                      <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#EDE8E0]">
                        <p className="text-[13px] text-[#7C5A42] leading-relaxed">{place.pet_policy}</p>
                      </div>
                    )}
                    {place.rules_text && place.rules_text !== place.pet_policy && (
                      <details className="group">
                        <summary className="text-[13px] text-[#C4A07E] cursor-pointer hover:text-[#A07855] select-none">
                          查看商家原始规则 ▸
                        </summary>
                        <div className="mt-2 bg-[#FAF7F2] rounded-xl p-4 border border-[#EDE8E0]">
                          <p className="text-[13px] text-[#7C5A42] leading-relaxed whitespace-pre-line">{place.rules_text}</p>
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </Section>

              {/* 豆苗真实观察 */}
              {(() => {
                const OBS_DEF = [
                  { key: 'genuinely_welcoming' as const, emoji: '💚', label: '真心欢迎宠物', hint: '不只是容忍，而是真欢迎' },
                  { key: 'large_dog_vibe'      as const, emoji: '🐕', label: '大型犬也自在', hint: '大狗来了空间和氛围都OK' },
                  { key: 'staff_engages'       as const, emoji: '🤝', label: '店员主动互动', hint: '会递水、打招呼或撸狗' },
                  { key: 'dog_relaxed'         as const, emoji: '😌', label: '狗狗整体放松', hint: '没有明显焦虑或紧绷' },
                  { key: 'vibe_social'         as const, emoji: '👥', label: '适合社交聚会', hint: '带狗来和朋友聚是好选择' },
                  { key: 'weekend_crowded'     as const, emoji: '📅', label: '周末较拥挤',   hint: '人多，建议工作日来' },
                  { key: 'no_judgement'        as const, emoji: '✨', label: '不会被白眼',   hint: '周围的人都很友好' },
                ]
                const filled = OBS_DEF.filter(o => place[o.key] !== null && place[o.key] !== undefined)
                if (filled.length === 0) return null
                return (
                  <Section title="🌱 豆苗观察">
                    <div className="bg-[#FFFBF3] rounded-2xl p-4 md:p-5 border border-[#F0E4C8]">
                      <p className="text-[12px] text-[#A07855] mb-3 pb-3 border-b border-[#EDE0C8]">
                        基于豆苗团队实地观察和用户真实投稿整合
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filled.map(({ key, emoji, label, hint }) => {
                          const v = place[key]
                          return (
                            <div key={key} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${v ? 'opacity-100' : 'opacity-40'}`}>
                              <span className={`text-base shrink-0 mt-0.5 ${v ? '' : 'grayscale'}`}>{emoji}</span>
                              <div>
                                <div className={`text-[13px] font-medium flex items-center gap-1.5 ${v ? 'text-[#1E1209]' : 'text-[#A09080] line-through'}`}>
                                  {v && <span className="text-emerald-500 text-[11px]">✓</span>}
                                  {!v && <span className="text-rose-400 text-[11px]">✗</span>}
                                  {label}
                                </div>
                                <div className="text-[11px] text-[#B09880]">{hint}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Section>
                )
              })()}

              {/* Scores */}
              {SCORES.length > 0 && (
                <Section title="豆苗评分">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {SCORES.map(({ label, value }) => (
                      <div key={label} className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EDE8E0] text-center">
                        <div className="text-[22px] font-bold text-[#C07A4E] leading-none mb-1">{value!.toFixed(1)}</div>
                        <div className="flex items-center justify-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={10} className={i < Math.round(value!) ? 'fill-[#F0BE56] text-[#F0BE56]' : 'text-[#E8DCCB] fill-[#E8DCCB]'} />
                          ))}
                        </div>
                        <div className="text-[11px] text-[#A09080] font-medium">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {SCORES.map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-[12px] text-[#6B5744] w-[5.5rem] shrink-0">{label}</span>
                        <div className="flex-1 bg-[#F5EBD8] rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#C07A4E] to-[#D99478] rounded-full transition-all"
                            style={{ width: `${(value! / 5) * 100}%` }} />
                        </div>
                        <span className="text-[12px] font-semibold text-[#1E1209] w-6 text-right">{value!.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Map */}
              {place.latitude && place.longitude && (
                <Section title="位置">
                  <div className="rounded-2xl overflow-hidden border border-[#EDE8E0] relative">
                    <iframe title="location"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.006}%2C${place.latitude - 0.004}%2C${place.longitude + 0.006}%2C${place.latitude + 0.004}&layer=mapnik&marker=${place.latitude}%2C${place.longitude}`}
                      className="w-full h-48 md:h-56 border-0" loading="lazy" />
                    <a href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[#7C5A42] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-md border border-[#EDE8E0] hover:bg-[#FAF7F2]">
                      <ExternalLink size={12} />在 Google Maps 打开
                    </a>
                  </div>
                  {place.address && (
                    <p className="mt-2.5 flex items-start gap-2 text-[12px] md:text-[13px] text-[#A09080]">
                      <MapPin size={13} className="shrink-0 mt-0.5 text-[#C4A07E]" />{place.address}
                    </p>
                  )}
                </Section>
              )}
              {(!place.latitude || !place.longitude) && place.address && (
                <div className="flex items-start gap-2 text-[13px] md:text-[14px] text-[#7C5A42]">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                  <div>
                    <p>{place.address}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[12px] text-[#C07A4E] hover:underline flex items-center gap-1 mt-1">
                      <ExternalLink size={11} />在地图中查看
                    </a>
                  </div>
                </div>
              )}

              {/* Trust & verification */}
              {(() => {
                const TRUST_STEPS: { status: string[]; icon: string; label: string; desc: string }[] = [
                  { status: ['phone_verified','visited','visited_verified','doumiao_verified','partner_verified'], icon: '📞', label: '已电话确认', desc: '豆苗团队致电确认宠物政策' },
                  { status: ['visited','visited_verified','doumiao_verified','partner_verified'],                  icon: '📍', label: '已实地探访', desc: '团队成员带狗亲自到访' },
                  { status: ['doumiao_verified','partner_verified'],                                              icon: '🌱', label: '豆苗认证',   desc: '最高信任等级，持续跟进' },
                ]
                const activeCount = TRUST_STEPS.filter(s => s.status.includes(place.verification_status)).length
                if (activeCount === 0 && !place.last_verified_at && !place.verification_notes) return null
                return (
                  <div className="bg-[#FAF7F2] rounded-2xl p-4 md:p-5 border border-[#EDE8E0]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[13px] font-bold text-[#1E1209]">信任体系</h3>
                      {place.last_verified_at && (
                        <span className="text-[11px] text-[#A09080]">
                          更新于 {new Date(place.last_verified_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                          {place.source && ` · ${SOURCE_LABELS[place.source]}`}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      {TRUST_STEPS.map(({ status, icon, label, desc }) => {
                        const active = status.includes(place.verification_status)
                        return (
                          <div key={label} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${active ? 'bg-white border border-[#E8DCCB]' : 'opacity-30'}`}>
                            <span className={`text-base shrink-0 ${active ? '' : 'grayscale'}`}>{icon}</span>
                            <div className="flex-1">
                              <div className={`text-[13px] font-medium ${active ? 'text-[#1E1209]' : 'text-[#A09080]'}`}>{label}</div>
                              <div className="text-[11px] text-[#A09080]">{desc}</div>
                            </div>
                            {active && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                    {place.verification_notes && (
                      <p className="mt-3 pt-3 border-t border-[#EDE8E0] text-[12px] text-[#7C5A42] leading-relaxed">{place.verification_notes}</p>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* ── Right: sticky contact sidebar (desktop only) ── */}
            <div className="hidden lg:block w-[320px] shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_4px_20px_rgba(60,30,10,0.08)] p-6">
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F5EFE6]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5EBD8] shrink-0">
                      {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[14px] text-[#1E1209] truncate">{place.name}</p>
                      <p className="text-[12px] text-[#A09080]">{CITY_LABELS[place.city]}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {place.wechat && (
                      <button className="w-full flex items-center justify-center gap-2 bg-[#C07A4E] hover:bg-[#A86840] text-white py-3 rounded-xl text-[14px] font-medium transition-colors shadow-sm">
                        <MessageCircle size={16} />微信咨询
                      </button>
                    )}
                    {phone && (
                      <a href={`tel:${phone}`} className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F5EBD8] text-[#1E1209] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#EDE8E0]">
                        <Phone size={16} />{phone}
                      </a>
                    )}
                    {place.booking_url && (
                      <a href={place.booking_url} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#7C5A42] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#EDE8E0]">
                        <ExternalLink size={14} />在线预约
                      </a>
                    )}
                    {place.xiaohongshu_url && (
                      <a href={place.xiaohongshu_url} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#C07A4E] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#E8C4A8]">
                        📕 小红书主页
                      </a>
                    )}
                  </div>
                </div>
                {place.business_hours && (
                  <div className="bg-white rounded-2xl border border-[#EDE8E0] p-4 shadow-sm">
                    <p className="text-[12px] font-semibold text-[#A09080] uppercase tracking-wider mb-2">营业时间</p>
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                      <p className="text-[13px] text-[#6B5744] leading-relaxed">{place.business_hours}</p>
                    </div>
                  </div>
                )}
                {(petTags.length > 0 || verifTag) && (
                  <div className="bg-white rounded-2xl border border-[#EDE8E0] p-4 shadow-sm">
                    <p className="text-[12px] font-semibold text-[#A09080] uppercase tracking-wider mb-3">宠物友好亮点</p>
                    <div className="flex flex-wrap gap-1.5">
                      {petTags.map((t) => (
                        <span key={t.key} className={`text-[11px] px-2 py-1 rounded-full font-medium ${t.style}`}>{t.label}</span>
                      ))}
                      {verifTag && (
                        <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${verifTag.style}`}>{verifTag.label}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop sidebar: community CTA */}
              <div className="bg-[#FFF8EE] rounded-2xl border border-[#E8C4A8]/60 p-4">
                <p className="text-[13px] text-[#7C5A42] leading-relaxed mb-3">
                  这家店信息可能会更新，加入社群获取最新宠物友好情报。
                </p>
                <button onClick={() => setModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-[#E8C4A8] text-[13px] font-medium text-[#C07A4E] bg-white hover:bg-[#FAF0E8] transition-colors">
                  加入社群 / 获取更新
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)} sourcePage="place_detail" />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[16px] md:text-[17px] font-bold text-[#1E1209] mb-4 pb-2 border-b border-[#F0EAE0]">{title}</h2>
      {children}
    </div>
  )
}
