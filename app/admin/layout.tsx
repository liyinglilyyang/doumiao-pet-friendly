import type { Metadata } from 'next'
import AdminMobileGate from '@/components/admin/MobileGate'

export const metadata: Metadata = {
  title: '豆苗后台管理 · DouMiao Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="lg:hidden"><AdminMobileGate /></div>
      <div className="hidden lg:block">{children}</div>
    </div>
  )
}
