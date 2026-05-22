import { Monitor } from 'lucide-react'
import Link from 'next/link'

export default function AdminMobileGate() {
  return (
    <div className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-8 text-center">
      <Monitor size={48} className="text-[#C4A07E] mb-6" />
      <h2 className="font-bold text-[#1E1209] text-xl mb-2">请在电脑端管理后台</h2>
      <p className="text-[14px] text-[#A09080] leading-relaxed max-w-xs mb-8">
        豆苗管理后台为桌面端优化，请使用宽度 1024px 以上的设备访问
      </p>
      <Link href="/" className="text-[14px] text-[#C07A4E] hover:underline">← 返回首页</Link>
    </div>
  )
}
