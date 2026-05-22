'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminNav from '@/components/AdminNav'
import { Users, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import type { CommunityLead } from '@/lib/database.types'

const CITY_FILTER = [
  { value: 'all',       label: '全部城市' },
  { value: '广州',      label: '广州' },
  { value: '深圳',      label: '深圳' },
  { value: '香港',      label: '香港' },
]

const INTENT_FILTER = [
  { value: 'all',        label: '全部意向' },
  { value: 'contribute', label: '愿意投稿' },
  { value: 'explore',    label: '愿意探店' },
  { value: 'updates',    label: '只看更新' },
]

const STATUS_FILTER = [
  { value: 'all',       label: '全部', icon: Users },
  { value: 'pending',   label: '未联系', icon: Clock },
  { value: 'contacted', label: '已联系', icon: CheckCircle2 },
]

const PET_LABELS: Record<string, string> = { dog: '狗狗 🐶', cat: '猫咪 🐱', other: '其他 🐾' }
const INTENT_LABELS: Record<string, string> = { contribute: '投稿', explore: '探店', updates: '更新' }
const SOURCE_LABELS: Record<string, string> = {
  homepage:        '首页',
  place_detail:    '商家详情',
  submit_success:  '投稿成功',
  observations:    '观察模块',
}

export default function CommunityLeadsPage() {
  const [leads,   setLeads]   = useState<CommunityLead[]>([])
  const [loading, setLoading] = useState(true)
  const [city,    setCity]    = useState('all')
  const [intent,  setIntent]  = useState('all')
  const [status,  setStatus]  = useState('all')
  const [toggling, setToggling] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (city   !== 'all') params.set('city', city)
    if (intent !== 'all') params.set('intent', intent)
    if (status !== 'all') params.set('status', status)
    fetch(`/api/admin/community-leads?${params}`)
      .then((r) => r.json())
      .then((d) => setLeads(Array.isArray(d) ? d : []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false))
  }, [city, intent, status])

  useEffect(() => { load() }, [load])

  async function toggleContacted(lead: CommunityLead) {
    setToggling(lead.id)
    await fetch(`/api/admin/community-leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacted: !lead.contacted }),
    })
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, contacted: !l.contacted } : l))
    setToggling(null)
  }

  const pendingCount = leads.filter((l) => !l.contacted).length

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminNav />
      <main className="flex-1 p-8 min-w-0">
        <div className="max-w-4xl">
          <div className="flex items-end justify-between mb-1">
            <h1 className="text-[22px] font-bold text-[#1E1209]">社群线索</h1>
            {pendingCount > 0 && (
              <span className="text-[12px] font-semibold text-[#C07A4E] bg-[#FAF0E8] px-3 py-1 rounded-full border border-[#E8C4A8]">
                {pendingCount} 条未联系
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#A09080] mb-6">用户留下的联系方式，联系后标记为已联系</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Status tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#EDE8E0]">
              {STATUS_FILTER.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setStatus(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    status === value ? 'bg-[#1E1209] text-white' : 'text-[#6B5744] hover:bg-[#FAF5EE]'
                  }`}>
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* City filter */}
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 bg-white border border-[#EDE8E0] rounded-xl text-[13px] text-[#5C3D20] focus:outline-none focus:border-[#C07A4E]">
              {CITY_FILTER.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Intent filter */}
            <select value={intent} onChange={(e) => setIntent(e.target.value)}
              className="px-3 py-2 bg-white border border-[#EDE8E0] rounded-xl text-[13px] text-[#5C3D20] focus:outline-none focus:border-[#C07A4E]">
              {INTENT_FILTER.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* List */}
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 size={22} className="animate-spin text-[#C07A4E]" />
            </div>
          ) : leads.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-3xl mb-3">🐾</div>
              <p className="text-[#A09080] text-[14px]">暂无线索</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <div key={lead.id}
                  className={`flex items-center gap-4 bg-white rounded-2xl border px-5 py-4 transition-all ${
                    lead.contacted ? 'border-[#EDE8E0] opacity-60' : 'border-[#EDE8E0] shadow-sm'
                  }`}>
                  {/* Contact */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-[#1E1209] truncate">{lead.contact}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {lead.city && (
                        <span className="text-[11px] text-[#A09080] bg-[#FAF7F2] px-2 py-0.5 rounded-full">{lead.city}</span>
                      )}
                      {lead.pet_type && (
                        <span className="text-[11px] text-[#A09080]">{PET_LABELS[lead.pet_type] ?? lead.pet_type}</span>
                      )}
                      {lead.intent && lead.intent.length > 0 && (
                        <div className="flex gap-1">
                          {lead.intent.map((i) => (
                            <span key={i} className="text-[11px] bg-[#FAF0E8] text-[#C07A4E] px-2 py-0.5 rounded-full">
                              {INTENT_LABELS[i] ?? i}
                            </span>
                          ))}
                        </div>
                      )}
                      {lead.source_page && (
                        <span className="text-[11px] text-[#C4A07E]">
                          来自：{SOURCE_LABELS[lead.source_page] ?? lead.source_page}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="shrink-0 text-[12px] text-[#B09880] hidden sm:block">
                    {new Date(lead.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>

                  {/* Toggle contacted */}
                  <button
                    onClick={() => toggleContacted(lead)}
                    disabled={toggling === lead.id}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-medium border transition-all ${
                      lead.contacted
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-white text-[#7C5A42] border-[#EDE8E0] hover:border-[#D4C5B0] hover:bg-[#FAF7F2]'
                    }`}>
                    {toggling === lead.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : lead.contacted
                        ? <><CheckCircle2 size={12} />已联系</>
                        : '标记已联系'
                    }
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && leads.length > 0 && (
            <p className="mt-4 text-[12px] text-[#C4A07E] text-right">共 {leads.length} 条</p>
          )}
        </div>
      </main>
    </div>
  )
}
