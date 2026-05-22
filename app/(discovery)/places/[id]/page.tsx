'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Clock,
  CheckCircle2, XCircle, Star, ExternalLink, ChevronLeft, ChevronRight, X, Loader2,
} from 'lucide-react'
import type { PlaceRow } from '@/lib/database.types'
import {
  CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS, VERIFICATION_LABELS,
  PET_SIZE_LABELS, SOURCE_LABELS, buildPlaceTags, buildVerifTag,
} from '@/lib/places'

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [place, setPlace] = useState<PlaceRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/places/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setPlace)
      .catch(() => setPlace(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFAF4]">
      <Loader2 size={28} className="animate-spin text-[#E0813D]" />
    </div>
  )

  if (!place) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFAF4]">
      <div className="text-5xl">🐾</div>
      <p className="text-[#7C5A42] text-[16px]">找不到该商家</p>
      <Link href="/places" className="text-[14px] text-[#E0813D] hover:underline">← 返回列表</Link>
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
      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>
          <button
            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length) }}
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={images[lightboxIndex]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length) }}
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-5 text-white/60 text-[13px]">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FDFAF4]">
        {/* ── Top nav ── */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
          <div className="max-w-screen-xl mx-auto px-8 h-[60px] flex items-center gap-4">
            <Link href="/places" className="flex items-center gap-2 text-[14px] text-[#7C5A42] hover:text-[#1E1209] transition-colors font-medium">
              <ArrowLeft size={16} />
              返回列表
            </Link>
            <span className="text-[#E8DCCB]">/</span>
            <span className="text-[14px] text-[#A09080] truncate max-w-xs">{place.name}</span>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-[#1E1209]">
                <span>🌱</span>豆苗宠物友好
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-screen-xl mx-auto px-8 py-8">
          {/* ── Image gallery ── */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden mb-8">
            {/* Main large image */}
            <div
              className="col-span-2 row-span-2 cursor-pointer relative group overflow-hidden"
              onClick={() => setLightboxIndex(0)}
            >
              <img
                src={images[0]}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            {/* Thumbnails — up to 4 */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`relative overflow-hidden cursor-pointer group ${images[i] ? '' : 'bg-[#F5EBD8]'}`}
                onClick={() => images[i] && setLightboxIndex(i)}
              >
                {images[i] ? (
                  <>
                    <img
                      src={images[i]}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    {/* "See all photos" overlay on last slot */}
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

          {/* ── Two-column body ── */}
          <div className="flex gap-10 items-start">

            {/* ── Left: main content ── */}
            <div className="flex-1 min-w-0 space-y-7">

              {/* Title block */}
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] bg-[#F5EBD8] text-[#7C5A42] px-2.5 py-0.5 rounded-full font-medium">
                        {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
                      </span>
                      <span className={`text-[12px] px-2.5 py-0.5 rounded-full border font-medium ${verifBadge[place.verification_status]}`}>
                        {VERIFICATION_LABELS[place.verification_status]?.label}
                      </span>
                    </div>
                    <h1 className="text-[28px] font-bold text-[#1E1209] leading-tight mb-2">{place.name}</h1>
                    <div className="flex items-center gap-1.5 text-[14px] text-[#A09080]">
                      <MapPin size={14} />
                      {CITY_LABELS[place.city]}{place.district ? ` · ${place.district}` : ''}
                      {place.address && <span className="text-[#D4C0A8]">· {place.address}</span>}
                    </div>
                  </div>
                  {score != null && (
                    <div className="shrink-0 flex items-center gap-1.5 bg-white rounded-2xl px-4 py-3 border border-[#EDE8E0] shadow-sm">
                      <Star size={18} className="fill-[#F0BE56] text-[#F0BE56]" />
                      <span className="text-[24px] font-bold text-[#1E1209]">{score.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Pet tags */}
                {petTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {petTags.map((t) => (
                      <span key={t.key} className={`text-[12px] px-3 py-1 rounded-full font-medium ${t.style}`}>
                        {t.label}
                      </span>
                    ))}
                    {verifTag && (
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${verifTag.style}`}>
                        {verifTag.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {place.description && (
                <Section title="商家介绍">
                  <p className="text-[15px] text-[#5C3D20] leading-relaxed">{place.description}</p>
                </Section>
              )}

              {/* Pet rules grid */}
              <Section title="🐾 宠物入场规则">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {RULES.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[#F5EFE6]">
                      <span className="text-[14px] text-[#5C3D20]">{label}</span>
                      <span className={`flex items-center gap-1.5 text-[13px] font-medium ${value ? 'text-emerald-600' : 'text-rose-400'}`}>
                        {value ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                        {value ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>

                {place.pet_size_allowed && place.pet_size_allowed !== 'unknown' && (
                  <div className="mt-4 flex items-center gap-2 text-[14px] text-[#6B5744]">
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

              {/* Scores */}
              {SCORES.length > 0 && (
                <Section title="评分详情">
                  <div className="space-y-4">
                    {SCORES.map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-4">
                        <span className="text-[14px] text-[#6B5744] w-20 shrink-0">{label}</span>
                        <div className="flex-1 bg-[#F5EBD8] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E0813D] to-[#F5A462] rounded-full transition-all"
                            style={{ width: `${(value! / 5) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < Math.round(value!) ? 'fill-[#F0BE56] text-[#F0BE56]' : 'text-[#E8DCCB] fill-[#E8DCCB]'} />
                          ))}
                          <span className="text-[13px] font-semibold text-[#1E1209] ml-1.5">{value!.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Map */}
              {place.latitude && place.longitude && (
                <Section title="位置">
                  <div className="rounded-2xl overflow-hidden border border-[#EDE8E0] relative">
                    <iframe
                      title="location"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.006}%2C${place.latitude - 0.004}%2C${place.longitude + 0.006}%2C${place.latitude + 0.004}&layer=mapnik&marker=${place.latitude}%2C${place.longitude}`}
                      className="w-full h-56 border-0"
                      loading="lazy"
                    />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[#7C5A42] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-md border border-[#EDE8E0] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <ExternalLink size={12} />
                      在 Google Maps 打开
                    </a>
                  </div>
                  {place.address && (
                    <p className="mt-2.5 flex items-start gap-2 text-[13px] text-[#A09080]">
                      <MapPin size={13} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                      {place.address}
                    </p>
                  )}
                </Section>
              )}

              {/* No lat/lng — just address */}
              {(!place.latitude || !place.longitude) && place.address && (
                <div className="flex items-start gap-2 text-[14px] text-[#7C5A42]">
                  <MapPin size={15} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                  <div>
                    <p>{place.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#E0813D] hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink size={11} />在地图中查看
                    </a>
                  </div>
                </div>
              )}

              {/* Verification note */}
              {(place.last_verified_at || place.verification_notes) && (
                <div className="flex items-start gap-3 bg-[#FAF7F2] rounded-2xl p-4 border border-[#EDE8E0]">
                  <Clock size={15} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                  <div className="space-y-1">
                    {place.last_verified_at && (
                      <p className="text-[13px] text-[#7C5A42]">
                        最后验证：{new Date(place.last_verified_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {place.source && <span className="text-[#A09080] ml-2">（{SOURCE_LABELS[place.source]}）</span>}
                      </p>
                    )}
                    {place.verification_notes && (
                      <p className="text-[12px] text-[#A09080]">{place.verification_notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: sticky contact sidebar ── */}
            <div className="w-[320px] shrink-0">
              <div className="sticky top-24 space-y-4">

                {/* Contact card */}
                <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_4px_20px_rgba(60,30,10,0.08)] p-6">
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F5EFE6]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5EBD8] shrink-0">
                      {(place.images ?? [])[0] ? (
                        <img src={place.images![0]} alt="" className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[14px] text-[#1E1209] truncate">{place.name}</p>
                      <p className="text-[12px] text-[#A09080]">{CITY_LABELS[place.city]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {place.wechat && (
                      <button className="w-full flex items-center justify-center gap-2 bg-[#E0813D] hover:bg-[#CC7030] text-white py-3 rounded-xl text-[14px] font-medium transition-colors shadow-sm">
                        <MessageCircle size={16} />微信咨询
                      </button>
                    )}
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F5EBD8] text-[#1E1209] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#EDE8E0]"
                      >
                        <Phone size={16} />
                        {phone}
                      </a>
                    )}
                    {place.booking_url && (
                      <a
                        href={place.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#7C5A42] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#EDE8E0]"
                      >
                        <ExternalLink size={14} />在线预约
                      </a>
                    )}
                    {place.xiaohongshu_url && (
                      <a
                        href={place.xiaohongshu_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#E0813D] py-3 rounded-xl text-[14px] font-medium transition-colors border border-[#F5C49A]"
                      >
                        📕 小红书主页
                      </a>
                    )}
                  </div>
                </div>

                {/* Hours */}
                {place.business_hours && (
                  <div className="bg-white rounded-2xl border border-[#EDE8E0] p-4 shadow-sm">
                    <p className="text-[12px] font-semibold text-[#A09080] uppercase tracking-wider mb-2">营业时间</p>
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="shrink-0 mt-0.5 text-[#C4A07E]" />
                      <p className="text-[13px] text-[#6B5744] leading-relaxed">{place.business_hours}</p>
                    </div>
                  </div>
                )}

                {/* Quick facts */}
                {(petTags.length > 0 || verifTag) && (
                  <div className="bg-white rounded-2xl border border-[#EDE8E0] p-4 shadow-sm">
                    <p className="text-[12px] font-semibold text-[#A09080] uppercase tracking-wider mb-3">宠物友好亮点</p>
                    <div className="flex flex-wrap gap-1.5">
                      {petTags.map((t) => (
                        <span key={t.key} className={`text-[11px] px-2 py-1 rounded-full font-medium ${t.style}`}>
                          {t.label}
                        </span>
                      ))}
                      {verifTag && (
                        <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${verifTag.style}`}>
                          {verifTag.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* No lat/lng map link */}
                {(!place.latitude || !place.longitude) && place.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.address ?? ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#7C5A42] py-3 rounded-xl text-[13px] font-medium border border-[#EDE8E0] hover:bg-[#FAF7F2] transition-colors shadow-sm"
                  >
                    <MapPin size={14} />查看位置
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[17px] font-bold text-[#1E1209] mb-4 pb-3 border-b border-[#EDE8E0]">{title}</h2>
      {children}
    </div>
  )
}
