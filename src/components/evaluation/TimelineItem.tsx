import Link from 'next/link'
import Image from 'next/image'
import { Evaluation } from '@/types'
import { ScoreBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Calendar, Play, Check, AlertCircle, Paperclip } from 'lucide-react'

interface TimelineItemProps {
  evaluation: Evaluation
  traineeId: number
}

export default function TimelineItem({ evaluation, traineeId }: TimelineItemProps) {
  const isSession = evaluation.type === 'session'
  const href = isSession
    ? `/session-evaluation/${evaluation.id}`
    : `/full-evaluation/${evaluation.id}`

  return (
    <article className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className="z-10 w-6 h-6 rounded-full bg-white border-2 border-[#6fbf45] flex items-center justify-center shrink-0 mt-1">
          <Check size={12} className="text-[#6fbf45]" strokeWidth={3} />
        </div>
        {/* Vertical line */}
        <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200" />
      </div>

      {/* Card */}
      <Link
        href={href}
        className={`flex-1 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3 ${
          isSession ? 'border-blue-100' : 'border-green-100'
        }`}
        aria-label={`Open ${evaluation.title} details`}
      >
        {/* Top: thumbnail + title + score */}
        <div className="flex gap-3 items-start">
          {evaluation.thumbnailUrl && (
            <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={evaluation.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={14} className="text-[#365c8e] ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{evaluation.title}</h3>
            <time className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar size={12} />
              {formatDate(evaluation.date)}
            </time>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-1">Overall Score</p>
            <span className="text-xl font-bold text-[#fd5303]">{evaluation.overallScore.toFixed(1)}</span>
          </div>
        </div>

        {/* Coach feedback line */}
        {isSession && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Coach Feedback</span>
            <span className="font-semibold text-gray-700">{evaluation.coachRating.toFixed(1)}/10</span>
          </div>
        )}

        {/* Coach body text */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{evaluation.coachFeedback}</p>

        {/* What's working + Needs improvement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#6fbf45] mb-1.5">
              <Check size={13} strokeWidth={2.5} />
              What's Working
            </h4>
            {evaluation.whatsWorking.slice(0, 2).map((item, i) => (
              <p key={i} className="text-xs text-gray-600 leading-relaxed">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#fd5303] mb-1.5">
              <AlertCircle size={13} strokeWidth={2.5} />
              Needs Improvement
            </h4>
            {evaluation.needsImprovement.slice(0, 2).map((item, i) => (
              <p key={i} className="text-xs text-gray-600 leading-relaxed">{item}</p>
            ))}
          </div>
        </div>

        {/* Full eval stroke scores */}
        {!isSession && evaluation.strokes && evaluation.strokes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
            {evaluation.strokes.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">{s.name}</span>
                <ScoreBadge score={s.score} color={s.color} />
              </div>
            ))}
          </div>
        )}

        {/* Footer: ref clips */}
        {evaluation.refClipCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
            <Paperclip size={12} />
            Reference Clip(s) Attached
          </div>
        )}
      </Link>
    </article>
  )
}
