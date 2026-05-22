'use client'

import Link from 'next/link'
import { MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import RatingBadge from './RatingBadge'
import VerificationBadge from './VerificationBadge'
import { Place, TYPE_LABELS, TYPE_EMOJIS, CITY_LABELS } from '@/data/places'
import { TAG_COLORS } from '@/config/ratings'

interface PlaceCardProps {
  place: Place
  variant?: 'grid' | 'list'
}

export default function PlaceCard({ place, variant = 'grid' }: PlaceCardProps) {
  if (variant === 'list') {
    return (
      <Link href={`/places/${place.id}`} className="block">
        <div className="place-card bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(60,30,10,0.08)] flex gap-0">
          <div className="relative w-[120px] shrink-0 overflow-hidden">
            <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-[#1E1209] text-sm leading-tight truncate">
                {place.name}
              </h3>
              <ChevronRight size={14} className="text-[#C4A07E] shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs text-[#A07855]">
                {TYPE_EMOJIS[place.type]} {TYPE_LABELS[place.type]}
              </span>
              <span className="text-[#E8DCCB]">·</span>
              <span className="flex items-center gap-0.5 text-xs text-[#A07855]">
                <MapPin size={10} />
                {CITY_LABELS[place.city]} {place.district}
              </span>
            </div>
            <RatingBadge rating={place.rating} size="sm" />
            <div className="flex flex-wrap gap-1 mt-2">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`tag-pill ${
                    TAG_COLORS[tag] ?? 'bg-warm-100 text-[#7C5A42]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="place-card bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(60,30,10,0.08)]">
      <Link href={`/places/${place.id}`}>
        <div className="relative h-44 w-full overflow-hidden">
          <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Type badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-white/90 backdrop-blur-sm text-[#7C5A42] text-[10px] font-medium px-2 py-0.5 rounded-full">
              {TYPE_EMOJIS[place.type]} {TYPE_LABELS[place.type]}
            </span>
          </div>
          {/* Verification */}
          <div className="absolute top-2.5 right-2.5">
            <VerificationBadge status={place.verification.status} />
          </div>
          {/* City bottom-left */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="flex items-center gap-0.5 text-white/90 text-[10px]">
              <MapPin size={9} />
              {CITY_LABELS[place.city]} · {place.district}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-[#1E1209] text-sm mb-1.5 truncate">
            {place.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <RatingBadge rating={place.rating} size="sm" />
            {place.priceRange && (
              <span className="text-[10px] text-[#A07855]">{place.priceRange}</span>
            )}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`tag-pill ${
                  TAG_COLORS[tag] ?? 'bg-amber-50 text-amber-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* CTA buttons */}
      <div className="px-3 pb-3 flex gap-2">
        <Link
          href={`/places/${place.id}`}
          className="flex-1 text-center text-xs font-medium py-2 rounded-xl bg-[#FFF0E2] text-[#E0813D] border border-[#F5C49A] hover:bg-[#FFE4CC] transition-colors"
        >
          查看详情
        </Link>
        <button className="flex items-center justify-center gap-1 flex-1 text-xs font-medium py-2 rounded-xl bg-[#E0813D] text-white hover:bg-[#CC7030] transition-colors">
          <MessageCircle size={12} />
          微信咨询
        </button>
      </div>
    </div>
  )
}
