import Image from 'next/image'
import { Clip } from '@/types'
import { Play, Star, Eye, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { BadgeColor } from '@/types'
import { formatDate } from '@/lib/utils'

const SKILL_BADGE_COLOR: Record<string, BadgeColor> = {
  Beginner: 'yellow',
  'Adult Beginner': 'red',
  Intermediate: 'blue',
  Advanced: 'green',
}

interface ClipCardProps {
  clip: Clip
}

export default function ClipCard({ clip }: ClipCardProps) {
  const skillColor = clip.skillLevel ? (SKILL_BADGE_COLOR[clip.skillLevel] ?? 'blue') : 'blue'

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {clip.thumbnailUrl ? (
          <Image src={clip.thumbnailUrl} alt={clip.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="400px" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Play size={32} className="text-gray-400" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={20} className="text-[#365c8e] ml-0.5" fill="currentColor" />
          </div>
        </div>
        {/* Duration */}
        {clip.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium">
            {clip.duration}
          </div>
        )}
        {/* Skill level badge */}
        {clip.skillLevel && (
          <div className="absolute top-2 left-2">
            <Badge label={clip.skillLevel} color={skillColor} className="text-xs py-0.5 px-2" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{clip.title}</h3>

        {/* Coach info */}
        {clip.coachName && (
          <p className="text-xs text-gray-500">{clip.coachName}</p>
        )}

        {/* Category + stroke */}
        {(clip.category || clip.strokeType) && (
          <p className="text-xs text-gray-400">{[clip.category, clip.strokeType].filter(Boolean).join(' · ')}</p>
        )}

        {/* Tags */}
        {clip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {clip.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {clip.views.toLocaleString()}
            </span>
            {clip.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {clip.rating.toFixed(1)}
              </span>
            )}
          </div>
          <span>{formatDate(clip.uploadedAt)}</span>
        </div>
      </div>
    </article>
  )
}
