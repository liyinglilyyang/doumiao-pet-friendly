'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabaseClient'
import { Eye, EyeOff, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type DiagInfo = {
  authError: string | null
  sessionExists: boolean | null
  userId: string | null
  userEmail: string | null
  profileFound: boolean | null
  role: string | null
  profileError: string | null
  redirectTarget: string | null
}

function DiagRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[10px] font-mono">
      <span className="text-[#A07855] shrink-0 w-28">{label}</span>
      <span className="text-[#1E1209] break-all">{value}</span>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')   // visible step tracker
  const [error, setError] = useState('')
  const [diag, setDiag] = useState<DiagInfo | null>(null)
  const [showDiag, setShowDiag] = useState(false)

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('[AdminLogin] Already has session, redirecting')
        window.location.href = '/admin/dashboard'
      }
    })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setStatus('正在验证账号…')
    setDiag(null)
    setShowDiag(false)

    // Step 1: Auth
    console.log('[AdminLogin] Step 1: signInWithPassword', email.trim())
    const { data: authData, error: authErr } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    console.log('[AdminLogin] signIn result:', { data: authData, error: authErr })

    if (authErr) {
      console.error('[AdminLogin] Auth error:', authErr)
      setLoading(false)
      setStatus('')
      setDiag({
        authError: authErr.message,
        sessionExists: false,
        userId: null,
        userEmail: null,
        profileFound: null,
        role: null,
        profileError: null,
        redirectTarget: null,
      })
      setShowDiag(true)
      setError(authErr.message)
      return
    }

    const session = authData.session
    const user = authData.user
    console.log('[AdminLogin] Session:', session)
    console.log('[AdminLogin] User:', user)

    if (!session || !user) {
      setLoading(false)
      setStatus('')
      setError('登录成功但未获得 session，请重试')
      return
    }

    // Step 2: Check profile
    setStatus('正在验证管理员权限…')
    console.log('[AdminLogin] Step 2: querying profiles for user', user.id)
    const profileResult = await getSupabase()
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profileErr = profileResult.error
    const profileRole = (profileResult.data as { role: string } | null)?.role ?? null
    console.log('[AdminLogin] Profile result:', profileResult)
    console.log('[AdminLogin] Role:', profileRole)

    setLoading(false)

    const d: DiagInfo = {
      authError: null,
      sessionExists: true,
      userId: user.id,
      userEmail: user.email ?? null,
      profileFound: !profileErr && profileResult.data !== null,
      role: profileRole,
      profileError: profileErr?.message ?? null,
      redirectTarget: null,
    }

    if (profileErr || profileResult.data === null) {
      const tableNotFound =
        profileErr?.message?.includes('does not exist') ||
        profileErr?.message?.includes('relation') ||
        profileErr?.code === '42P01'
      setDiag({ ...d, redirectTarget: null })
      setShowDiag(true)
      setStatus('')
      setError(
        tableNotFound
          ? 'profiles 表不存在。请先运行初始化 SQL。'
          : '管理员资料未创建。请运行初始化 SQL。'
      )
      return
    }

    if (profileRole !== 'admin') {
      setDiag({ ...d, redirectTarget: null })
      setShowDiag(true)
      setStatus('')
      setError(`该账号不是管理员（当前角色：${profileRole || '无'}）`)
      return
    }

    // Step 3: Redirect
    const target = redirectTo.startsWith('/admin') ? redirectTo : '/admin/dashboard'
    console.log('[AdminLogin] Step 3: redirecting to', target)
    setDiag({ ...d, redirectTarget: target })
    setStatus(`✓ 已验证为管理员，正在跳转到 ${target}…`)

    // Full page navigation so cookies are sent with the new request
    // and middleware reads the session correctly.
    window.location.href = target
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center px-4 py-12">
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
                className="w-full px-4 py-3 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#F5A462]"
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
                  className="w-full px-4 py-3 pr-10 bg-[#FDFAF4] rounded-xl border border-[#E8DCCB] text-sm text-[#1E1209] placeholder-[#C4A07E] focus:outline-none focus:border-[#F5A462]"
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

            {/* Step status — shows progress and final redirect */}
            {status && !error && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <p className="text-xs text-emerald-700 font-medium">{status}</p>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 space-y-2">
                <p className="text-sm font-medium text-rose-700">登录失败</p>
                <p className="text-xs text-rose-600 leading-relaxed">{error}</p>

                {diag && (
                  <button
                    type="button"
                    onClick={() => setShowDiag((v) => !v)}
                    className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                  >
                    {showDiag ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    诊断详情
                  </button>
                )}

                {diag && showDiag && (
                  <div className="bg-white/80 rounded-lg p-2.5 space-y-1 border border-rose-100">
                    <DiagRow label="Auth Error" value={diag.authError ?? '—'} />
                    <DiagRow label="Session" value={
                      diag.sessionExists === null ? '—' : diag.sessionExists ? '✓ 存在' : '✗ 无'
                    } />
                    <DiagRow label="User ID" value={diag.userId ? diag.userId.slice(0, 8) + '…' : '—'} />
                    <DiagRow label="User Email" value={diag.userEmail ?? '—'} />
                    <DiagRow label="Profile" value={
                      diag.profileFound === null ? '—' : diag.profileFound ? '✓ 存在' : '✗ 不存在'
                    } />
                    <DiagRow label="Role" value={diag.role ?? '—'} />
                    {diag.profileError && <DiagRow label="Profile Error" value={diag.profileError} />}
                    {diag.redirectTarget && <DiagRow label="Redirect To" value={diag.redirectTarget} />}
                  </div>
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

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <p className="text-[12px] font-semibold text-amber-900">需要初始化 SQL？</p>
          <Link href="/admin/setup-sql" className="inline-block text-[11px] font-medium text-amber-700 underline">
            查看 profiles 表初始化 SQL →
          </Link>
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
