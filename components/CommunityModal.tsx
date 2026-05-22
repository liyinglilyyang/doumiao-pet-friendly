'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { LeadIntent } from '@/lib/database.types'

interface Props {
  open: boolean
  onClose: () => void
  sourcePage: string
}

const INTENT_OPTIONS: { value: LeadIntent; label: string }[] = [
  { value: 'contribute', label: '愿意投稿' },
  { value: 'explore',    label: '愿意探店' },
  { value: 'updates',    label: '只想看更新' },
]

export default function CommunityModal({ open, onClose, sourcePage }: Props) {
  const [contact,    setContact]  = useState('')
  const [city,       setCity]     = useState('')
  const [petType,    setPetType]  = useState('')
  const [intent,     setIntent]   = useState<LeadIntent[]>([])
  const [submitting, setSubmit]   = useState(false)
  const [done,       setDone]     = useState(false)
  const [error,      setError]    = useState('')

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function reset() {
    setContact(''); setCity(''); setPetType(''); setIntent([])
    setDone(false); setError('')
  }

  function handleClose() { onClose(); setTimeout(reset, 300) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) { setError('请填写联系方式'); return }
    setSubmit(true)
    setError('')
    try {
      const res = await fetch('/api/community-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: contact.trim(),
          city:    city || null,
          pet_type: petType || null,
          intent:  intent.length > 0 ? intent : null,
          source_page: sourcePage,
        }),
      })
      if (res.ok) { setDone(true) } else { setError('提交失败，请稍后重试') }
    } catch {
      setError('提交失败，请稍后重试')
    } finally {
      setSubmit(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={handleClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {done ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="font-bold text-[18px] text-[#1E1209] mb-2">收到啦</h3>
            <p className="text-[14px] text-[#7C5A42] leading-relaxed mb-1">
              豆苗会尽快联系你～
            </p>
            <p className="text-[12px] text-[#A09080] mb-7">
              感谢你加入这个越来越宠物友好的社群
            </p>
            <button onClick={handleClose}
              className="w-full py-3 bg-[#C07A4E] hover:bg-[#A86840] text-white rounded-xl font-semibold text-[14px] transition-colors">
              好的～
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h3 className="font-bold text-[17px] text-[#1E1209]">加入豆苗宠物友好社群</h3>
                <p className="text-[12px] text-[#A09080] mt-0.5">留下联系方式，豆苗会主动联系你</p>
              </div>
              <button onClick={handleClose}
                className="w-7 h-7 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#7C5A42] hover:bg-[#EDE0D0] transition-colors shrink-0 mt-0.5">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              {/* Contact */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5C3D20] mb-1.5">
                  微信号 / 手机号 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="填写其中一个即可"
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#EDE8E0] text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#C07A4E] transition-colors"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5C3D20] mb-1.5">所在城市</label>
                <div className="flex gap-2">
                  {['广州', '深圳', '香港'].map((c) => (
                    <button key={c} type="button" onClick={() => setCity(city === c ? '' : c)}
                      className={`flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all ${
                        city === c
                          ? 'bg-[#C07A4E] text-white border-[#C07A4E]'
                          : 'bg-white text-[#6B5744] border-[#EDE8E0] hover:border-[#C07A4E]'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pet type */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5C3D20] mb-1.5">你家毛孩子</label>
                <div className="flex gap-2">
                  {[{ v: 'dog', l: '狗狗 🐶' }, { v: 'cat', l: '猫咪 🐱' }, { v: 'other', l: '其他 🐾' }].map(({ v, l }) => (
                    <button key={v} type="button" onClick={() => setPetType(petType === v ? '' : v)}
                      className={`flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all ${
                        petType === v
                          ? 'bg-[#1E1209] text-white border-[#1E1209]'
                          : 'bg-white text-[#6B5744] border-[#EDE8E0] hover:border-[#1E1209]'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5C3D20] mb-1.5">
                  你希望参与 <span className="font-normal text-[#A09080]">（可多选）</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTENT_OPTIONS.map(({ value, label }) => {
                    const checked = intent.includes(value)
                    return (
                      <button key={value} type="button"
                        onClick={() => setIntent((prev) =>
                          checked ? prev.filter((i) => i !== value) : [...prev, value]
                        )}
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all ${
                          checked
                            ? 'bg-[#FAF0E8] text-[#C07A4E] border-[#E8C4A8]'
                            : 'bg-white text-[#6B5744] border-[#EDE8E0] hover:border-[#C07A4E]'
                        }`}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && <p className="text-[12px] text-rose-500">{error}</p>}

              <button type="submit" disabled={submitting || !contact.trim()}
                className="w-full py-3 rounded-xl bg-[#C07A4E] hover:bg-[#A86840] text-white font-semibold text-[14px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {submitting ? '提交中…' : '加入社群'}
              </button>

              <p className="text-[11px] text-center text-[#C4A07E]">
                豆苗只会用来联系你，不会分享给任何第三方
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
