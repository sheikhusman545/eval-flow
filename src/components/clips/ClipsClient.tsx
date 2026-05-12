'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, CloudUpload } from 'lucide-react'
import { Clip } from '@/types'
import ClipCard from './ClipCard'
import UploadClipModal from './UploadClipModal'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type SortKey = 'newest' | 'oldest' | 'views' | 'rating'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'rating', label: 'Highest Rated' },
]

interface ClipsClientProps {
  clips: Clip[]
  title: string
  subtitle: string
  showUpload?: boolean
  variant?: 'coach' | 'player' | 'pro'
}

export default function ClipsClient({ clips, title, subtitle, showUpload, variant = 'coach' }: ClipsClientProps) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filtered = useMemo(() => {
    let list = [...clips]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          (c.strokeType?.toLowerCase().includes(q) ?? false) ||
          (c.coachName?.toLowerCase().includes(q) ?? false),
      )
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'oldest': return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        case 'views': return b.views - a.views
        case 'rating': return b.rating - a.rating
        default: return 0
      }
    })

    return list
  }, [clips, search, sort])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ letterSpacing: '-0.03em' }}>{title}</h1>
          <p className="text-sm text-[#868686] mt-1">{subtitle}</p>
        </div>
        {showUpload && (
          <Button variant="secondary" className="shrink-0 min-w-[13rem] h-12" onClick={() => setShowUploadModal(true)}>
            <CloudUpload size={20} />
            Upload Clip
          </Button>
        )}
      </div>

      {/* Search + Sort — white card with shadow matching original app-search-strip */}
      <div className="flex flex-col md:flex-row items-center gap-4 py-[1.9rem] px-8 bg-white rounded-[2rem] shadow-[0_1.4rem_3.063rem_0_rgba(0,0,0,0.04)] mb-6">
        <div className="flex items-center flex-1 bg-[#f8f9fb] rounded-xl px-3 py-2 w-full relative">
          <Search size={20} className="text-[#365c8e] shrink-0 relative z-10" />
          <input
            type="text"
            placeholder="Search By Name Or Tags...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none border-0 bg-transparent placeholder:text-[#868686] px-3 py-0.5"
            aria-label="Search clips"
          />
          <Button variant="primary" size="sm">Search</Button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
          <Button variant="outline-primary" className="w-14 h-14 rounded-[0.938rem]" onClick={() => setShowSortMenu((v) => !v)} aria-label="Sort">
            <ArrowUpDown size={20} />
          </Button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <ul className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e7e7e7] rounded-xl shadow-lg z-20 py-1">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => { setSort(opt.value); setShowSortMenu(false) }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-[#f8f9fb] transition-colors',
                        sort === opt.value ? 'font-semibold text-[#365c8e]' : 'text-[#868686]',
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Grid — matches cc-clip-grid: auto-fill minmax(17rem,1fr) */}
      {filtered.length > 0 ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))' }}>
          {filtered.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-16 text-sm" role="status">
          No clips match your search.
        </p>
      )}

      <UploadClipModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        variant={variant}
      />
    </>
  )
}
