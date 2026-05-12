import Link from 'next/link'
import Image from 'next/image'
import { Trainee } from '@/types'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import { LEVEL_COLORS, TRAINING_GROUP_LABELS } from '@/data/trainees'
import { formatDate } from '@/lib/utils'
import { BadgeColor } from '@/types'

interface TraineeCardProps {
  trainee: Trainee
}

export default function TraineeCard({ trainee }: TraineeCardProps) {
  const levelColor = (LEVEL_COLORS[trainee.level] ?? 'blue') as BadgeColor

  return (
    <Link
      href={`/trainees/${trainee.id}`}
      className="flex flex-col bg-white rounded-[2rem] border border-transparent shadow-[0_1.4rem_3.063rem_0_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 p-8 gap-3 min-h-[160px]"
    >
      {/* Top row: avatar + info */}
      <div className="flex gap-3 flex-1">
        <div className="relative shrink-0">
          <div className="w-[91px] h-[96px] rounded-[1rem] overflow-hidden bg-gray-100 flex-shrink-0">
            {trainee.avatarUrl ? (
              <Image
                src={trainee.avatarUrl}
                alt={trainee.name}
                width={91}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 bg-gray-200">
                {trainee.name[0]}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0 gap-1.5">
          <h2 className="font-bold text-gray-900 text-base truncate">{trainee.name}</h2>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Age : {trainee.age}</span>
            <StarRating rating={trainee.rating} size={14} />
          </div>
          <Badge label={trainee.level} color={levelColor} className="self-start" />
        </div>
      </div>

      {/* Bottom row: joined date */}
      <div className="flex justify-between items-center pt-2 border-t border-[#f8f9fb]">
        <span className="text-xs text-gray-400">Joined</span>
        <span className="text-xs text-gray-600 font-semibold">{formatDate(trainee.joinedAt)}</span>
      </div>
    </Link>
  )
}
