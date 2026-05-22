'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, X, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react'
import type { SubmissionCategory, SubmitterType } from '@/lib/database.types'

const CATEGORIES: { value: SubmissionCategory; label: string }[] = [
  { value: 'cafe',       label: '咖啡店' },
  { value: 'restaurant', label: '餐厅' },
  { value: 'hotel',      label: '酒店' },
  { value: 'park',       label: '公园' },
  { value: 'boarding',   label: '宠物寄养' },
  { value: 'grooming',   label: '美容洗护' },
  { value: 'transport',  label: '宠物运输' },
  { value: 'other',      label: '其他' },
]

const CITIES = [
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen',  label: '深圳' },
  { value: 'hongkong',  label: '香港' },
]

const SUBMITTER_TYPES: { value: SubmitterType; label: string }[] = [
  { value: 'pet_owner', label: '宠物主人' },
  { value: 'business',  label: '商家' },
  { value: 'staff',     label: '员工' },
  { value: 'passerby',  label: '路人' },
]

type FormState = {
  name: string
  city: string
  district: string
  address: string
  category: SubmissionCategory | ''
  submitter_type: SubmitterType | ''
  pet_rules_description: string
  indoor_allowed: boolean
  outdoor_seating: boolean
  small_dog_allowed: boolean
  medium_dog_allowed: boolean
  large_dog_allowed: boolean
  water_provided: boolean
  contact_phone: string
  contact_wechat: string
  xiaohongshu_url: string
  submitter_contact: string
}

const INITIAL: FormState = {
  name: '', city: 'guangzhou', district: '', address: '',
  category: '', submitter_type: '',
  pet_rules_description: '',
  indoor_allowed: false, outdoor_seating: false,
  small_dog_allowed: false, medium_dog_allowed: false, large_dog_allowed: false,
  water_provided: false,
  contact_phone: '', contact_wechat: '', xiaohongshu_url: '', submitter_contact: '',
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#4A3728] mb-1.5">
        {label}{required && <span className="text-[#E0813D] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5.5 rounded-full relative transition-colors ${checked ? 'bg-[#E0813D]' : 'bg-[#DDD5C8]'}`}
        style={{ width: 40, height: 22 }}
      >
        <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
      </div>
      <span className="text-[13px] text-[#4A3728]">{label}</span>
    </label>
  )
}

