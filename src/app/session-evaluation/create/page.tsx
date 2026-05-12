'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Button from '@/components/ui/Button'
import { getTraineeById, TRAINEES } from '@/data/trainees'
import { cn } from '@/lib/utils'
import {
  CloudUpload, X, Plus, Minus, CheckCircle2, CircleCheckBig,
  FileVideo, Check, AlertCircle, Star
} from 'lucide-react'

const STROKES = ['Forehand', 'Backhand', 'Serve', 'Volley', 'Overhead', 'Return', 'Footwork']

function ScoreSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const pct = (value / 10) * 100
  const trackStyle = {
    background: `linear-gradient(to right, #fd5303 ${pct}%, #e5e7eb ${pct}%)`,
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
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

function SessionCreateInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const traineeId = Number(searchParams.get('traineeId') ?? '1')
  const trainee = getTraineeById(traineeId) ?? TRAINEES[0]

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedStroke, setSelectedStroke] = useState('Forehand')
  const [coachNotes, setCoachNotes] = useState('')
  const [whatsWorking, setWhatsWorking] = useState([''])
  const [improvements, setImprovements] = useState([''])
  const [overallScore, setOverallScore] = useState(7.5)
  const [coachRating, setCoachRating] = useState(7.5)
  const [submitted, setSubmitted] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) setVideoFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setVideoFile(file)
  }

  function addListItem(list: string[], setList: (v: string[]) => void) {
    setList([...list, ''])
  }

  function removeListItem(list: string[], setList: (v: string[]) => void, idx: number) {
    setList(list.filter((_, i) => i !== idx))
  }

  function updateListItem(list: string[], setList: (v: string[]) => void, idx: number, val: string) {
    const next = [...list]
    next[idx] = val
    setList(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => router.push(`/trainees/${traineeId}`), 2000)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-[#6fbf45] flex items-center justify-center">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Evaluation Saved!</h2>
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
          { label: 'New Session Evaluation' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Session Evaluation</h1>
        <p className="text-sm text-gray-500 mt-1">Create a video evaluation for {trainee.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step 1: Video Upload */}
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
              <input type="file" accept="video/*" className="hidden" onChange={handleFileInput} />
            </label>
          )}
        </div>

        {/* Step 2: Session Details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">2. Session Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Trainee</label>
              <select className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] bg-white">
                {TRAINEES.map((t) => (
                  <option key={t.id} value={t.id} selected={t.id === traineeId}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Session Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e]"
              />
            </div>
          </div>

          {/* Stroke selection */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Primary Stroke Focus</label>
            <div className="flex flex-wrap gap-2">
              {STROKES.map((stroke) => (
                <button
                  key={stroke}
                  type="button"
                  onClick={() => setSelectedStroke(stroke)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all',
                    selectedStroke === stroke
                      ? 'border-[#365c8e] bg-[#365c8e] text-white'
                      : 'border-gray-300 text-gray-600 hover:border-[#365c8e]/50',
                  )}
                >
                  {stroke}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Coaching Notes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">3. Coaching Notes</h2>

          <div className="flex flex-col gap-4">
            {/* Coach body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Overall Feedback</label>
              <textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                rows={4}
                placeholder="Describe the session, player's performance, key observations..."
                className="px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#365c8e] resize-none"
              />
            </div>

            {/* What's working */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#6fbf45]">
                <Check size={14} strokeWidth={2.5} />
                What's Working
              </label>
              {whatsWorking.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(whatsWorking, setWhatsWorking, i, e.target.value)}
                    placeholder="e.g. Excellent racket preparation timing"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#6fbf45]"
                  />
                  {whatsWorking.length > 1 && (
                    <button type="button" onClick={() => removeListItem(whatsWorking, setWhatsWorking, i)}
                      className="p-2 rounded-xl hover:bg-red-50 text-red-400 border border-gray-200">
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem(whatsWorking, setWhatsWorking)}
                className="flex items-center gap-2 text-sm text-[#6fbf45] font-medium hover:underline w-fit">
                <Plus size={14} /> Add item
              </button>
            </div>

            {/* Needs improvement */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#fd5303]">
                <AlertCircle size={14} strokeWidth={2.5} />
                Needs Improvement
              </label>
              {improvements.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(improvements, setImprovements, i, e.target.value)}
                    placeholder="e.g. Racquet back late on backhand"
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#fd5303]"
                  />
                  {improvements.length > 1 && (
                    <button type="button" onClick={() => removeListItem(improvements, setImprovements, i)}
                      className="p-2 rounded-xl hover:bg-red-50 text-red-400 border border-gray-200">
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addListItem(improvements, setImprovements)}
                className="flex items-center gap-2 text-sm text-[#fd5303] font-medium hover:underline w-fit">
                <Plus size={14} /> Add item
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Scores */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">4. Scores</h2>
          <div className="flex flex-col gap-4">
            <ScoreSlider value={overallScore} onChange={setOverallScore} label="Overall Score" />
            <ScoreSlider value={coachRating} onChange={setCoachRating} label="Coach Rating" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline-primary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary">
            <CircleCheckBig size={18} />
            Save Evaluation
          </Button>
        </div>
      </form>
    </>
  )
}

export default function SessionCreatePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-3xl py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SessionCreateInner />
        </Suspense>
      </main>
    </>
  )
}
