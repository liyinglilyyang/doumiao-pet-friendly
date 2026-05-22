'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabaseClient'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export default function AdminSignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('两次输入的密码不一致')
      return
    }
    if (password.length < 6) {
      setError('密码至少 6 位')
      return
    }

    setLoading(true)

    const { data, error: err } = await getSupabase().auth.signUp({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    // If session is returned directly — email confirm is disabled, auto-login
    if (data.session) {
      setDone(true)
      setTimeout(() => router.replace('/admin/dashboard'), 1500)
      return
    }

    // No session — Supabase sent a confirmation email
    setNeedsConfirm(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="font-bold text-[#1E1209] text-lg mb-1">注册成功！</h2>
          <p className="text-sm text-[#A07855]">正在跳转后台…</p>
        </div>
      </div>
    )
  }

  if (needsConfirm) {
    return (
      <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E8DCCB] p-6 text-center shadow-[0_2px_16px_rgba(60,30,10,0.08)]">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="font-bold text-[#1E1209] text-lg mb-2">请验证邮箱</h2>
          <p className="text-sm text-[#7C5A42] leading-relaxed mb-4">
            已发送确认邮件到{' '}
            <span className="font-medium text-[#1E1209]">{email}</span>
            ，点击邮件中的链接后再来登录。
          </p>
          <p className="text-xs text-[#A07855] mb-5 bg-amber-50 rounded-xl p-3 text-left leading-relaxed">
            <strong>如果不想等邮件：</strong>在 Supabase Dashboard →
            Authentication → Providers → Email，关闭
            <em>「Confirm email」</em>选项，重新注册即可直接登录。
          </p>
          <Link
            href="/admin/login"
            className="block w-full py-3 rounded-xl bg-[#C07A4E] text-white font-semibold text-sm text-center hover:bg-[#A86840] transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#C07A4E] flex items-center justify-center shadow-md">
            <span className="text-white text-xl">🌱</span>
          </div>
          <div>
            <div className="font-bold text-[#1E1209] text-base">豆苗后台管理</div>
            <div className="text-[10px] text-[#A07855] tracking-wide">DOUMIAO ADMIN</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-[0_2px_16px_rgba(60,30,10,0.08)] p-6">
          <h1 className="font-bold text-[#1E1209] text-lg mb-1">注册管理员账号</h1>
          <p className="text-sm text-[#A07855] mb-6">创建你的豆苗后台账号</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@doumiao.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">密码</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-10 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A07E]"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C3D20] mb-1.5">确认密码</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再输一次密码"
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E]"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 space-y-1">
                <p className="text-sm font-medium text-rose-700">注册失败</p>
                <p className="text-xs text-rose-600 font-mono break-all">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password || !confirm}
              className="w-full py-3 rounded-xl bg-[#C07A4E] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#A86840] transition-colors"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? '注册中...' : '创建账号'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#E8DCCB] text-center">
            <span className="text-xs text-[#A07855]">已有账号？</span>{' '}
            <Link href="/admin/login" className="text-xs text-[#C07A4E] font-medium hover:underline">
              直接登录
            </Link>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
          <strong>注意：</strong>如果注册后提示需要验证邮箱，可以在 Supabase Dashboard →
          Authentication → Providers → Email 中关闭 <em>「Confirm email」</em>，再重新注册即可跳过邮件验证直接登录。
        </div>
      </div>
    </div>
  )
}
