import type { Metadata } from 'next'
import './globals.css'
import BottomNavWrapper from '@/components/mobile/BottomNavWrapper'

export const metadata: Metadata = {
  title: '豆苗宠物友好 · DouMiao Pet Friendly',
  description: '发现真正欢迎毛孩子的地方 — 广州·深圳·香港宠物友好信息平台',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <BottomNavWrapper />
      </body>
    </html>
  )
}
