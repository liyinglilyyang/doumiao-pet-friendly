import Link from 'next/link'

const CATEGORIES = [
  {
    type: 'hotel',
    emoji: '🏨',
    title: '宠物友好酒店',
    subtitle: '带宠出行，安心入住',
    color: 'from-amber-50 to-orange-50',
    border: 'border-orange-100',
  },
  {
    type: 'restaurant',
    emoji: '🍽️',
    title: '宠物友好餐厅',
    subtitle: '一起吃饭，共享时光',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-100',
  },
  {
    type: 'cafe',
    emoji: '☕',
    title: '宠物友好咖啡',
    subtitle: '周末遛狗好去处',
    color: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-100',
  },
  {
    type: 'boarding',
    emoji: '🏠',
    title: '宠物寄养',
    subtitle: '安心托管，专业照护',
    color: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
  },
  {
    type: 'service',
    emoji: '🛎️',
    title: '上门服务',
    subtitle: '喂养 / 遛狗 / 美容',
    color: 'from-sky-50 to-blue-50',
    border: 'border-sky-100',
  },
  {
    type: 'transport',
    emoji: '🚗',
    title: '宠物运输',
    subtitle: '跨城 / 跨境安全接送',
    color: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.type}
          href={`/places?type=${cat.type}`}
          className={`rounded-2xl p-4 bg-gradient-to-br ${cat.color} border ${cat.border} hover:shadow-md transition-shadow active:scale-[0.98]`}
        >
          <div className="text-2xl mb-2">{cat.emoji}</div>
          <div className="font-semibold text-[#1E1209] text-sm leading-tight mb-0.5">
            {cat.title}
          </div>
          <div className="text-[11px] text-[#A07855]">{cat.subtitle}</div>
        </Link>
      ))}
    </div>
  )
}