export default function SubmitPlacePage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (images.length + files.length > 3) {
      setError('最多上传 3 张图片')
      return
    }
    setUploading(true)
    setError('')
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/submissions/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? '上传失败'); break }
      setImages((prev) => [...prev, json.url])
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.city || !form.category) {
      setError('请填写店名、城市和商家类型')
      return
    }
    setSubmitting(true)
    setError('')
    const payload: Record<string, unknown> = { images }
    for (const [k, v] of Object.entries(form)) {
      if (v !== '' && v !== false) payload[k] = v
      else if (typeof v === 'boolean') payload[k] = v
    }
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    setSubmitting(false)
    if (!res.ok) { setError(json.error ?? '提交失败，请稍后重试'); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-6 pb-20 md:pb-0">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF0E2] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-[#E0813D]" />
          </div>
          <h1 className="text-xl font-bold text-[#1E1209] mb-3">投稿已收到</h1>
          <p className="text-[#6B5744] text-[15px] leading-relaxed mb-8">
            提交成功，豆苗团队会核实宠物规则后收录。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/places" className="px-6 py-2.5 bg-[#1E1209] text-white rounded-xl text-[14px] font-medium text-center">
              浏览地点
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm(INITIAL); setImages([]) }}
              className="px-6 py-2.5 border border-[#DDD5C8] text-[#4A3728] rounded-xl text-[14px] font-medium"
            >
              再投一条
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-24 md:pb-10">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-[56px] md:h-[64px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[#A09080] hover:text-[#1E1209] transition-colors md:hidden">
            <ArrowLeft size={18} />
          </Link>
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </div>
          <div className="font-semibold text-[#1E1209] text-[15px] md:ml-4">投稿地点</div>
          <div className="ml-auto hidden md:flex items-center gap-5">
            <Link href="/places" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">探索地点</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] transition-colors font-medium">
              商家入驻
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <div className="md:grid md:grid-cols-[340px_1fr] md:gap-12 lg:gap-20">

          {/* Left info panel (desktop) */}
          <div className="hidden md:block">
            <div className="sticky top-[80px]">
              <div className="text-2xl font-bold text-[#1E1209] mb-3 leading-snug">
                帮助更多铲屎官<br />找到宠物友好场所
              </div>
              <p className="text-[14px] text-[#7C5A42] leading-relaxed mb-6">
                您的投稿将由豆苗团队人工核实宠物政策后收录，帮助更多铲屎官找到真正欢迎毛孩子的好地方。
              </p>
              <div className="space-y-3">
                {[
                  ['🔍', '人工核实', '团队会致电或前往实地确认宠物政策'],
                  ['📍', '精准收录', '确认后展示在地图和列表中'],
                  ['🐾', '惠及同类', '每条投稿都帮助了千千万万的宠物家庭'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3 p-3.5 rounded-xl bg-[#FFF8F0]">
                    <span className="text-xl shrink-0">{icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1E1209]">{title}</div>
                      <div className="text-[12px] text-[#A07855] mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Basic info */}
              <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0] space-y-4">
                <h2 className="text-[14px] font-bold text-[#1E1209]">基本信息</h2>

                <Field label="店铺名称" required>
                  <input
                    type="text"
                    placeholder="例：星巴克太古汇店"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="城市" required>
                    <select
                      value={form.city}
                      onChange={(e) => set('city', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] bg-white focus:outline-none focus:border-[#E0813D]"
                    >
                      {CITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="区域">
                    <input
                      type="text"
                      placeholder="例：天河区"
                      value={form.district}
                      onChange={(e) => set('district', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors"
                    />
                  </Field>
                </div>

                <Field label="地址">
                  <input
                    type="text"
                    placeholder="例：天河路 383 号太古汇 B1"
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors"
                  />
                </Field>

                <Field label="商家类型" required>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => set('category', c.value)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                          form.category === c.value
                            ? 'bg-[#E0813D] text-white border-[#E0813D]'
                            : 'bg-white text-[#6B5744] border-[#DDD5C8] hover:border-[#E0813D]'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="您的身份">
                  <div className="flex flex-wrap gap-2">
                    {SUBMITTER_TYPES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => set('submitter_type', s.value)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                          form.submitter_type === s.value
                            ? 'bg-[#1E1209] text-white border-[#1E1209]'
                            : 'bg-white text-[#6B5744] border-[#DDD5C8] hover:border-[#1E1209]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Pet policies */}
              <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0] space-y-4">
                <h2 className="text-[14px] font-bold text-[#1E1209]">宠物政策</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Toggle checked={form.indoor_allowed}    onChange={(v) => set('indoor_allowed', v)}    label="允许进入室内" />
                  <Toggle checked={form.outdoor_seating}   onChange={(v) => set('outdoor_seating', v)}   label="有室外座位区" />
                  <Toggle checked={form.small_dog_allowed}  onChange={(v) => set('small_dog_allowed', v)}  label="允许小型犬" />
                  <Toggle checked={form.medium_dog_allowed} onChange={(v) => set('medium_dog_allowed', v)} label="允许中型犬" />
                  <Toggle checked={form.large_dog_allowed}  onChange={(v) => set('large_dog_allowed', v)}  label="允许大型犬" />
                  <Toggle checked={form.water_provided}    onChange={(v) => set('water_provided', v)}    label="提供宠物饮水" />
                </div>

                <Field label="宠物规则说明">
                  <textarea
                    rows={3}
                    placeholder="例：仅允许抱抱入店，大型犬需拴绳在门口……"
                    value={form.pet_rules_description}
                    onChange={(e) => set('pet_rules_description', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors resize-none"
                  />
                </Field>
              </div>

              {/* Images */}
              <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0] space-y-3">
                <h2 className="text-[14px] font-bold text-[#1E1209]">图片（选填，最多 3 张）</h2>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((url, i) => (
                    <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EDE8E0]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
                      >
                        <X size={11} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-[#DDD5C8] flex flex-col items-center justify-center gap-1 text-[#B09880] hover:border-[#E0813D] hover:text-[#E0813D] transition-colors"
                    >
                      {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      <span className="text-[11px]">上传</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Optional contact */}
              <div className="bg-white rounded-2xl p-5 border border-[#EDE8E0] space-y-4">
                <h2 className="text-[14px] font-bold text-[#1E1209]">联系方式（选填）</h2>
                <p className="text-[12px] text-[#A09080] -mt-2">以下信息将展示在地点页面，方便用户联系商家</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="商家电话">
                    <input type="tel" placeholder="020-12345678" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors" />
                  </Field>
                  <Field label="商家微信">
                    <input type="text" placeholder="微信号" value={form.contact_wechat} onChange={(e) => set('contact_wechat', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors" />
                  </Field>
                </div>
                <Field label="小红书主页链接">
                  <input type="url" placeholder="https://www.xiaohongshu.com/..." value={form.xiaohongshu_url} onChange={(e) => set('xiaohongshu_url', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors" />
                </Field>
                <Field label="您的联系方式">
                  <input type="text" placeholder="方便我们核实时联系您（微信/手机号）" value={form.submitter_contact} onChange={(e) => set('submitter_contact', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C8] text-[14px] text-[#1E1209] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#E0813D] transition-colors" />
                </Field>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#E0813D] text-white font-semibold rounded-xl text-[15px] hover:bg-[#C8702F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={17} className="animate-spin" />}
                {submitting ? '提交中…' : '提交投稿'}
              </button>

              <p className="text-[12px] text-[#A09080] text-center">
                提交即表示您同意豆苗将此信息用于地点收录，核实后会在平台展示。
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
