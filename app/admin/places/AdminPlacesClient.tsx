'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Star, Search, X, Home, Trees, Dog, Droplets, Clock } from 'lucide-react'
import type { PlaceRow, CitySlug, PlaceCategory, VerificationStatus } from '@/lib/database.types'
import { CITY_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS, VERIFICATION_LABELS } from '@/lib/places'

const CITIES: { value: CitySlug | 'all'; label: string }[] = [
  { value: 'all', label: '全部城市' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hongkong', label: '香港' },
]

const CATEGORIES: { value: PlaceCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'cafe', label: '咖啡店' },
  { value: 'restaurant', label: '餐厅' },
  { value: 'hotel', label: '酒店' },
  { value: 'park', label: '公园' },
  { value: 'boarding', label: '寄养' },
  { value: 'grooming', label: '美容' },
  { value: 'transport', label: '运输' },
]

const VERIF_FILTERS: { value: VerificationStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'partner_verified', label: '合作认证' },
  { value: 'doumiao_verified', label: '豆苗认证' },
  { value: 'visited_verified', label: '已实地验证' },
  { value: 'visited', label: '已探访' },
  { value: 'phone_verified', label: '电话确认' },
  { value: 'unverified', label: '未验证' },
]

const VERIF_STYLES: Record<string, string> = {
  partner_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  doumiao_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  visited_verified: 'bg-blue-50 text-blue-700 border-blue-200',
  visited:          'bg-blue-50 text-blue-700 border-blue-200',
  phone_verified:   'bg-orange-50 text-orange-700 border-orange-200',
  unverified:       'bg-gray-50 text-gray-400 border-gray-200',
}

interface Props { initialPlaces: PlaceRow[] }

export default function AdminPlacesClient({ initialPlaces }: Props) {
  const [places, setPlaces] = useState<PlaceRow[]>(initialPlaces)
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<CitySlug | 'all'>('all')
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all')
  const [verifFilter, setVerifFilter] = useState<VerificationStatus | 'all'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (city !== 'all' && p.city !== city) return false
      if (category !== 'all' && p.category !== category) return false
      if (verifFilter !== 'all' && p.verification_status !== verifFilter) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        return p.name.toLowerCase().includes(q) || (p.district ?? '').toLowerCase().includes(q)
      }
      return true
    })
  }, [places, query, city, category, verifFilter])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`确认删除「${name}」？此操作无法撤销。`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/places/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setPlaces((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('删除失败，请重试')
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(s: string | null) {
    if (!s) return null
    return new Date(s).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: '2-digit' })
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_1px_4px_rgba(60,30,10,0.06)] p-5 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative" style={{ width: 360 }}>
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4A07E]" />
            <input
              type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索商家名称或区域..."
              className="w-full pl-10 pr-9 py-2.5 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] bg-[#FDFAF4]"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A07E] hover:text-[#7C5A42]">
                <X size={13} />
              </button>
            )}
          </div>

          <select value={city} onChange={(e) => setCity(e.target.value as CitySlug | 'all')}
            className="px-4 py-2.5 border border-[#E8DCCB] rounded-xl text-[14px] bg-[#FDFAF4] text-[#1E1209] focus:outline-none focus:border-[#D99478]">
            {CITIES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value as PlaceCategory | 'all')}
            className="px-4 py-2.5 border border-[#E8DCCB] rounded-xl text-[14px] bg-[#FDFAF4] text-[#1E1209] focus:outline-none focus:border-[#D99478]">
            {CATEGORIES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={verifFilter} onChange={(e) => setVerifFilter(e.target.value as VerificationStatus | 'all')}
            className="px-4 py-2.5 border border-[#E8DCCB] rounded-xl text-[14px] bg-[#FDFAF4] text-[#1E1209] focus:outline-none focus:border-[#D99478]">
            {VERIF_FILTERS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>

          <span className="ml-auto text-[13px] text-[#A09080]">{filtered.length} / {places.length} 条</span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EDE8E0] py-20 text-center shadow-[0_1px_4px_rgba(60,30,10,0.06)]">
          <div className="text-5xl mb-4">🐾</div>
          <div className="text-[15px] text-[#A09080]">暂无匹配记录</div>
          <button
            onClick={() => { setQuery(''); setCity('all'); setCategory('all'); setVerifFilter('all') }}
            className="mt-4 text-[13px] text-[#C07A4E] hover:underline"
          >清除筛选</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_1px_4px_rgba(60,30,10,0.06)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EAE0] bg-[#FDFAF4]">
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-6 py-3.5">商家</th>
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">城市</th>
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">类型</th>
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">认证</th>
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">标签</th>
                <th className="text-left text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">最后验证</th>
                <th className="text-center text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-4 py-3.5">⭐</th>
                <th className="text-right text-[11px] font-semibold text-[#A09080] uppercase tracking-wider px-6 py-3.5">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {filtered.map((place) => {
                const cover = (place.images ?? [])[0]
                return (
                  <tr key={place.id} className="hover:bg-[#FAF7F2] transition-colors" style={{ height: 58 }}>

                    {/* Name + thumbnail */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#F5EBD8] shrink-0">
                          {cover
                            ? <img src={cover} alt={place.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-base">🐾</div>
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-[14px] text-[#1E1209] truncate max-w-[160px]">{place.name}</div>
                          <div className="text-[11px] text-[#B09880] truncate">{place.district ?? '—'}</div>
                        </div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-4 py-3 text-[13px] text-[#6B5744]">{CITY_LABELS[place.city]}</td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#6B5744]">
                        {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
                      </span>
                    </td>

                    {/* Verification */}
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${VERIF_STYLES[place.verification_status] ?? VERIF_STYLES.unverified}`}>
                        {VERIFICATION_LABELS[place.verification_status]?.label ?? place.verification_status}
                      </span>
                    </td>

                    {/* Pet tags — icon-based for compactness */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <TagDot title="可进室内" active={place.indoor_allowed} icon="🏠" />
                        <TagDot title="有户外位" active={place.outdoor_seating || place.outdoor_allowed} icon="🌿" />
                        <TagDot title="大型犬友好" active={place.large_dog_allowed} icon="🐕" />
                        <TagDot title="提供饮水" active={place.water_provided || place.water_available} icon="💧" />
                      </div>
                    </td>

                    {/* Last verified */}
                    <td className="px-4 py-3">
                      {place.last_verified_at ? (
                        <span className="text-[12px] text-[#6B5744] flex items-center gap-1">
                          <Clock size={11} className="text-[#C4A07E]" />
                          {formatDate(place.last_verified_at)}
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#D4C8BC]">—</span>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3 text-center">
                      <Star size={14} className={place.is_featured ? 'fill-amber-400 text-amber-400 mx-auto' : 'text-[#E8DCCB] mx-auto'} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/places/${place.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5EBD8] text-[#7C5A42] hover:bg-[#EDD8B8] transition-colors text-[12px] font-medium"
                        >
                          <Edit2 size={11} />编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(place.id, place.name)}
                          disabled={deletingId === place.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors text-[12px] font-medium disabled:opacity-40"
                        >
                          <Trash2 size={11} />
                          {deletingId === place.id ? '删除中' : '删除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TagDot({ title, active, icon }: { title: string; active: boolean; icon: string }) {
  return (
    <span
      title={title}
      className={`text-[13px] w-6 h-6 flex items-center justify-center rounded-md transition-all ${
        active ? 'opacity-100' : 'opacity-20 grayscale'
      }`}
    >
      {icon}
    </span>
  )
}
