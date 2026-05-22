'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Trophy, Handshake, PlusCircle } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',              icon: Home,        label: '首页' },
  { href: '/places',        icon: Compass,     label: '发现' },
  { href: '/submit-place',  icon: PlusCircle,  label: '投稿' },
  { href: '/rankings',      icon: Trophy,      label: '榜单' },
  { href: '/partner',       icon: Handshake,   label: '商家' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#E8DCCB] md:hidden">
      <div className="flex items-center justify-around px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl">
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} className={active ? 'text-[#E0813D]' : 'text-[#B89878]'} />
              <span className={`text-[10px] font-medium ${active ? 'text-[#E0813D]' : 'text-[#B89878]'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
