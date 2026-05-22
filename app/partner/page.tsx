'use client'

import { useState } from 'react'
import { CheckCircle2, Building2, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const BENEFITS = [
  { emoji: '🌿', title: '真正被看见', desc: '不是广告位，是养宠人真实查找时会找到的地方' },
  { emoji: '✅', title: '信任认证', desc: '豆苗团队实地或电话确认，给你的欢迎一个可信背书' },
  { emoji: '🏙️', title: '成为城市符号', desc: '在这座城市的宠物友好地图上，留下你的位置' },
  { emoji: '🐾', title: '与同类相遇', desc: '连接真正在乎毛孩子的人，一起让城市更开放' },
]

type FormData = {
  name: string; city: string; type: string
  allowsPets: string; contact: string; notes: string
}

export default function PartnerPage() {
  const [form, setForm] = useState<FormData>({ name: '', city: '', type: '', allowsPets: '', contact: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
  }

  const isValid = form.name.trim() && form.city && form.type && form.allowsPets && form.contact.trim()

  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
        <div className="max-w-screen-xl mx-auto w-full px-8 h-[64px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places" className="text-[13px] text-[#7C5A42] font-medium hover:text-[#1E1209]">探索地点</Link>
            <Link href="/submit-place" className="text-[13px] text-[#A09080] hover:text-[#1E1209] transition-colors">投稿地点</Link>
            <Link href="/about" className="text-[13px] text-[#A09080] hover:text-[#1E1209]">关于</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E1209] to-[#3D2010] px-4 md:px-8 pt-10 pb-8 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C07A4E]/10 -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#F0BE56]/10 translate-y-12 -translate-x-12" />
        <div className="max-w-screen-xl md:mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 text-[13px] mb-6 hover:text-white/80 transition-colors">
            <ArrowLeft size={13} />返回首页
          </Link>
          <div className="md:flex md:items-center md:gap-8">
            <div className="md:flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#C07A4E] flex items-center justify-center mb-4 shadow-lg">
                <Building2 size={22} className="text-white" />
              </div>
              <h1 className="font-bold text-white text-[24px] md:text-[36px] leading-snug mb-2">
                欢迎毛孩子，<br />不只是一句话
              </h1>
              <p className="text-white/70 text-[13px] md:text-[15px] leading-relaxed">
                成为真正宠物友好城市的一部分。让更多带着毛孩子出门的铲屎官，在地图上找到你。
              </p>
            </div>
            {/* Desktop benefits preview */}
            <div className="hidden md:grid grid-cols-2 gap-3 md:w-[380px] mt-6 md:mt-0">
              {BENEFITS.map(({ emoji, title, desc }) => (
                <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-xl mb-2">{emoji}</div>
                  <div className="font-semibold text-white text-[13px] mb-0.5">{title}</div>
                  <div className="text-[11px] text-white/60">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body — 1-col mobile, 2-col desktop */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="md:grid md:grid-cols-2 md:gap-10 lg:gap-16">

          {/* Left: info */}
          <div>
            {/* Benefits — mobile only (desktop shows in hero) */}
            <div className="md:hidden mb-6">
              <h2 className="font-bold text-[#1E1209] text-[15px] mb-3">为什么加入豆苗？</h2>
              <div className="grid grid-cols-2 gap-3">
                {BENEFITS.map(({ emoji, title, desc }) => (
                  <div key={title} className="bg-white rounded-2xl p-3.5 border border-[#E8DCCB] shadow-soft">
                    <div className="text-xl mb-2">{emoji}</div>
                    <div className="font-semibold text-[#1E1209] text-[13px] mb-0.5">{title}</div>
                    <div className="text-[11px] text-[#A07855]">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className="bg-[#FFF8EE] rounded-2xl border border-[#E8C4A8] p-4 md:p-6 mb-6">
              <h3 className="font-bold text-[#1E1209] text-[14px] md:text-[16px] mb-3 md:mb-4">如何加入</h3>
              <div className="space-y-3">
                {[
                  '告诉我们你的空间和宠物政策',
                  '豆苗团队核实，通常 1–3 个工作日',
                  '我们会打个电话聊聊，确认细节',
                  '你出现在地图上，真实的养宠人找到你',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C07A4E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-[13px] md:text-[14px] text-[#5C3D20]">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop benefits (shown instead of mobile 2-col) */}
            <div className="hidden md:block">
              <h2 className="font-bold text-[#1E1209] text-[16px] mb-4">为什么加入豆苗？</h2>
              <div className="grid grid-cols-2 gap-3">
                {BENEFITS.map(({ emoji, title, desc }) => (
                  <div key={title} className="bg-white rounded-2xl p-4 border border-[#E8DCCB] shadow-soft">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="font-semibold text-[#1E1209] text-[13px] mb-1">{title}</div>
                    <div className="text-[12px] text-[#A07855]">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit place tip */}
            <div className="mt-6 p-4 rounded-2xl bg-[#F5F0E8] border border-[#E8DCCB] flex items-start gap-3">
              <span className="text-xl shrink-0">🐾</span>
              <div>
                <div className="text-[13px] font-semibold text-[#1E1209] mb-0.5">不是商家？也可以投稿！</div>
                <p className="text-[12px] text-[#7C5A42] leading-relaxed mb-2">
                  如果您发现了一个对宠物友好的地方，可以直接投稿，由豆苗团队核实后收录。
                </p>
                <Link href="/submit-place" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#C07A4E] hover:underline">
                  提交我的店铺 <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-[#1E1209] text-lg mb-2">已收到，谢谢你 🌱</h3>
                <p className="text-[13px] md:text-[14px] text-[#A07855] leading-relaxed mb-6 max-w-xs">
                  豆苗团队会在 1–3 个工作日内和你联系。每一个欢迎毛孩子的空间，都让城市多一点自由。
                </p>
                <Link href="/" className="px-6 py-3 bg-[#C07A4E] text-white rounded-2xl font-medium text-[13px] hover:bg-[#A86840]">
                  返回首页
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border border-[#E8DCCB] p-5 md:p-6 shadow-soft">
                <h2 className="font-bold text-[#1E1209] text-[15px] md:text-[16px]">告诉我们你的空间</h2>

                <Field label="商家名称">
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="请输入店铺/品牌名称"
                    className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-[13px] md:text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478]" />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="所在城市">
                    <select name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-3 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-[13px] text-[#1E1209] focus:outline-none focus:border-[#D99478] appearance-none">
                      <option value="">选择城市</option>
                      <option value="guangzhou">广州</option>
                      <option value="shenzhen">深圳</option>
                      <option value="hongkong">香港</option>
                      <option value="other">其他</option>
                    </select>
                  </Field>
                  <Field label="商家类型">
                    <select name="type" value={form.type} onChange={handleChange} required
                      className="w-full px-3 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-[13px] text-[#1E1209] focus:outline-none focus:border-[#D99478] appearance-none">
                      <option value="">选择类型</option>
                      <option value="hotel">🏨 酒店</option>
                      <option value="cafe">☕ 咖啡</option>
                      <option value="restaurant">🍽️ 餐厅</option>
                      <option value="boarding">🏠 寄养</option>
                      <option value="service">🛎️ 上门服务</option>
                      <option value="transport">🚗 运输</option>
                    </select>
                  </Field>
                </div>

                <Field label="是否接受宠物">
                  <div className="flex gap-2">
                    {[
                      { value: 'yes', label: '✅ 完全接受' },
                      { value: 'conditional', label: '⚠️ 有条件' },
                      { value: 'outdoor', label: '🌿 仅户外' },
                    ].map(({ value, label }) => (
                      <button key={value} type="button"
                        onClick={() => setForm((p) => ({ ...p, allowsPets: value }))}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] md:text-[12px] font-medium border transition-all ${
                          form.allowsPets === value ? 'bg-[#C07A4E] text-white border-[#C07A4E]' : 'bg-white text-[#7C5A42] border-[#E8DCCB]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="联系方式">
                  <input type="text" name="contact" value={form.contact} onChange={handleChange} required
                    placeholder="手机号 / 微信号 / 邮箱"
                    className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-[13px] md:text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478]" />
                </Field>

                <Field label="补充说明（可选）">
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                    placeholder="宠物政策详情、特别说明..."
                    className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-[13px] md:text-[14px] text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#D99478] resize-none" />
                </Field>

                <button type="submit" disabled={!isValid || loading}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-[13px] md:text-[14px] transition-all ${
                    isValid && !loading ? 'bg-[#C07A4E] text-white hover:bg-[#A86840] shadow-md' : 'bg-[#E8DCCB] text-[#C4A07E] cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      提交中...
                    </span>
                  ) : '申请加入'}
                </button>
                <p className="text-[11px] text-center text-[#C4A07E]">提交后豆苗团队将在 1-3 个工作日内与您联系</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] md:text-[13px] font-medium text-[#5C3D20] mb-1.5">
        {label} <span className="text-rose-500">*</span>
      </label>
      {children}
    </div>
  )
}
