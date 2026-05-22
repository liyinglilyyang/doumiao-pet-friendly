'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabaseClient'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirectTo)
    })
  }, [redirectTo, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: err } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (err) {
      // Show the real Supabase error message so it's debuggable
      setError(err.message)
      return
    }

    if (data.session) {
      router.replace(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#E0813D] flex items-center justify-center shadow-md">
            <span className="text-white text-xl">🌱</span>
          </div>
          <div>
            <div className="font-bold text-[#1E1209] text-base">豆苗后台管理</div>
            <div className="text-[10px] text-[#A07855] tracking-wide">DOUMIAO ADMIN</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DCCB] shadow-[0_2px_16px_rgba(60,30,10,0.08)] p-6">
          <h1 className="font-bold text-[#1E1209] text-lg mb-1">管理员登录</h1>
          <p className="text-sm text-[#A07855] mb-6">仅限授权管理员访问</p>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 space-y-1">
                <p className="text-sm font-medium text-rose-700">登录失败</p>
                <p className="text-xs text-rose-600 font-mono break-all">{error}</p>
                {error.toLowerCase().includes('email') && (
                  <p className="text-xs text-rose-500 mt-1">
                    提示：如果账号是新建的，请先到{' '}
                    <Link href="/admin/signup" className="underline font-medium">注册页</Link>
                    {' '}创建账号，或在 Supabase 后台确认邮箱已验证。
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-xl bg-[#E0813D] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#CC7030] transition-colors"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#E8DCCB] text-center">
            <span className="text-xs text-[#A07855]">还没有账号？</span>{' '}
            <Link href="/admin/signup" className="text-xs text-[#E0813D] font-medium hover:underline">
              注册管理员账号
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFAF4]" />}>
      <LoginForm />
    </Suspense>
  )
}
