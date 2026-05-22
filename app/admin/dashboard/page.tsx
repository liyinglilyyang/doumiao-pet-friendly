// TODO: re-enable auth after Supabase login is confirmed working
import { getPlaces } from '@/lib/places'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { MapPin, CheckCircle2, Star, PlusCircle, TrendingUp } from 'lucide-react'
import { CITY_LABELS, CATEGORY_LABELS } from '@/lib/places'

export default async function AdminDashboard() {
  let places: Awaited<ReturnType<typeof getPlaces>> = []
  let dbError = false
  try {
    places = await getPlaces()
  } catch {
    dbError = true
  }

  const stats = {
    total: places.length,
    verified: places.filter((p) => p.verification_status === 'doumiao_verified').length,
    featured: places.filter((p) => p.is_featured).length,
    cities: [...new Set(places.map((p) => p.city))].length,
  }

  const cityBreakdown = (
    ['guangzhou', 'shenzhen', 'hongkong'] as const
  ).map((city) => ({
    city,
    label: CITY_LABELS[city],
    count: places.filter((p) => p.city === city).length,
  }))

  const catBreakdown = (
    ['cafe', 'restaurant', 'hotel', 'boarding', 'grooming', 'transport', 'park'] as const
  ).map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    count: places.filter((p) => p.category === cat).length,
  })).filter((c) => c.count > 0)

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-10 py-7 border-b border-[#EDE8E0] bg-white">
          <div>
            <h1 className="text-[28px] font-bold text-[#1E1209] leading-tight">概览</h1>
            <p className="text-[14px] text-[#A09080] mt-0.5">豆苗宠物友好后台管理系统</p>
          </div>
          <Link
            href="/admin/places/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E0813D] text-white rounded-xl text-[14px] font-medium hover:bg-[#CC7030] transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            新增商家
          </Link>
        </div>

        <div className="px-10 py-8">
          {dbError && (
            <div className="mb-7 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-[14px] text-amber-800">
              ⚠️ 数据库连接失败。请检查 Supabase 环境变量是否配置，以及 places 表是否已创建。
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {[
              { icon: MapPin, label: '收录商家', value: stats.total, color: 'text-[#E0813D]', bg: 'bg-[#FFF0E2]' },
              { icon: CheckCircle2, label: '豆苗认证', value: stats.verified, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Star, label: '首页推荐', value: stats.featured, color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: TrendingUp, label: '覆盖城市', value: stats.cities, color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-[#EDE8E0] p-6 shadow-[0_1px_4px_rgba(60,30,10,0.06)]">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="text-[32px] font-bold text-[#1E1209] leading-none mb-1">{value}</div>
                <div className="text-[13px] text-[#A09080]">{label}</div>
              </div>
            ))}
          </div>

          {/* Breakdown charts */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-[#EDE8E0] p-6 shadow-[0_1px_4px_rgba(60,30,10,0.06)]">
              <h2 className="text-[15px] font-semibold text-[#1E1209] mb-5">按城市分布</h2>
              <div className="space-y-4">
                {cityBreakdown.map(({ label, count, city }) => (
                  <div key={city} className="flex items-center gap-4">
                    <span className="text-[14px] text-[#6B5744] w-12 shrink-0">{label}</span>
                    <div className="flex-1 bg-[#F5EBD8] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#E0813D] rounded-full transition-all"
                        style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-[#1E1209] w-6 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDE8E0] p-6 shadow-[0_1px_4px_rgba(60,30,10,0.06)]">
              <h2 className="text-[15px] font-semibold text-[#1E1209] mb-5">按类型分布</h2>
              <div className="space-y-4">
                {catBreakdown.length === 0 ? (
                  <p className="text-[14px] text-[#C4A07E]">暂无数据</p>
                ) : catBreakdown.map(({ label, count, cat }) => (
                  <div key={cat} className="flex items-center gap-4">
                    <span className="text-[14px] text-[#6B5744] w-16 shrink-0">{label}</span>
                    <div className="flex-1 bg-[#F5EBD8] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#E0813D] rounded-full transition-all"
                        style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-[#1E1209] w-6 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent places */}
          {places.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EDE8E0] shadow-[0_1px_4px_rgba(60,30,10,0.06)]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EAE0]">
                <h2 className="text-[15px] font-semibold text-[#1E1209]">最近收录</h2>
                <Link href="/admin/places" className="text-[13px] text-[#E0813D] hover:underline">
                  查看全部 →
                </Link>
              </div>
              <div className="divide-y divide-[#F5EFE6]">
                {places.slice(0, 6).map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/places/${p.id}/edit`}
                    className="flex items-center gap-5 px-6 py-4 hover:bg-[#FAF7F2] transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5EBD8] shrink-0">
                      {(p.images ?? [])[0] ? (
                        <img src={p.images![0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[18px]">🐾</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[15px] text-[#1E1209] truncate group-hover:text-[#E0813D] transition-colors">{p.name}</div>
                      <div className="text-[12px] text-[#A09080]">
                        {CITY_LABELS[p.city]} · {CATEGORY_LABELS[p.category]}
                      </div>
                    </div>
                    <VerifBadge status={p.verification_status} />
                    {p.is_featured && (
                      <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        推荐
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function VerifBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    doumiao_verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    visited: 'bg-blue-50 text-blue-700 border-blue-200',
    phone_verified: 'bg-orange-50 text-orange-700 border-orange-200',
    unverified: 'bg-gray-50 text-gray-500 border-gray-200',
  }
  const labels: Record<string, string> = {
    doumiao_verified: '豆苗认证',
    visited: '已探访',
    phone_verified: '电话确认',
    unverified: '未验证',
  }
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${styles[status] ?? styles.unverified}`}>
      {labels[status] ?? status}
    </span>
  )
}
