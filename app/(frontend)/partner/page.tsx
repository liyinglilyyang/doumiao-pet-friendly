'use client'

import { useState } from 'react'
import { CheckCircle2, Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const BENEFITS = [
  { emoji: '🌱', title: '免费入驻', desc: '无需任何费用，提交即可' },
  { emoji: '🔍', title: '精准曝光', desc: '触达广深港宠物主群体' },
  { emoji: '✅', title: '官方认证', desc: '获得豆苗宠物友好认证标识' },
  { emoji: '📊', title: '数据透明', desc: '了解真实用户反馈与访问量' },
]

type FormData = {
  name: string
  city: string
  type: string
  allowsPets: string
  contact: string
  notes: string
}

export default function PartnerPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    city: '',
    type: '',
    allowsPets: '',
    contact: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  const isValid =
    form.name.trim() &&
    form.city &&
    form.type &&
    form.allowsPets &&
    form.contact.trim()

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E1209] to-[#3D2010] px-4 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#E0813D]/10 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#F0BE56]/10 translate-y-6 -translate-x-6" />

        <Link href="/" className="flex items-center gap-1.5 text-white/60 text-xs mb-6">
          <ArrowLeft size={13} />
          返回首页
        </Link>

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#E0813D] flex items-center justify-center mb-4 shadow-lg">
            <Building2 size={22} className="text-white" />
          </div>
          <h1 className="font-bold text-white text-2xl leading-snug mb-2">
            成为豆苗
            <br />
            宠物友好商家
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            免费入驻，获得官方认证，触达广深港数万宠物主
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 py-6">
        <h2 className="font-bold text-[#1E1209] text-base mb-3">入驻有什么好处？</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {BENEFITS.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-3.5 border border-[#E8DCCB] shadow-[0_1px_6px_rgba(60,30,10,0.06)]"
            >
              <div className="text-xl mb-2">{emoji}</div>
              <div className="font-semibold text-[#1E1209] text-sm mb-0.5">{title}</div>
              <div className="text-xs text-[#A07855]">{desc}</div>
            </div>
          ))}
        </div>

        {/* Process */}
        <div className="bg-[#FFF8EE] rounded-2xl border border-[#F5C49A] p-4 mb-6">
          <h3 className="font-bold text-[#1E1209] text-sm mb-3">入驻流程</h3>
          <div className="space-y-2.5">
            {[
              '提交商家基本信息',
              '豆苗团队审核（1-3个工作日）',
              '电话确认宠物政策',
              '上线展示，获得认证标识',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E0813D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-[#5C3D20]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-[#1E1209] text-lg mb-2">申请已提交！</h3>
            <p className="text-sm text-[#A07855] leading-relaxed mb-6 max-w-xs">
              感谢您的申请，豆苗团队会在 1-3 个工作日内与您联系，完成审核与验证。
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-[#E0813D] text-white rounded-2xl font-medium text-sm hover:bg-[#CC7030] transition-colors"
            >
              返回首页
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-bold text-[#1E1209] text-base">提交申请</h2>

            {/* 商家名称 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">
                商家名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="请输入店铺/品牌名称"
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E]"
              />
            </div>

            {/* 城市 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">
                所在城市 <span className="text-rose-500">*</span>
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] appearance-none"
              >
                <option value="">请选择城市</option>
                <option value="guangzhou">广州</option>
                <option value="shenzhen">深圳</option>
                <option value="hongkong">香港</option>
                <option value="other">其他城市</option>
              </select>
            </div>

            {/* 商家类型 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">
                商家类型 <span className="text-rose-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] appearance-none"
              >
                <option value="">请选择类型</option>
                <option value="hotel">🏨 宠物友好酒店</option>
                <option value="cafe">☕ 宠物友好咖啡</option>
                <option value="restaurant">🍽️ 宠物友好餐厅</option>
                <option value="boarding">🏠 宠物寄养</option>
                <option value="service">🛎️ 上门服务</option>
                <option value="transport">🚗 宠物运输</option>
              </select>
            </div>

            {/* 是否接受宠物 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-2">
                是否接受宠物 <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: '✅ 完全接受' },
                  { value: 'conditional', label: '⚠️ 有条件接受' },
                  { value: 'outdoor', label: '🌿 仅限户外' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, allowsPets: value }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      form.allowsPets === value
                        ? 'bg-[#E0813D] text-white border-[#E0813D]'
                        : 'bg-white text-[#7C5A42] border-[#E8DCCB]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">
                联系方式 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="手机号 / 微信号 / 邮箱"
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E]"
              />
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">
                补充说明（可选）
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="宠物政策详情、特别说明、希望展示的信息..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
                isValid && !loading
                  ? 'bg-[#E0813D] text-white hover:bg-[#CC7030] shadow-md'
                  : 'bg-[#E8DCCB] text-[#C4A07E] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  提交中...
                </span>
              ) : (
                '提交申请'
              )}
            </button>

            <p className="text-[11px] text-center text-[#C4A07E]">
              提交后豆苗团队将在 1-3 个工作日内与您联系
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
