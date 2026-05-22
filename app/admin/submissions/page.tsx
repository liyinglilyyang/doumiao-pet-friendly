'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import { Inbox, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import type { PlaceSubmission } from '@/lib/database.types'

const TABS = [
  { value: 'pending',  label: '待审核', icon: Clock },
  { value: 'approved', label: '已通过', icon: CheckCircle2 },
  { value: 'rejected', label: '已拒绝', icon: XCircle },
  { value: 'all',      label: '全部',   icon: Inbox },
]

const CATEGORY_LABELS: Record<string, string> = {
  cafe: '咖啡店', restaurant: '餐厅', hotel: '酒店', park: '公园',
  boarding: '宠物寄养', grooming: '美容洗护', transport: '宠物运输', other: '其他',
}

const CITY_LABELS: Record<string, string> = {
  guangzhou: '广州', shenzhen: '深圳', hongkong: '香港',
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
}
const STATUS_LABELS: Record<string, string> = {
  pending: '待审核', approved: '已通过', rejected: '已拒绝',
}

export default function AdminSubmissionsPage() {
  const [tab, setTab] = useState<string>('pending')
  const [subs, setSubs] = useState<PlaceSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/admin/submissions?status=${tab}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setSubs(Array.isArray(d) ? d : []) })
      .catch(() => { if (!cancelled) setSubs([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tab])

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminNav />
      <main className="flex-1 p-8 min-w-0">
        <div className="max-w-4xl">
          <h1 className="text-[22px] font-bold text-[#1E1209] mb-1">投稿审核</h1>
          <p className="text-[13px] text-[#A09080] mb-6">用户提交的待收录地点，审核后写入商家数据库</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-[#EDE8E0] w-fit">
            {TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  tab === value
                    ? 'bg-[#1E1209] text-white'
                    : 'text-[#6B5744] hover:bg-[#FAF5EE]'
                }`}
              >
                <Icon size={13} strokeWidth={tab === value ? 2.2 : 1.8} />
                {label}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="py-16 text-center text-[#A09080] text-[14px]">加载中…</div>
          ) : subs.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox size={32} className="text-[#C0B0A0] mx-auto mb-3" />
              <p className="text-[14px] text-[#A09080]">暂无投稿</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden">
              {subs.map((sub, i) => (
                <Link
                  key={sub.id}
                  href={`/admin/submissions/${sub.id}`}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-[#FAF5EE] transition-colors ${
                    i > 0 ? 'border-t border-[#F0EAE0]' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[14px] text-[#1E1209] truncate">{sub.name}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[sub.status]}`}>
                        {STATUS_LABELS[sub.status]}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#A09080] flex items-center gap-2 flex-wrap">
                      <span>{CITY_LABELS[sub.city] ?? sub.city}</span>
                      {sub.district && <span>· {sub.district}</span>}
                      <span>· {CATEGORY_LABELS[sub.category] ?? sub.category}</span>
                      <span>· {new Date(sub.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#C0B0A0] shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
