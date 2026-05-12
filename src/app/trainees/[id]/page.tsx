import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import TimelineItem from '@/components/evaluation/TimelineItem'
import { getTraineeById, TRAINING_GROUP_LABELS, LEVEL_COLORS } from '@/data/trainees'
import { getEvaluationsByTraineeId } from '@/data/evaluations'
import { BadgeColor } from '@/types'
import { formatDate } from '@/lib/utils'
import { Phone, Mail, Calendar, LineChart, CirclePlus, Video, Users } from 'lucide-react'

export default async function TraineePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trainee = getTraineeById(Number(id))
  if (!trainee) notFound()

  const evaluations = getEvaluationsByTraineeId(trainee.id)
  const levelColor = (LEVEL_COLORS[trainee.level] ?? 'blue') as BadgeColor
  const groupLabel = TRAINING_GROUP_LABELS[trainee.trainingGroup]

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <Breadcrumb items={[{ label: 'Players', href: '/' }, { label: 'Player Profile' }]} />

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-100">
                {trainee.avatarUrl ? (
                  <Image
                    src={trainee.avatarUrl}
                    alt={trainee.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {trainee.name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{trainee.name}</h1>
                  <p className="text-sm text-gray-500 mb-3">Age : {trainee.age}</p>
                  <Badge label={trainee.level} color={levelColor} />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Link
                    href={`/performance-comparison?traineeId=${trainee.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#365c8e] text-white text-sm font-semibold hover:bg-[#2b4a72] transition-colors"
                  >
                    <LineChart size={16} />
                    Compare Progress
                  </Link>
                  <Link
                    href={`/session-evaluation/create?traineeId=${trainee.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6fbf45] text-white text-sm font-semibold hover:bg-[#59a036] transition-colors"
                  >
                    <CirclePlus size={16} />
                    New Evaluation
                  </Link>
                </div>
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-[#365c8e] shrink-0" />
                  {trainee.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 break-all">
                  <Mail size={16} className="text-[#365c8e] shrink-0" />
                  {trainee.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-[#365c8e] shrink-0" />
                  Training Group ({groupLabel})
                </div>
              </div>
            </div>
          </div>

          {/* Joined date corner */}
          <p className="absolute bottom-4 right-5 text-xs text-gray-400">
            Joined <span className="font-bold text-gray-600 ml-1">{formatDate(trainee.joinedAt)}</span>
          </p>
        </div>

        {/* Performance Timeline */}
        <section aria-labelledby="timelineHeading">
          <h2 id="timelineHeading" className="text-xl font-bold text-gray-900 mb-6">
            Performance Timeline
          </h2>

          {evaluations.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 gap-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                <Video size={28} className="text-gray-400" strokeWidth={1.25} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No Evaluations Yet</h3>
              <p className="text-sm text-gray-400 text-center max-w-xs">
                Start Tracking {trainee.name}'s Progress By Creating The First Evaluation.
              </p>
              <Link
                href={`/session-evaluation/create?traineeId=${trainee.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6fbf45] text-white text-sm font-semibold hover:bg-[#59a036] transition-colors"
              >
                <CirclePlus size={16} />
                New Evaluation
              </Link>
            </div>
          ) : (
            <div className="relative pl-11 before:content-[''] before:absolute before:left-[2.3125rem] before:top-0 before:bottom-0 before:w-0.5 before:bg-[#eeeeee]">
              {evaluations.map((evaluation) => (
                <TimelineItem key={evaluation.id} evaluation={evaluation} traineeId={trainee.id} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
