export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF4] flex flex-col">
      <div className="px-4 pt-10 pb-6 bg-gradient-to-br from-[#FFF8EE] to-[#FFE4C0]">
        <h1 className="font-bold text-[#1E1209] text-xl mb-1">地图发现</h1>
        <p className="text-sm text-[#A07855]">在地图上找到附近的宠物友好地点</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="font-bold text-[#1E1209] text-lg mb-2">地图功能即将上线</h2>
        <p className="text-sm text-[#A07855] text-center leading-relaxed max-w-xs">
          我们正在开发基于地图的宠物友好地点发现功能，敬请期待
        </p>
        <div className="mt-6 bg-[#FFF0E2] border border-[#F5C49A] rounded-2xl px-5 py-3 text-sm text-[#E0813D] font-medium">
          Coming Soon ✨
        </div>
      </div>
    </div>
  )
}
