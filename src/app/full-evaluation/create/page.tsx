'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Button from '@/components/ui/Button'
import { getTraineeById, TRAINEES } from '@/data/trainees'
import { cn } from '@/lib/utils'
import {
  CloudUpload, X, Plus, Minus, Check, AlertCircle,
  FileVideo, CheckCircle2, CircleCheckBig
} from 'lucide-react'

const STROKES = [
  { name: 'Forehand', color: 'text-[#6fbf45]' },
  { name: 'Backhand', color: 'text-[#365c8e]' },
  { name: 'Serve', color: 'text-[#fd5303]' },
  { name: 'Volley', color: 'text-red-500' },
  { name: 'Overhead', color: 'text-purple-500' },
  { name: 'Return', color: 'text-amber-500' },
]

function ScoreSlider({ value, onChange, label, color }: { value: number; onChange: (v: number) => void; label: string; color?: string }) {
  const pct = (value / 10) * 100
  const trackStyle = {
    background: `linear-gradient(to right, #fd5303 ${pct}%, #e5e7eb ${pct}%)`,
  }
  return (
    <div className="flex items-center gap-3">
      <span className={cn('text-xs font-semibold w-20 shrink-0', color ?? 'text-gray-600')}>{label}</span>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="score-slider flex-1"
        style={trackStyle}
      />
      <span className="text-sm font-bold text-[#fd5303] w-10 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

interface StrokeData {
  name: string
  score: number
  notes: string
  whatsWorking: string[]
  needsImprovement: string[]
}

function FullCreateInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const traineeId = Number(searchParams.get('traineeId') ?? '1')
  const trainee = getTraineeById(traineeId) ?? TRAINEES[0]

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [activeStroke, setActiveStroke] = useState(STROKES[0].name)
  const [strokes, setStrokes] = useState<Record<string, StrokeData>>(
    Object.fromEntries(
      STROKES.map((s) => [s.name, { name: s.name, score: 7.0, notes: '', whatsWorking: [''], needsImprovement: [''] }])
    )
  )
  const [overallFeedback, setOverallFeedback] = useState('')
  const [overallScore, setOverallScore] = useState(7.5)
  const [submitted, setSubmitted] = useState(false)

  function updateStroke(name: string, key: keyof StrokeData, value: unknown) {
    setStrokes((prev) => ({ ...prev, [name]: { ...prev[name], [key]: value } }))
  }

  function addListItem(strokeName: string, field: 'whatsWorking' | 'needsImprovement') {
    const list = strokes[strokeName][field]
    updateStroke(strokeName, field, [...list, ''])
  }

  function updateListItem(strokeName: string, field: 'whatsWorking' | 'needsImprovement', idx: number, val: string) {
    const list = [...strokes[strokeName][field]]
    list[idx] = val
    updateStroke(strokeName, field, list)
  }

  function removeListItem(strokeName: string, field: 'whatsWorking' | 'needsImprovement', idx: number) {
    const list = strokes[strokeName][field].filter((_: string, i: number) => i !== idx)
    updateStroke(strokeName, field, list)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) setVideoFile(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => router.push(`/trainees/${traineeId}`), 2000)
  }

  const currentStroke = strokes[activeStroke]
  const currentStrokeColor = STROKES.find((s) => s.name === activeStroke)?.color ?? 'text-gray-700'

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-[#6fbf45] flex items-center justify-center">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Full Evaluation Saved!</h2>
        <p className="text-sm text-gray-500">Redirecting to player profile...</p>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trainees', href: '/' },
          { label: trainee.name, href: `/trainees/${traineeId}` },
          { label: 'New Full Evaluation' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Full Evaluation</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive stroke-by-stroke evaluation for {trainee.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Video Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">1. Upload Session Video</h2>
          {videoFile ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <FileVideo size={20} className="text-[#6fbf45]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{videoFile.name}</p>
                <p className="text-xs text-gray-500">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button type="button" onClick={() => setVideoFile(null)} className="p-1 hover:bg-green-100 rounded-lg">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                'flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                dragActive ? 'border-[#365c8e] bg-[#eef3fa]' : 'border-gray-300 hover:border-[#365c8e]/50 hover:bg-gray-50',
              )}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <CloudUpload size={36} className={dragActive ? 'text-[#365c8e]' : 'text-gray-400'} />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">Drag & drop video here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse — MP4, MOV, AVI up to 500MB</p>
              </div>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setVideoFile(file)
              }} />
            </label>
          )}
        </div>

        {/* Overall score + feedback */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">2. Overall Assessment</h2>
          <div className="flex flex-col gap-4">
            <ScoreSlider value={overallScore} onChange={setOverallScore} label="Overall Score" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Overall Feedback</label>
              <textarea
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                rows={3}
                placeholder="Overall evaluation summary and coaching notes..."
                className="px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Stroke-by-stroke */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">3. Stroke-by-Stroke Analysis</h2>

          {/* Stroke tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {STROKES.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveStroke(s.name)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all',
                  activeStroke === s.name
                    ? 'border-[#365c8e] bg-[#365c8e] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300',
                )}
              >
                {s.name}
                <span className="ml-2 text-xs opacity-70">{strokes[s.name].score.toFixed(1)}</span>
              </button>
            ))}
          </div>

          {/* Active stroke form */}
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-gray-50">
            <h3 className={cn('font-bold text-base', currentStrokeColor)}>{activeStroke}</h3>

            <ScoreSlider
              value={currentStroke.score}
              onChange={(v) => updateStroke(activeStroke, 'score', v)}
              label="Score"
              color={currentStrokeColor}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Notes</label>
              <textarea
                value={currentStroke.notes}
                onChange={(e) => updateStroke(activeStroke, 'notes', e.target.value)}
                rows={2}
                placeholder={`Observations on ${activeStroke}...`}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* What's working */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#6fbf45]">
                  <Check size={13} strokeWidth={2.5} /> What's Working
                </label>
                {currentStroke.whatsWorking.map((item: string, i: number) => (
                  <div key={i} className="flex gap-1.5">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem(activeStroke, 'whatsWorking', i, e.target.value)}
                      placeholder="Strength..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-[#6fbf45]"
                    />
                    {currentStroke.whatsWorking.length > 1 && (
                      <button type="button" onClick={() => removeListItem(activeStroke, 'whatsWorking', i)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 border border-gray-200">
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addListItem(activeStroke, 'whatsWorking')}
                  className="flex items-center gap-1.5 text-xs text-[#6fbf45] font-medium hover:underline w-fit">
                  <Plus size={12} /> Add
                </button>
              </div>

              {/* Needs improvement */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#fd5303]">
                  <AlertCircle size={13} strokeWidth={2.5} /> Needs Improvement
                </label>
                {currentStroke.needsImprovement.map((item: string, i: number) => (
                  <div key={i} className="flex gap-1.5">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem(activeStroke, 'needsImprovement', i, e.target.value)}
                      placeholder="Improvement area..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-[#fd5303]"
                    />
                    {currentStroke.needsImprovement.length > 1 && (
                      <button type="button" onClick={() => removeListItem(activeStroke, 'needsImprovement', i)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 border border-gray-200">
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addListItem(activeStroke, 'needsImprovement')}
                  className="flex items-center gap-1.5 text-xs text-[#fd5303] font-medium hover:underline w-fit">
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Score summary */}
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Score Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STROKES.map((s) => (
                <div key={s.name} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50">
                  <span className={cn('text-xs font-semibold', s.color)}>{s.name}</span>
                  <span className="text-xs font-bold text-[#fd5303]">{strokes[s.name].score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline-primary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary">
            <CircleCheckBig size={18} />
            Save Full Evaluation
          </Button>
        </div>
      </form>
    </>
  )
}

export default function FullEvalCreatePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-3xl py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <FullCreateInner />
        </Suspense>
      </main>
    </>
  )
}
