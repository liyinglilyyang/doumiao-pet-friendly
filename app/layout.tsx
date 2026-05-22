import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNavWrapper from '@/components/mobile/BottomNavWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: '豆苗宠物友好 · DouMiao Pet Friendly',
  description: '发现真正欢迎毛孩子的地方 — 广州·深圳·香港宠物友好信息平台',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>
        {children}
        <BottomNavWrapper />
      </body>
    </html>
  )
}
