'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import {
  ArrowLeft, CheckCircle2, XCircle, Loader2,
  Phone, MessageCircle, ExternalLink,
} from 'lucide-react'
import type { PlaceSubmission, SubmissionCategory } from '@/lib/database.types'

const CATEGORY_OPTIONS: { value: SubmissionCategory; label: string }[] = [
  { value: 'cafe',       label: '咖啡店' },
  { value: 'restaurant', label: '餐厅' },
  { value: 'hotel',      label: '酒店' },
  { value: 'park',       label: '公园' },
  { value: 'boarding',   label: '宠物寄养' },
  { value: 'grooming',   label: '美容洗护' },
  { value: 'transport',  label: '宠物运输' },
  { value: 'other',      label: '其他' },
]

const CITY_LABELS: Record<string, string> = {
  guangzhou: '广州', shenzhen: '深圳', hongkong: '香港',
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== false) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-[#F0EAE0] last:border-0">
      <span className="text-[12px] text-[#A09080] w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-[13px] text-[#1E1209] flex-1">{value}</span>
    </div>
  )
}

function Bool({ v }: { v: boolean | null }) {
  if (v === null) return <span className="text-[#C0B0A0]">未知</span>
  return v ? <span className="text-emerald-600">✓ 是</span> : <span className="text-[#C0B0A0]">✗ 否</span>
}

