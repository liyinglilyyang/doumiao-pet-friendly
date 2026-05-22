'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, X, Star, ImagePlus } from 'lucide-react'
import type { PlaceRow } from '@/lib/database.types'
import { CITY_LABELS, CATEGORY_LABELS, PET_SIZE_LABELS, SOURCE_LABELS } from '@/lib/places'

type FormMode = 'create' | 'edit'

interface Props {
  mode: FormMode
  initialData?: Partial<PlaceRow>
  placeId?: string
}

const EMPTY: Partial<PlaceRow> = {
  name: '',
  city: 'guangzhou',
  district: '',
  address: '',
  category: 'cafe',
  description: '',
  pet_policy: '',
  rules_text: '',
  business_hours: '',
  // pet rules
  indoor_allowed: false,
  outdoor_allowed: true,
  outdoor_seating: false,
  large_dog_allowed: false,
  cat_allowed: true,
  water_available: false,
  water_provided: false,
  pet_menu: false,
  leash_required: true,
  carrier_required: false,
  pet_size_allowed: 'unknown',
  // verification
  verification_status: 'unverified',
  verification_notes: '',
  source: 'web',
  last_verified_at: null,
  // scores
  doumiao_score: null,
  pet_friendliness_score: null,
  environment_score: null,
  staff_score: null,
  staff_friendliness_score: null,
  freedom_score: null,
  large_dog_score: null,
  // contact
  images: [],
  phone: '',
  contact_phone: '',
  wechat: '',
  xiaohongshu_url: '',
  booking_url: '',
  latitude: null,
  longitude: null,
  is_featured: false,
}

const SCORE_FIELDS: { key: keyof PlaceRow; label: string }[] = [
  { key: 'doumiao_score', label: '豆苗推荐指数' },
  { key: 'pet_friendliness_score', label: '宠物友好度' },
  { key: 'staff_friendliness_score', label: '店员友好度' },
  { key: 'environment_score', label: '环境评分' },
  { key: 'freedom_score', label: '宠物自由度' },
  { key: 'large_dog_score', label: '大型犬友好度' },
]

const PET_BOOL_FIELDS: { key: keyof PlaceRow; label: string }[] = [
  { key: 'indoor_allowed', label: '可进室内' },
  { key: 'outdoor_seating', label: '有户外座位' },
  { key: 'large_dog_allowed', label: '接受大型犬' },
  { key: 'cat_allowed', label: '接受猫咪' },
  { key: 'water_provided', label: '提供饮水' },
  { key: 'pet_menu', label: '有宠物菜单' },
  { key: 'leash_required', label: '需要牵引绳' },
  { key: 'carrier_required', label: '需要航空箱' },
]

