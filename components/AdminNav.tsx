'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, MapPin, LogOut, ExternalLink } from 'lucide-react'
import { getSupabase } from '@/lib/supabaseClient'

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: '概览' },
  { href: '/admin/places', icon: MapPin, label: '商家管理' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await getSupabase().auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-[#EDE8E0] flex flex-col py-7 px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#F5EBD8] flex items-center justify-center shrink-0 text-lg">
          🌱
        </div>
        <div>
          <div className="font-bold text-[#1E1209] text-[15px] leading-tight">豆苗后台</div>
          <div className="text-[10px] text-[#B09880] tracking-widest uppercase">Admin</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                active
                  ? 'bg-[#FFF0E2] text-[#E0813D]'
                  : 'text-[#6B5744] hover:bg-[#FAF5EE] hover:text-[#1E1209]'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-0.5 pt-4 border-t border-[#EDE8E0]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-[#A09080] hover:text-[#6B5744] hover:bg-[#FAF5EE] transition-all"
        >
          <ExternalLink size={15} strokeWidth={1.8} />
          查看前台
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-[#A09080] hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut size={15} strokeWidth={1.8} />
          退出登录
        </button>
      </div>
    </aside>
  )
}
