import { Star } from 'lucide-react'

interface RatingBadgeProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function RatingBadge({
  rating,
  size = 'md',
  showLabel = true,
}: RatingBadgeProps) {
  const stars = Math.round(rating)
  const sizeMap = {
    sm: { star: 10, text: 'text-xs', num: 'text-xs' },
    md: { star: 12, text: 'text-xs', num: 'text-sm' },
    lg: { star: 16, text: 'text-sm', num: 'text-base' },
  }
  const s = sizeMap[size]

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={s.star}
            className={
              i < stars ? 'fill-[#F0BE56] text-[#F0BE56]' : 'fill-[#E8DCCB] text-[#E8DCCB]'
            }
          />
        ))}
      </div>
      {showLabel && (
        <span className={`font-semibold text-[#1E1209] ${s.num}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