export default function PlaceForm({ mode, initialData, placeId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<Partial<PlaceRow>>({ ...EMPTY, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function setField<K extends keyof PlaceRow>(key: K, value: PlaceRow[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingImg(true)
    setError('')
    try {
      const urls: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        if (placeId) fd.append('placeId', placeId)

        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const json = await res.json().catch(() => ({}))

        if (!res.ok) {
          const msg = json.error ?? `HTTP ${res.status}`
          const hint = json.hint ? `\n提示：${json.hint}` : ''
          throw new Error(`上传失败：${msg}${hint}`)
        }
        if (!json.url) throw new Error('上传接口未返回 URL')
        urls.push(json.url)
      }
      setField('images', [...(form.images ?? []), ...urls])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '图片上传失败，请重试')
    } finally {
      setUploadingImg(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function removeImage(url: string) {
    setField('images', (form.images ?? []).filter((u) => u !== url))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const url = mode === 'create' ? '/api/admin/places' : `/api/admin/places/${placeId}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? '保存失败')
      }
      router.push('/admin/places')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
          {error.split('\n').map((line, i) => (
            <p key={i} className={`text-[14px] text-rose-700 ${i > 0 ? 'mt-1 text-[12px] text-rose-500' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Left column ─────────────────────────────────── */}
        <div className="space-y-5">

          {/* Basic info */}
          <Card title="基本信息">
            <div className="grid grid-cols-2 gap-4">
              <Field label="商家名称" required>
                <Input value={form.name ?? ''} onChange={(v) => setField('name', v)} placeholder="例：W Hotel 广州" required />
              </Field>
              <Field label="城市" required>
                <Select
                  value={form.city ?? 'guangzhou'}
                  onChange={(v) => setField('city', v as PlaceRow['city'])}
                  options={Object.entries(CITY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                />
              </Field>
              <Field label="区域">
                <Input value={form.district ?? ''} onChange={(v) => setField('district', v)} placeholder="天河区" />
              </Field>
              <Field label="类型" required>
                <Select
                  value={form.category ?? 'cafe'}
                  onChange={(v) => setField('category', v as PlaceRow['category'])}
                  options={Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                />
              </Field>
            </div>
            <Field label="详细地址">
              <Input value={form.address ?? ''} onChange={(v) => setField('address', v)} placeholder="广州市天河区…" />
            </Field>
            <Field label="营业时间">
              <Input value={form.business_hours ?? ''} onChange={(v) => setField('business_hours', v)} placeholder="周一至周五 10:00–22:00，周末 09:00–23:00" />
            </Field>
            <Field label="商家简介">
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setField('description', e.target.value)}
                rows={3}
                placeholder="描述商家特色、环境、宠物友好政策摘要..."
                className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] resize-none bg-white"
              />
            </Field>
          </Card>

          {/* Pet-friendly rules */}
          <Card title="宠物友好标签">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="允许体型">
                <Select
                  value={form.pet_size_allowed ?? 'unknown'}
                  onChange={(v) => setField('pet_size_allowed', v as PlaceRow['pet_size_allowed'])}
                  options={Object.entries(PET_SIZE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PET_BOOL_FIELDS.map(({ key, label }) => (
                <Toggle
                  key={key}
                  label={label}
                  checked={!!(form[key as keyof typeof form])}
                  onChange={(v) => setField(key as keyof PlaceRow, v as never)}
                />
              ))}
            </div>
            <Field label="宠物规则说明">
              <textarea
                value={form.pet_policy ?? ''}
                onChange={(e) => setField('pet_policy', e.target.value)}
                rows={2}
                placeholder="简短的宠物入场规定摘要..."
                className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] resize-none bg-white"
              />
            </Field>
            <Field label="规则原文（商家公示原文）">
              <textarea
                value={form.rules_text ?? ''}
                onChange={(e) => setField('rules_text', e.target.value)}
                rows={2}
                placeholder="复制商家官方公示的宠物规定原文..."
                className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] resize-none bg-white"
              />
            </Field>
          </Card>

          {/* Contact */}
          <Card title="联系信息">
            <div className="grid grid-cols-2 gap-4">
              <Field label="联系电话">
                <Input value={form.contact_phone ?? form.phone ?? ''} onChange={(v) => { setField('contact_phone', v); setField('phone', v) }} placeholder="020-12345678" />
              </Field>
              <Field label="微信号">
                <Input value={form.wechat ?? ''} onChange={(v) => setField('wechat', v)} placeholder="wechat_id" />
              </Field>
              <Field label="小红书链接">
                <Input value={form.xiaohongshu_url ?? ''} onChange={(v) => setField('xiaohongshu_url', v)} placeholder="https://..." />
              </Field>
              <Field label="预约链接">
                <Input value={form.booking_url ?? ''} onChange={(v) => setField('booking_url', v)} placeholder="https://..." />
              </Field>
            </div>
          </Card>

          {/* Coordinates */}
          <Card title="地理坐标（可选）">
            <div className="grid grid-cols-2 gap-4">
              <Field label="纬度 Latitude">
                <input
                  type="number" step="any"
                  value={form.latitude ?? ''}
                  onChange={(e) => setField('latitude', e.target.value === '' ? null : parseFloat(e.target.value))}
                  placeholder="23.1291"
                  className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] focus:outline-none focus:border-[#D99478] bg-white"
                />
              </Field>
              <Field label="经度 Longitude">
                <input
                  type="number" step="any"
                  value={form.longitude ?? ''}
                  onChange={(e) => setField('longitude', e.target.value === '' ? null : parseFloat(e.target.value))}
                  placeholder="113.2644"
                  className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] focus:outline-none focus:border-[#D99478] bg-white"
                />
              </Field>
            </div>
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────────── */}
        <div className="space-y-5">

          {/* Images */}
          <Card title="商家图片">
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {(form.images ?? []).map((url, i) => (
                <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-[#EDE8E0] group">
                  <img src={url} alt={`图片 ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 font-medium">
                      封面
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 transition-all"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
                className="aspect-square rounded-xl border-2 border-dashed border-[#E8DCCB] flex flex-col items-center justify-center gap-1.5 text-[#C4A07E] hover:border-[#D99478] hover:text-[#C07A4E] hover:bg-[#FFF8F2] transition-all disabled:opacity-40"
              >
                {uploadingImg ? <Loader2 size={18} className="animate-spin" /> : (
                  <><ImagePlus size={18} /><span className="text-[10px] font-medium">上传图片</span></>
                )}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <p className="text-[12px] text-[#C4A07E]">支持 JPG/PNG/WebP，第一张为封面图</p>
          </Card>

          {/* Verification */}
          <Card title="认证信息">
            <Field label="认证状态">
              <Select
                value={form.verification_status ?? 'unverified'}
                onChange={(v) => setField('verification_status', v as PlaceRow['verification_status'])}
                options={[
                  { value: 'unverified', label: '未验证' },
                  { value: 'phone_verified', label: '已电话确认' },
                  { value: 'visited', label: '已实地探访' },
                  { value: 'visited_verified', label: '已实地验证' },
                  { value: 'doumiao_verified', label: '豆苗认证' },
                  { value: 'partner_verified', label: '合作认证' },
                ]}
              />
            </Field>
            <Field label="信息来源">
              <Select
                value={form.source ?? 'web'}
                onChange={(v) => setField('source', v as PlaceRow['source'])}
                options={Object.entries(SOURCE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
              />
            </Field>
            <Field label="最后验证时间">
              <input
                type="datetime-local"
                value={form.last_verified_at ? form.last_verified_at.slice(0, 16) : ''}
                onChange={(e) => setField('last_verified_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] focus:outline-none focus:border-[#D99478] bg-white"
              />
            </Field>
            <Field label="认证备注">
              <textarea
                value={form.verification_notes ?? ''}
                onChange={(e) => setField('verification_notes', e.target.value)}
                rows={2}
                placeholder="电话确认人员、探访日期、备注信息..."
                className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] resize-none bg-white"
              />
            </Field>
            <Toggle
              label="首页推荐"
              checked={!!form.is_featured}
              onChange={(v) => setField('is_featured', v)}
            />
          </Card>

          {/* Scores */}
          <Card title="评分">
            <div className="space-y-3">
              {SCORE_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <label className="text-[13px] text-[#6B5744] shrink-0 w-24">{label}</label>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.round((form[key] as number) ?? 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#E8DCCB]'
                          }
                        />
                      ))}
                    </div>
                    <input
                      type="number" min={0} max={5} step={0.1}
                      value={(form[key] as number | null | undefined) ?? ''}
                      onChange={(e) =>
                        setField(key, e.target.value === '' ? null : parseFloat(e.target.value) as never)
                      }
                      placeholder="—"
                      className="w-14 px-2 py-1 border border-[#E8DCCB] rounded-lg text-[13px] text-center focus:outline-none focus:border-[#D99478] bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Submit bar */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#EDE8E0]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-[#E8DCCB] text-[14px] text-[#6B5744] hover:bg-[#FAF5EE] transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={saving || !form.name?.trim()}
          className="flex items-center gap-2 px-7 py-2.5 bg-[#C07A4E] text-white rounded-xl text-[14px] font-medium disabled:opacity-40 hover:bg-[#A86840] transition-colors shadow-sm"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? '保存中...' : mode === 'create' ? '创建商家' : '保存修改'}
        </button>
      </div>
    </form>
  )
}

// ── Sub-components ──────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_1px_4px_rgba(60,30,10,0.06)] p-6">
      <h3 className="text-[15px] font-semibold text-[#1E1209] mb-5 pb-4 border-b border-[#F0EAE0]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#6B5744] mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean
}) {
  return (
    <input
      type="text" value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] bg-white"
    />
  )
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-3 border border-[#E8DCCB] rounded-xl text-[14px] text-[#1E1209] bg-white focus:outline-none focus:border-[#D99478]"
    >
      {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
    </select>
  )
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none bg-[#FDFAF4] rounded-xl px-3 py-2.5 hover:bg-[#F5EBD8] transition-colors border border-[#F0EAE0]">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-[#C07A4E]' : 'bg-[#DDD5C8]'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-[13px] text-[#6B5744]">{label}</span>
    </label>
  )
}