export default function AdminSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [sub, setSub] = useState<PlaceSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [error, setError] = useState('')

  // Editable fields for approve-with-edit
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editDistrict, setEditDistrict] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCategory, setEditCategory] = useState<SubmissionCategory | ''>('')

  useEffect(() => {
    fetch(`/api/admin/submissions/${id}`)
      .then((r) => r.json())
      .then((d: PlaceSubmission) => {
        setSub(d)
        setEditName(d.name)
        setEditCity(d.city)
        setEditDistrict(d.district ?? '')
        setEditAddress(d.address ?? '')
        setEditCategory(d.category)
      })
      .catch(() => setError('无法加载投稿'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAction(action: 'approve' | 'reject') {
    if (!sub) return
    if (action === 'approve' && editCategory === 'other') {
      setError('请先将商家类型改为具体类别（不能保留「其他」）')
      return
    }
    setActing(true)
    setError('')
    const edits = {
      name: editName || undefined,
      city: editCity || undefined,
      district: editDistrict || undefined,
      address: editAddress || undefined,
      category: editCategory || undefined,
    }
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, admin_notes: adminNotes || undefined, edits }),
    })
    const json = await res.json()
    setActing(false)
    if (!res.ok) { setError(json.error ?? '操作失败'); return }
    if (action === 'approve' && json.place_id) {
      router.push(`/admin/places/${json.place_id}/edit`)
    } else {
      router.push('/admin/submissions')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FAF7F2]">
        <AdminNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#C07A4E]" />
        </main>
      </div>
    )
  }

  if (!sub || error) {
    return (
      <div className="flex min-h-screen bg-[#FAF7F2]">
        <AdminNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#6B5744] mb-4">{error || '未找到投稿'}</p>
            <Link href="/admin/submissions" className="text-[#C07A4E] text-[14px]">← 返回列表</Link>
          </div>
        </main>
      </div>
    )
  }

  const isPending = sub.status === 'pending'

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminNav />
      <main className="flex-1 p-8 min-w-0">
        <div className="max-w-3xl">
          {/* Back + title */}
          <Link href="/admin/submissions" className="inline-flex items-center gap-1.5 text-[13px] text-[#A09080] hover:text-[#1E1209] mb-5 transition-colors">
            <ArrowLeft size={14} />
            投稿列表
          </Link>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[20px] font-bold text-[#1E1209]">{sub.name}</h1>
              <p className="text-[13px] text-[#A09080] mt-1">
                {CITY_LABELS[sub.city] ?? sub.city}
                {sub.district && ` · ${sub.district}`}
                {' · '}投稿时间：{new Date(sub.created_at).toLocaleString('zh-CN')}
              </p>
            </div>
            {sub.status !== 'pending' && (
              <span className={`text-[12px] px-3 py-1.5 rounded-full font-medium ${
                sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {sub.status === 'approved' ? '✓ 已通过' : '✗ 已拒绝'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Submitted info */}
            <div className="bg-white rounded-2xl border border-[#EDE8E0] p-5">
              <h2 className="text-[13px] font-bold text-[#1E1209] mb-3">投稿内容</h2>
              <InfoRow label="商家类型" value={CATEGORY_OPTIONS.find(c => c.value === sub.category)?.label ?? sub.category} />
              <InfoRow label="地址" value={sub.address} />
              <InfoRow label="提交者身份" value={
                sub.submitter_type === 'pet_owner' ? '宠物主人' :
                sub.submitter_type === 'business'  ? '商家' :
                sub.submitter_type === 'staff'     ? '员工' :
                sub.submitter_type === 'passerby'  ? '路人' : null
              } />
              <InfoRow label="宠物规则" value={sub.pet_rules_description} />
              <InfoRow label="提交者联系" value={sub.submitter_contact} />
            </div>

            {/* Pet policies */}
            <div className="bg-white rounded-2xl border border-[#EDE8E0] p-5">
              <h2 className="text-[13px] font-bold text-[#1E1209] mb-3">宠物政策</h2>
              <InfoRow label="允许进入室内" value={<Bool v={sub.indoor_allowed} />} />
              <InfoRow label="有室外座位区" value={<Bool v={sub.outdoor_seating} />} />
              <InfoRow label="允许小型犬"   value={<Bool v={sub.small_dog_allowed} />} />
              <InfoRow label="允许中型犬"   value={<Bool v={sub.medium_dog_allowed} />} />
              <InfoRow label="允许大型犬"   value={<Bool v={sub.large_dog_allowed} />} />
              <InfoRow label="提供宠物饮水" value={<Bool v={sub.water_provided} />} />
            </div>

            {/* Contact info */}
            {(sub.contact_phone || sub.contact_wechat || sub.xiaohongshu_url) && (
              <div className="bg-white rounded-2xl border border-[#EDE8E0] p-5">
                <h2 className="text-[13px] font-bold text-[#1E1209] mb-3">联系方式</h2>
                {sub.contact_phone && (
                  <div className="flex items-center gap-2 py-2 border-b border-[#F0EAE0]">
                    <Phone size={13} className="text-[#A09080]" />
                    <span className="text-[13px] text-[#1E1209]">{sub.contact_phone}</span>
                  </div>
                )}
                {sub.contact_wechat && (
                  <div className="flex items-center gap-2 py-2 border-b border-[#F0EAE0]">
                    <MessageCircle size={13} className="text-[#A09080]" />
                    <span className="text-[13px] text-[#1E1209]">{sub.contact_wechat}</span>
                  </div>
                )}
                {sub.xiaohongshu_url && (
                  <div className="flex items-center gap-2 py-2">
                    <ExternalLink size={13} className="text-[#A09080]" />
                    <a href={sub.xiaohongshu_url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#C07A4E] hover:underline truncate">
                      小红书主页
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Images */}
            {sub.images?.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#EDE8E0] p-5">
                <h2 className="text-[13px] font-bold text-[#1E1209] mb-3">上传图片</h2>
                <div className="flex flex-wrap gap-2">
                  {sub.images.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-[#EDE8E0] hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit + approve panel */}
          {isPending && (
            <div className="mt-5 bg-white rounded-2xl border border-[#EDE8E0] p-5 space-y-4">
              <h2 className="text-[13px] font-bold text-[#1E1209]">审核操作</h2>
              <p className="text-[12px] text-[#A09080] -mt-2">通过前可修改以下字段，修改后的内容将写入 places 表</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-[#7C5A42] mb-1">店名</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C8] text-[13px] text-[#1E1209] focus:outline-none focus:border-[#C07A4E]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#7C5A42] mb-1">城市</label>
                  <select value={editCity} onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C8] text-[13px] text-[#1E1209] bg-white focus:outline-none focus:border-[#C07A4E]">
                    <option value="guangzhou">广州</option>
                    <option value="shenzhen">深圳</option>
                    <option value="hongkong">香港</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-[#7C5A42] mb-1">区域</label>
                  <input value={editDistrict} onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C8] text-[13px] text-[#1E1209] focus:outline-none focus:border-[#C07A4E]" />
                </div>
                <div>
                  <label className="block text-[12px] text-[#7C5A42] mb-1">地址</label>
                  <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C8] text-[13px] text-[#1E1209] focus:outline-none focus:border-[#C07A4E]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-[#7C5A42] mb-1.5">商家类型{editCategory === 'other' && <span className="text-amber-600 ml-1">（需修改，不能为「其他」）</span>}</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.filter(c => c.value !== 'other').map((c) => (
                    <button key={c.value} type="button" onClick={() => setEditCategory(c.value)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                        editCategory === c.value
                          ? 'bg-[#C07A4E] text-white border-[#C07A4E]'
                          : 'bg-white text-[#6B5744] border-[#DDD5C8] hover:border-[#C07A4E]'
                      }`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-[#7C5A42] mb-1">备注（可选）</label>
                <textarea rows={2} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="内部备注，不展示给用户"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD5C8] text-[13px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#C07A4E] resize-none" />
              </div>

              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>
              )}

              <div className="flex gap-3">
                <button onClick={() => handleAction('approve')} disabled={acting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-[14px] hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {acting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  通过并收录
                </button>
                <button onClick={() => handleAction('reject')} disabled={acting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-red-600 font-semibold rounded-xl text-[14px] border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50">
                  {acting ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                  拒绝
                </button>
              </div>
            </div>
          )}

          {/* Already reviewed info */}
          {!isPending && sub.admin_notes && (
            <div className="mt-5 bg-white rounded-2xl border border-[#EDE8E0] p-5">
              <h2 className="text-[13px] font-bold text-[#1E1209] mb-2">审核备注</h2>
              <p className="text-[13px] text-[#6B5744]">{sub.admin_notes}</p>
            </div>
          )}

          {!isPending && sub.place_id && (
            <div className="mt-3">
              <Link href={`/admin/places/${sub.place_id}/edit`} className="text-[13px] text-[#C07A4E] hover:underline">
                → 查看已收录的地点
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
