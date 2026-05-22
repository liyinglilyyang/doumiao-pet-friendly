import Link from 'next/link'

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0 flex flex-col">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
        <div className="max-w-screen-xl mx-auto w-full px-8 h-[64px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places" className="text-[13px] text-[#7C5A42] font-medium">探索地点</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white font-medium">商家入驻</Link>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 pt-10 pb-6 bg-gradient-to-br from-[#FFF8EE] to-[#FFE4C0]">
        <div className="max-w-screen-xl md:mx-auto">
          <h1 className="font-bold text-[#1E1209] text-[20px] md:text-[28px] mb-1">地图发现</h1>
          <p className="text-[13px] md:text-[14px] text-[#A07855]">在地图上找到附近的宠物友好地点</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 max-w-screen-xl md:mx-auto w-full">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="font-bold text-[#1E1209] text-[18px] md:text-[22px] mb-2">地图功能即将上线</h2>
        <p className="text-[13px] md:text-[14px] text-[#A07855] text-center leading-relaxed max-w-sm">
          我们正在开发基于地图的宠物友好地点发现功能，敬请期待
        </p>
        <div className="mt-6 bg-[#FFF0E2] border border-[#F5C49A] rounded-2xl px-5 py-3 text-[13px] text-[#E0813D] font-medium">
          Coming Soon ✨
        </div>
      </div>
    </div>
  )
}
