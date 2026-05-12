'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { getTraineeById, TRAINEES } from '@/data/trainees'
import { cn } from '@/lib/utils'
import {
  Upload, Video, VideoOff, X, Check, AlertCircle,
  Sparkles, Paperclip, CheckCircle2, ChevronDown,
} from 'lucide-react'

const STROKE_OPTIONS = ['Forehand', 'Backhand', 'Volley', 'Serve', 'Smash']
const SKILL_OPTIONS = ['Adult Beginner', 'Beginner', 'Intermediate', 'Advanced']
const ANGLE_OPTIONS = ['Behind Player', 'Side View', 'Front View']

const WHATS_GOOD_ITEMS = ['Early Preparation', 'Smooth Swing', 'Good Follow-Through']
const NEEDS_ATTENTION_ITEMS = ['Racquet Back Late', 'Flat Swing Path', 'Late Racquet Prep', 'Poor Spacing']

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#e7e7e7] bg-[#f8f9fb] cursor-pointer hover:border-[#365c8e] transition-colors"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v) }}
        role="combobox"
        aria-expanded={open}
      >
        <span className={value ? 'text-black font-bold text-sm' : 'text-[#868686] text-sm'}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={cn('text-[#868686] transition-transform duration-200', open && 'rotate-180')} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e7e7e7] rounded-xl shadow-lg z-30 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={cn(
                'w-full text-left px-4 py-2 text-sm hover:bg-[#f8f9fb] transition-colors',
                value === opt ? 'font-bold text-[#365c8e]' : 'text-black',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AngleGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const idx = Math.max(0, options.indexOf(value))
  const trackWidth = `${100 / options.length}%`
  const trackLeft = `${(idx * 100) / options.length}%`

  return (
    <div className="relative flex rounded-[2rem] bg-[#f8f9fb] w-full h-8">
      <div
        className="absolute top-0 h-8 rounded-[2rem] bg-[#6fbf45] shadow-sm transition-all duration-300 pointer-events-none"
        style={{ width: trackWidth, left: trackLeft }}
        aria-hidden="true"
      />
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'relative flex-1 z-10 text-[0.8125rem] text-center rounded-[2rem] border-0 bg-transparent cursor-pointer transition-colors duration-200 px-2 py-1',
            value === opt ? 'text-white font-bold' : 'text-black',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SeRange({
  value,
  onChange,
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
}) {
  const fillPct = (value / 10) * 100
  return (
    <input
      type="range"
      className={cn('se-range', readOnly && 'se-range--preview')}
      min={0}
      max={10}
      step={0.5}
      value={value}
      onChange={onChange ? (e) => onChange(parseFloat(e.target.value)) : undefined}
      readOnly={readOnly}
      tabIndex={readOnly ? -1 : undefined}
      aria-hidden={readOnly}
      style={{ '--fill': `${fillPct}%` } as React.CSSProperties}
    />
  )
}

function SeCheck({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
          checked ? 'bg-[#365c8e] border-[#365c8e]' : 'bg-white border-[#c8c8c8]',
        )}
      >
        {checked && <Check size={12} className="text-white" strokeWidth={2.5} />}
      </div>
      <span className="text-sm text-black">{label}</span>
    </label>
  )
}

function SessionCreateInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const traineeId = Number(searchParams.get('traineeId') ?? '1')
  const trainee = getTraineeById(traineeId) ?? TRAINEES[0]

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [strokeType, setStrokeType] = useState('')
  const [cameraAngle, setCameraAngle] = useState('Behind Player')
  const [generalRate, setGeneralRate] = useState(5)
  const [skillLevel, setSkillLevel] = useState('Adult Beginner')
  const [goodChecks, setGoodChecks] = useState<Record<string, boolean>>({ 'Good Follow-Through': true })
  const [attentionChecks, setAttentionChecks] = useState<Record<string, boolean>>({ 'Racquet Back Late': true })
  const [coachNotes, setCoachNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('video/')) {
      setVideoFile(file)
      setVideoObjectUrl(URL.createObjectURL(file))
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoObjectUrl(URL.createObjectURL(file))
    }
  }

  function removeVideo() {
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl)
    setVideoFile(null)
    setVideoObjectUrl(null)
  }

  function handleSave() {
    setSubmitted(true)
    setTimeout(() => router.push(`/trainees/${traineeId}`), 2000)
  }

  const selectedGood = WHATS_GOOD_ITEMS.filter((k) => goodChecks[k])
  const selectedAttention = NEEDS_ATTENTION_ITEMS.filter((k) => attentionChecks[k])

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-[#6fbf45] flex items-center justify-center">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-black">Evaluation Saved!</h2>
        <p className="text-sm text-[#868686]">Redirecting to player profile...</p>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trainees', href: '/' },
          { label: trainee.name, href: `/trainees/${traineeId}` },
          { label: 'Create Evaluation' },
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
        <h1 className="text-[2.5rem] font-bold text-black" style={{ letterSpacing: '-0.03em' }}>
          Create Evaluation
        </h1>
      </div>

      {/* Segmented control */}
      <div className="inline-flex rounded-[2rem] bg-[#f8f9fb] overflow-hidden mb-10">
        <button
          type="button"
          className="rounded-[2rem] border-0 bg-[#6fbf45] text-white font-bold px-6 py-2.5 text-base cursor-pointer"
        >
          Session Evaluation
        </button>
        <Link
          href={`/full-evaluation/create?traineeId=${traineeId}`}
          className="flex items-center justify-center rounded-[2rem] bg-transparent text-black px-6 py-2.5 text-base hover:text-black transition-colors"
        >
          Full Evaluation
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* ===== LEFT COLUMN ===== */}
        <div className="w-full lg:flex-[7] min-w-0">

          {/* Upload Trainee Video */}
          <section className="mb-10">
            <h2 className="font-bold text-base text-black mb-3">Upload Trainee Video</h2>
            {videoFile ? (
              <div className="relative border-none rounded-lg bg-[#f8f9fb] p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Video size={48} className="text-[#868686] shrink-0" />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="block font-bold text-base text-black truncate">{videoFile.name}</span>
                      <span className="text-sm text-[#868686]">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="flex items-center justify-center px-3 py-1.5 border border-[#365c8e] text-[#365c8e] bg-white rounded-[2rem] text-sm font-bold hover:bg-[#f8f9fb] transition-colors shrink-0"
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                className={cn(
                  'relative border-2 border-dashed border-[#6fbf45] rounded-lg bg-[#f8f9fb] py-6 px-4 text-center cursor-pointer block transition-all',
                  dragActive ? 'border-solid bg-[#edf2f7]' : '',
                )}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload size={28} className="text-[#365c8e] block mx-auto mb-2" />
                  <p className="font-bold text-base mb-1">Drag Your File To Start Uploading</p>
                  <p className="text-sm text-[#868686] mb-2">OR</p>
                  <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-[#365c8e] text-[#365c8e] bg-white rounded-[2rem] text-sm font-bold hover:bg-[#f8f9fb] transition-colors">
                    Browse files
                  </span>
                </div>
                <input type="file" accept="video/*" className="absolute w-0 h-0 opacity-0 pointer-events-none" onChange={handleFileInput} />
              </label>
            )}
          </section>

          {/* Stroke Type / Camera Angle / General Rate / Skill Level */}
          <section className="flex flex-col gap-7 mb-10">

            {/* Stroke Type */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="font-bold text-[1.25rem] text-black md:min-w-[10rem] md:w-[10rem] shrink-0">
                Stroke Type
              </label>
              <div className="flex-1">
                <CustomSelect
                  options={STROKE_OPTIONS}
                  value={strokeType}
                  onChange={setStrokeType}
                  placeholder="Select Stroke"
                />
              </div>
            </div>

            {/* Camera Angle */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="font-bold text-[1.25rem] text-black md:min-w-[10rem] md:w-[10rem] shrink-0">
                Camera Angle
              </label>
              <div className="flex-1">
                <AngleGroup options={ANGLE_OPTIONS} value={cameraAngle} onChange={setCameraAngle} />
              </div>
            </div>

            {/* General Rate */}
            <div className="flex flex-col md:flex-row gap-3">
              <label className="font-bold text-[1.25rem] text-black md:min-w-[10rem] md:w-[10rem] shrink-0 md:pt-2">
                General Rate
              </label>
              <div className="flex-1">
                <div className="flex justify-end mb-1">
                  <span className="font-bold text-sm text-[#0a2a35]">{generalRate.toFixed(1)}</span>
                </div>
                <SeRange value={generalRate} onChange={setGeneralRate} />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#868686] uppercase tracking-widest">Needs Focus</span>
                  <span className="text-xs text-[#868686] uppercase tracking-widest">Excellent</span>
                </div>
              </div>
            </div>

            {/* Skill Level */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="font-bold text-[1.25rem] text-black md:min-w-[10rem] md:w-[10rem] shrink-0">
                Skill Level
              </label>
              <div className="flex-1">
                <CustomSelect
                  options={SKILL_OPTIONS}
                  value={skillLevel}
                  onChange={setSkillLevel}
                  placeholder="Select Skill Level"
                />
              </div>
            </div>
          </section>

          {/* What's Good / Needs Attention */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Check size={24} strokeWidth={2} className="text-[#41a945]" />
                What's Good
              </h3>
              <div className="flex flex-col gap-3">
                {WHATS_GOOD_ITEMS.map((item) => (
                  <SeCheck
                    key={item}
                    label={item}
                    checked={!!goodChecks[item]}
                    onChange={(v) => setGoodChecks((prev) => ({ ...prev, [item]: v }))}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <AlertCircle size={24} strokeWidth={2} className="text-[#fd5303]" />
                Needs Attention
              </h3>
              <div className="flex flex-col gap-3">
                {NEEDS_ATTENTION_ITEMS.map((item) => (
                  <SeCheck
                    key={item}
                    label={item}
                    checked={!!attentionChecks[item]}
                    onChange={(v) => setAttentionChecks((prev) => ({ ...prev, [item]: v }))}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Coach's Notes */}
          <section className="mb-10">
            <h2 className="font-bold text-base text-black mb-3">Coach's Notes</h2>
            <div className="relative">
              <textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                placeholder="Enter Your Notes Here....."
                className="w-full min-h-[10rem] px-6 py-6 rounded-[1.5rem] bg-[#f8f9fb] border border-[#f0f0f0] text-base text-black outline-none resize-none focus:border-[#365c8e]/40 focus:shadow-[0_0_0_3px_rgba(54,92,142,0.15)] transition-shadow"
              />
              <button
                type="button"
                className="absolute bottom-5 right-5 flex items-center gap-2 px-3 py-1.5 border border-[#e7e7e7] bg-white text-black rounded-[2rem] text-sm shadow-sm hover:bg-[#f8f9fb] transition-colors"
              >
                <Sparkles size={18} />
                Generate with AI
              </button>
            </div>
          </section>

          {/* Reference Clips */}
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold mb-1">Reference Clips</h2>
              <p className="text-[#868686] text-sm mb-0">
                Attach clips from Pro Library, Coach Clips, or Player Library
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-[#fd5303] text-[#fd5303] bg-white rounded-lg font-bold text-sm hover:bg-[#f8f9fb] transition-colors shrink-0"
            >
              <Paperclip size={20} />
              Add Clip
            </button>
          </section>
          <div className="mb-10 pb-10 border-b border-[#e7e7e7]" />
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="w-full lg:flex-[5] min-w-0">
          <h2 className="text-[1.625rem] font-bold text-black mb-4">Trainee Preview</h2>

          <div className="bg-[#f8f9fb] rounded-[2.5rem] p-6 lg:p-10 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">

            {/* Video preview */}
            <div
              className="relative rounded-[1.5rem] overflow-hidden bg-[#0a2a35]"
              style={{ aspectRatio: '16/9' }}
            >
              {videoObjectUrl ? (
                <video
                  src={videoObjectUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-[#0a2a35] rounded-[1.5rem]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-[#868686] text-center p-8">
                  <VideoOff size={40} />
                  <p className="mt-2 font-bold">Upload a video to preview</p>
                </div>
              )}
            </div>

            {/* Trainer Evaluation */}
            <div>
              <h3 className="text-lg font-bold mb-2">Trainer Evaluation</h3>
              <div className="flex justify-end mb-1">
                <span className="font-bold text-sm text-[#0a2a35]">{generalRate.toFixed(1)}</span>
              </div>
              <SeRange value={generalRate} readOnly />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#868686] uppercase tracking-widest">Needs Focus</span>
                <span className="text-xs text-[#868686] uppercase tracking-widest">Excellent</span>
              </div>
            </div>

            {/* What's Good / Needs Attention preview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-base text-black flex items-center gap-1.5 mb-2">
                  <Check size={20} strokeWidth={2} className="text-[#41a945]" />
                  What's Good
                </h4>
                <ul className="list-none pl-4 space-y-1">
                  {selectedGood.length > 0
                    ? selectedGood.map((g) => <li key={g} className="text-sm text-[#868686]">{g}</li>)
                    : <li className="text-sm text-[#868686]">—</li>
                  }
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base text-black flex items-center gap-1.5 mb-2">
                  <AlertCircle size={20} strokeWidth={2} className="text-[#fd5303]" />
                  Needs Attention
                </h4>
                <ul className="list-none pl-4 space-y-1">
                  {selectedAttention.length > 0
                    ? selectedAttention.map((a) => <li key={a} className="text-sm text-[#868686]">{a}</li>)
                    : <li className="text-sm text-[#868686]">—</li>
                  }
                </ul>
              </div>
            </div>

            {/* Coach's Notes preview */}
            <div>
              <h3 className="font-bold text-base text-black mb-1">Coach's Notes</h3>
              <p className="text-sm text-[#868686]">{coachNotes || '—'}</p>
            </div>

            {/* Example Clips */}
            <div>
              <h3 className="font-bold text-base text-black mb-1">Example Clips</h3>
              <span className="text-sm text-[#868686]">No clips selected</span>
            </div>

            {/* Recommended Classes */}
            <div>
              <h3 className="font-bold text-base text-black mb-1">Recommended Classes</h3>
              <span className="text-sm text-[#868686]">None selected</span>
            </div>

            {/* Recommended Coaches */}
            <div>
              <h3 className="font-bold text-base text-black mb-1">Recommended Coaches</h3>
              <span className="text-sm text-[#868686]">None selected</span>
            </div>
          </div>

          {/* Sticky Save */}
          <div className="sticky bottom-0 z-20 flex justify-end mt-8 pt-4 bg-white w-full">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2.5 bg-[#6fbf45] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#5aaa36] transition-colors w-full lg:w-auto"
            >
              <CheckCircle2 size={24} strokeWidth={2} />
              Save Evaluation
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function SessionCreatePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-[1200px] py-8 mb-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SessionCreateInner />
        </Suspense>
      </main>
    </>
  )
}
