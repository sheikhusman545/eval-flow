'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

type CameraAngle = 'Behind Player' | 'Side View' | 'Front View'
const CAMERA_ANGLES: CameraAngle[] = ['Behind Player', 'Side View', 'Front View']

const STROKE_TYPES = ['Forehand', 'Backhand', 'Volley', 'Serve', 'Smash']
const SKILL_LEVELS = ['Advanced', 'Intermediate', 'Beginner']

export interface UploadClipModalProps {
  open: boolean
  onClose: () => void
  variant: 'coach' | 'player' | 'pro'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadClipModal({ open, onClose, variant }: UploadClipModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Form state
  const [videoUrl, setVideoUrl] = useState('')
  const [title, setTitle] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [strokeType, setStrokeType] = useState('')
  const [cameraAngle, setCameraAngle] = useState<CameraAngle | ''>('')
  const [skillLevel, setSkillLevel] = useState('')
  const [tags, setTags] = useState('')

  const modalTitle =
    variant === 'pro' ? 'Upload Pro Video' : 'Upload Clip'

  const showVideoUrl = variant === 'coach' || variant === 'pro'
  const showPlayerName = variant === 'player' || variant === 'pro'
  const playerNameLabel = variant === 'pro' ? 'Player Name / URL' : 'Player Name'

  function handleFile(f: File) {
    setFile(f)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  function handleBrowse() {
    fileInputRef.current?.click()
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function handleRemoveFile() {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleClose() {
    setFile(null)
    setVideoUrl('')
    setTitle('')
    setPlayerName('')
    setStrokeType('')
    setCameraAngle('')
    setSkillLevel('')
    setTags('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire up actual upload logic
    handleClose()
  }

  const footer = (
    <div className="flex justify-end">
      <Button variant="secondary" onClick={handleSubmit} type="button">
        Upload
      </Button>
    </div>
  )

  return (
    <Modal open={open} onClose={handleClose} title={modalTitle} footer={footer} className="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Drag & Drop Zone */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 px-6 transition-colors cursor-pointer ${
              dragOver
                ? 'border-[#6fbf45] bg-[#f0fbe8]'
                : 'border-gray-200 bg-[#f8f9fb] hover:border-[#6fbf45] hover:bg-[#f0fbe8]'
            }`}
            onClick={handleBrowse}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleBrowse()}
            aria-label="Click or drag a file to upload"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center">
              <Upload size={24} className="text-[#365c8e]" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Drag Your File To Start Uploading</p>
            <p className="text-xs text-gray-400">OR</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleBrowse() }}
              className="px-5 py-2 rounded-xl bg-[#365c8e] text-white text-sm font-semibold hover:bg-[#2b4a72] transition-colors"
            >
              Browse files
            </button>
          </div>
        ) : (
          /* File selected */
          <div className="flex items-center gap-3 bg-[#f8f9fb] rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-xl bg-[#365c8e]/10 flex items-center justify-center shrink-0">
              <Upload size={18} className="text-[#365c8e]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {/* Video URL (coach, pro) */}
        {showVideoUrl && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors"
            />
          </div>
        )}

        {/* Video Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Video Title <span className="text-[#fd5303]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title..."
            className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors"
          />
        </div>

        {/* Player Name (player, pro) */}
        {showPlayerName && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">{playerNameLabel}</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={playerNameLabel}
              className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors"
            />
          </div>
        )}

        {/* Stroke Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Stroke Type</label>
          <select
            value={strokeType}
            onChange={(e) => setStrokeType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors appearance-none"
          >
            <option value="">Select stroke type...</option>
            {STROKE_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Camera Angle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Camera Angle</label>
          <div className="flex flex-wrap gap-2">
            {CAMERA_ANGLES.map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => setCameraAngle(angle === cameraAngle ? '' : angle)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  cameraAngle === angle
                    ? 'bg-[#365c8e] text-white border-[#365c8e]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#365c8e] hover:text-[#365c8e]'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Skill Level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors appearance-none"
          >
            <option value="">Select skill level...</option>
            {SKILL_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Search or add tags..."
            className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-2 text-sm outline-none focus:border-[#365c8e] transition-colors"
          />
        </div>
      </form>
    </Modal>
  )
}
