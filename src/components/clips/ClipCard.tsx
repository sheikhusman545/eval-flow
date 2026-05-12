'use client'

import { useRef, useState } from 'react'
import { RotateCcw, RotateCw, Play, Pause, Maximize2 } from 'lucide-react'
import { Clip } from '@/types'
import { formatDate } from '@/lib/utils'

const SKILL_TAG_COLOR: Record<string, string> = {
  Beginner: 'border-[#a16207] bg-[#fef9c3] text-[#a16207]',
  'Adult Beginner': 'border-[#e11d48] bg-[#fff1f2] text-[#e11d48]',
  Intermediate: 'border-[#1d4ed8] bg-[#dbeafe] text-[#1d4ed8]',
  Advanced: 'border-[#166534] bg-[#dcfce7] text-[#166534]',
}

const STROKE_TAG_COLOR: Record<string, string> = {
  Forehand: 'border-[#166534] bg-[#dcfce7] text-[#166534]',
  Backhand: 'border-[#1d4ed8] bg-[#dbeafe] text-[#1d4ed8]',
  Volley: 'border-[#e11d48] bg-[#fff1f2] text-[#e11d48]',
  Serve: 'border-[#5c6bc0] bg-[#e8eaf6] text-[#5c6bc0]',
  Smash: 'border-[#fd5303] bg-[#fcf0dc] text-[#fd5303]',
}

const ANGLE_TAG = 'border-[#26a69a] bg-[#e0f2f1] text-[#26a69a]'
const CATEGORY_TAG = 'border-[#5c6bc0] bg-[#e8eaf6] text-[#5c6bc0]'

interface ClipCardProps {
  clip: Clip
}

export default function ClipCard({ clip }: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  function skip(sec: number) {
    const v = videoRef.current
    if (v) v.currentTime = Math.max(0, v.currentTime + sec)
  }

  return (
    <article className="bg-white rounded-[1rem] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-200">
      {/* Media */}
      <div className="relative bg-black" style={{ aspectRatio: '16/10' }}>
        <video
          ref={videoRef}
          src={clip.videoUrl}
          poster={clip.thumbnailUrl}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          onEnded={() => setPlaying(false)}
        />

        {/* Expand button */}
        <button
          type="button"
          className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(54,92,142,0.15)] text-white/80 hover:text-white hover:scale-105 transition-all border-0"
          aria-label="Expand video"
        >
          <Maximize2 size={18} />
        </button>

        {/* Controls overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-gradient-to-b from-transparent to-black/35 pointer-events-none">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); skip(-10) }}
            className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-white/90 text-[#365c8e] hover:bg-white transition-colors border-0"
            aria-label="Back 10 seconds"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlay() }}
            className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center bg-white/90 text-[#365c8e] hover:bg-white transition-colors border-0"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); skip(10) }}
            className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-white/90 text-[#365c8e] hover:bg-white transition-colors border-0"
            aria-label="Forward 10 seconds"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h2 className="font-bold text-black text-base leading-snug m-0">{clip.title}</h2>

        {/* Badge tags */}
        <div className="flex flex-wrap gap-1.5">
          {clip.skillLevel && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-[1rem] text-xs border ${SKILL_TAG_COLOR[clip.skillLevel] ?? 'border-gray-300 text-gray-600'}`}>
              {clip.skillLevel}
            </span>
          )}
          {clip.category && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-[1rem] text-xs border ${CATEGORY_TAG}`}>
              {clip.category}
            </span>
          )}
          {clip.strokeType && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-[1rem] text-xs border ${STROKE_TAG_COLOR[clip.strokeType] ?? CATEGORY_TAG}`}>
              {clip.strokeType}
            </span>
          )}
          {clip.viewAngle && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-[1rem] text-xs border ${ANGLE_TAG}`}>
              {clip.viewAngle}
            </span>
          )}
          {clip.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-[1rem] text-xs border border-[#868686] text-[#868686] bg-white">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#f8f9fb]">
          <span className="text-[0.6875rem] font-bold text-[#868686]">Uploaded</span>
          <span className="text-[0.6875rem] font-bold text-[#868686]">{formatDate(clip.uploadedAt)}</span>
        </div>
      </div>
    </article>
  )
}
