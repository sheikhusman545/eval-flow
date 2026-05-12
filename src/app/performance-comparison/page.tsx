'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import { TRAINEES } from '@/data/trainees'
import { EVALUATIONS, formatDate } from '@/data/evaluations'
import { Evaluation } from '@/types'
import { cn } from '@/lib/utils'
import {
  CirclePlus, Video, Check, AlertCircle, TrendingUp, TrendingDown,
  Minus as MinusIcon, Calendar, ChevronRight
} from 'lucide-react'

type WizardStep = 'select' | 'result'

function ScoreDelta({ a, b }: { a: number; b: number }) {
  const diff = b - a
  if (Math.abs(diff) < 0.05) return <span className="flex items-center gap-1 text-gray-400 text-xs"><MinusIcon size={12} /> No change</span>
  return diff > 0
    ? <span className="flex items-center gap-1 text-[#6fbf45] text-xs font-semibold"><TrendingUp size={12} />+{diff.toFixed(1)}</span>
    : <span className="flex items-center gap-1 text-red-500 text-xs font-semibold"><TrendingDown size={12} />{diff.toFixed(1)}</span>
}

function EvalPanel({ eval: ev, label }: { eval: Evaluation; label: string }) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
        <time className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={12} />
          {formatDate(ev.date)}
        </time>
      </div>

      {/* Video thumbnail */}
      {ev.thumbnailUrl && (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
          <Image src={ev.thumbnailUrl} alt="" fill className="object-cover" sizes="500px" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Video size={28} className="text-white" />
          </div>
        </div>
      )}

      {/* Score */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Overall Score</p>
          <span className="text-2xl font-bold text-[#fd5303]">{ev.overallScore.toFixed(1)}</span>
          <span className="text-xs text-gray-400">/10</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">Coach Rating</p>
          <StarRating rating={Math.round(ev.coachRating / 2)} />
        </div>
      </div>

      {/* What's working */}
      <div>
        <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#6fbf45] mb-2">
          <Check size={12} strokeWidth={2.5} /> What's Good
        </h4>
        <ul className="space-y-1">
          {ev.whatsWorking.map((item, i) => (
            <li key={i} className="text-xs text-gray-600">{item}</li>
          ))}
        </ul>
      </div>

      {/* Needs improvement */}
      <div>
        <h4 className="flex items-center gap-1.5 text-xs font-bold text-[#fd5303] mb-2">
          <AlertCircle size={12} strokeWidth={2.5} /> Needs Improvement
        </h4>
        <ul className="space-y-1">
          {ev.needsImprovement.map((item, i) => (
            <li key={i} className="text-xs text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PerformanceComparisonInner() {
  const searchParams = useSearchParams()
  const traineeId = Number(searchParams.get('traineeId') ?? '0')

  const [step, setStep] = useState<WizardStep>('select')
  const [selectedTraineeId, setSelectedTraineeId] = useState<number>(traineeId || 0)
  const [evalA, setEvalA] = useState<number>(0)
  const [evalB, setEvalB] = useState<number>(0)

  const traineeEvals = selectedTraineeId
    ? EVALUATIONS.filter((e) => e.traineeId === selectedTraineeId).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    : []

  const evalAObj = EVALUATIONS.find((e) => e.id === evalA)
  const evalBObj = EVALUATIONS.find((e) => e.id === evalB)

  function handleCompare() {
    if (evalAObj && evalBObj) setStep('result')
  }

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Comparison</h1>
          <p className="text-sm text-gray-500 mt-1">Compare Two Evaluations Side-By-Side To Track Progress Over Time</p>
        </div>
        {step === 'result' && (
          <Button variant="secondary" onClick={() => setStep('select')}>
            <CirclePlus size={18} />
            New Comparison
          </Button>
        )}
      </div>

      {step === 'select' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <h2 className="text-base font-bold text-gray-900 mb-6">Select Evaluations To Compare</h2>

          {/* Trainee select */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-semibold text-gray-700">Trainee</label>
            <select
              value={selectedTraineeId}
              onChange={(e) => { setSelectedTraineeId(Number(e.target.value)); setEvalA(0); setEvalB(0) }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] bg-white"
            >
              <option value={0}>Select a trainee...</option>
              {TRAINEES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {selectedTraineeId > 0 && traineeEvals.length >= 2 && (
            <>
              {/* Eval A */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-semibold text-gray-700">Earlier Evaluation</label>
                <select
                  value={evalA}
                  onChange={(e) => setEvalA(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] bg-white"
                >
                  <option value={0}>Select evaluation...</option>
                  {traineeEvals.map((e) => (
                    <option key={e.id} value={e.id}>{e.title} — {formatDate(e.date)}</option>
                  ))}
                </select>
              </div>

              {/* Eval B */}
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-sm font-semibold text-gray-700">Later Evaluation</label>
                <select
                  value={evalB}
                  onChange={(e) => setEvalB(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] bg-white"
                >
                  <option value={0}>Select evaluation...</option>
                  {traineeEvals.filter((e) => e.id !== evalA).map((e) => (
                    <option key={e.id} value={e.id}>{e.title} — {formatDate(e.date)}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCompare}
                disabled={!evalA || !evalB}
              >
                <ChevronRight size={18} />
                Compare Evaluations
              </Button>
            </>
          )}

          {selectedTraineeId > 0 && traineeEvals.length < 2 && (
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <Video size={32} className="text-gray-400" strokeWidth={1.25} />
              <p className="text-sm text-gray-500">This trainee needs at least 2 evaluations to compare.</p>
            </div>
          )}

          {!selectedTraineeId && (
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <Video size={40} className="text-gray-300" strokeWidth={1.25} />
              <h3 className="text-base font-bold text-gray-600">No Comparisons Yet</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Select a trainee and two evaluations above to start tracking progress.
              </p>
            </div>
          )}
        </div>
      )}

      {step === 'result' && evalAObj && evalBObj && (
        <div className="flex flex-col gap-6">
          {/* Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EvalPanel eval={evalAObj} label="Earlier Evaluation" />
            <EvalPanel eval={evalBObj} label="Later Evaluation" />
          </div>

          {/* Progress summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Progress Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Overall Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-600">{evalAObj.overallScore.toFixed(1)}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-sm font-bold text-[#365c8e]">{evalBObj.overallScore.toFixed(1)}</span>
                  </div>
                </div>
                <ScoreDelta a={evalAObj.overallScore} b={evalBObj.overallScore} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Coach Rating</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-600">{evalAObj.coachRating.toFixed(1)}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-sm font-bold text-[#365c8e]">{evalBObj.coachRating.toFixed(1)}</span>
                  </div>
                </div>
                <ScoreDelta a={evalAObj.coachRating} b={evalBObj.coachRating} />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Time Between Evaluations</p>
                  <p className="text-sm font-bold text-gray-700">
                    {Math.round(Math.abs(new Date(evalBObj.date).getTime() - new Date(evalAObj.date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(evalAObj.date)} → {formatDate(evalBObj.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function PerformanceComparisonPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PerformanceComparisonInner />
        </Suspense>
      </main>
    </>
  )
}
