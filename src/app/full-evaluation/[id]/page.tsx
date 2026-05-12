import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { ScoreBadge } from '@/components/ui/Badge'
import { getEvaluationById } from '@/data/evaluations'
import { getTraineeById } from '@/data/trainees'
import { getClipsByType } from '@/data/clips'
import { formatDate } from '@/lib/utils'
import { Calendar, Play, Check, AlertCircle, Paperclip, CirclePlus } from 'lucide-react'

const STROKE_COLORS: Record<string, string> = {
  Forehand: 'text-[#6fbf45]',
  Backhand: 'text-[#365c8e]',
  Serve: 'text-[#fd5303]',
  Volley: 'text-red-500',
  Overhead: 'text-purple-500',
  Return: 'text-amber-500',
  Footwork: 'text-emerald-600',
}

export default async function FullEvaluationViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const evaluation = getEvaluationById(Number(id))
  if (!evaluation || evaluation.type !== 'full') notFound()

  const trainee = getTraineeById(evaluation.traineeId)
  const refClips = getClipsByType('coach').slice(0, evaluation.refClipCount)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-4xl py-8">
        <Breadcrumb
          items={[
            { label: 'Trainees', href: '/' },
            { label: trainee?.name ?? 'Player', href: `/trainees/${evaluation.traineeId}` },
            { label: 'Full Evaluation' },
          ]}
        />

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Full Player Evaluation</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive stroke-by-stroke analysis of the trainee</p>
          </div>
          <Link
            href={`/full-evaluation/create?traineeId=${evaluation.traineeId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#365c8e] text-[#365c8e] text-sm font-semibold hover:bg-[#365c8e]/10 transition-colors shrink-0"
          >
            <CirclePlus size={16} />
            New Evaluation
          </Link>
        </div>

        {/* Segmented control */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-8 w-fit">
          <Link
            href={`/session-evaluation/${evaluation.id}`}
            className="px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Session Evaluation
          </Link>
          <span className="px-5 py-2 text-sm font-semibold bg-[#365c8e] text-white">Full Evaluation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Video */}
            {evaluation.videoUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                <video
                  src={evaluation.videoUrl}
                  poster={evaluation.thumbnailUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Evaluation meta */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    {trainee?.avatarUrl && (
                      <Image src={trainee.avatarUrl} alt={trainee.name} width={40} height={40} className="object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{trainee?.name}</p>
                    <time className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      {formatDate(evaluation.date)}
                    </time>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Overall Score</p>
                  <span className="text-2xl font-bold text-[#fd5303]">{evaluation.overallScore.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/10</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Coach Feedback</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{evaluation.coachFeedback}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-[#6fbf45] mb-3">
                    <Check size={16} strokeWidth={2.5} />
                    What's Working
                  </h4>
                  <ul className="space-y-1.5">
                    {evaluation.whatsWorking.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#6fbf45] mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-[#fd5303] mb-3">
                    <AlertCircle size={16} strokeWidth={2.5} />
                    Needs Improvement
                  </h4>
                  <ul className="space-y-1.5">
                    {evaluation.needsImprovement.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#fd5303] mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Stroke scores sidebar */}
          {evaluation.strokes && evaluation.strokes.length > 0 && (
            <aside className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Stroke Scores</h3>
                <div className="flex flex-col gap-3">
                  {evaluation.strokes.map((stroke) => (
                    <div key={stroke.name} className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${STROKE_COLORS[stroke.name] ?? 'text-gray-700'}`}>
                        {stroke.name}
                      </span>
                      <ScoreBadge score={stroke.score} color={stroke.color} />
                    </div>
                  ))}
                </div>

                {/* Average */}
                {evaluation.strokes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Average</span>
                    <span className="text-sm font-bold text-[#fd5303]">
                      {(evaluation.strokes.reduce((acc, s) => acc + s.score, 0) / evaluation.strokes.length).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Ref clips */}
              {refClips.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <Paperclip size={14} />
                    Reference Clips
                  </h3>
                  <div className="flex flex-col gap-2">
                    {refClips.map((clip) => (
                      <div key={clip.id} className="flex gap-2 items-center p-2 rounded-xl border border-gray-200">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {clip.thumbnailUrl && (
                            <Image src={clip.thumbnailUrl} alt="" fill className="object-cover" sizes="48px" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play size={10} className="text-white" fill="white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{clip.title}</p>
                          <p className="text-xs text-gray-400">{clip.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </main>
    </>
  )
}
