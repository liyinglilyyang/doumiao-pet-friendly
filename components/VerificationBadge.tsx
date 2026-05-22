import { CheckCircle2, Phone, Users } from 'lucide-react'
import { VerificationStatus } from '@/data/places'

interface VerificationBadgeProps {
  status: VerificationStatus
  size?: 'sm' | 'md'
}

const CONFIG = {
  onsite: {
    label: '已实地验证',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  phone: {
    label: '已电话确认',
    icon: Phone,
    className: 'bg-orange-50 text-orange-700 border border-orange-200',
  },
  user: {
    label: '用户投稿',
    icon: Users,
    className: 'bg-sky-50 text-sky-700 border border-sky-200',
  },
}

export default function VerificationBadge({
  status,
  size = 'sm',
}: VerificationBadgeProps) {
  const c = CONFIG[status]
  const Icon = c.icon
  const iconSize = size === 'sm' ? 10 : 12

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${c.className}`}
    >
      <Icon size={iconSize} />
      {c.label}
    </span>
  )
}
