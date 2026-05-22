import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '豆苗后台管理 · DouMiao Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#FAF7F2]">{children}</div>
}
