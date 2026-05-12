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
    <article className="relative pb-10 last:pb-0 pl-28">
      {/* Timeline dot — absolute, anchored to left */}
      <div className="absolute left-0 top-0 z-10 w-[4.625rem] h-[4.625rem] rounded-full bg-white shadow-[0_1.4rem_3.063rem_0_rgba(0,0,0,0.08)] border-[3px] border-white flex items-center justify-center text-[#41a945]">
        <Check size={26} strokeWidth={2.5} />
      </div>

      {/* Card */}
      <Link
        href={href}
        className={`block bg-white rounded-[2rem] shadow-[0_1.4rem_3.063rem_0_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-shadow px-8 py-7 flex flex-col gap-4 ${
          isSession ? '' : 'border-2 border-[#365c8e]'
        }`}
        aria-label={`Open ${evaluation.title} details`}
      >
        {/* Top: thumbnail + title + score */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start mb-1">
          {evaluation.thumbnailUrl && (
            <div className="relative w-[7.5rem] h-[5.25rem] rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={evaluation.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-9 h-9 rounded-full bg-[#fd5303] flex items-center justify-center">
                  <Play size={14} className="text-white ml-0.5" fill="currentColor" />
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
            <span className="text-2xl font-bold text-[#fd5303]">{evaluation.overallScore.toFixed(1)}</span>
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

        {/* Full eval stroke scores sidebar panel */}
        {!isSession && evaluation.strokes && evaluation.strokes.length > 0 && (
          <div className="bg-[#f8f9fb] rounded-[1rem] flex flex-col overflow-hidden">
            {evaluation.strokes.map((s, idx) => (
              <div
                key={s.name}
                className={`flex items-center justify-between px-6 py-2 ${idx < evaluation.strokes!.length - 1 ? 'border-b border-white' : ''}`}
              >
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
