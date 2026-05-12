'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, Filter, UserPlus, ChevronDown } from 'lucide-react'
import { Trainee } from '@/types'
import TraineeCard from './TraineeCard'
import AddTraineeModal from './AddTraineeModal'
import FilterPanel, { FilterState } from './FilterPanel'
import Toast from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { TRAINING_GROUP_LABELS } from '@/data/trainees'

type SortKey = 'name-asc' | 'level' | 'joined-desc' | 'eval-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'level', label: 'Level' },
  { value: 'joined-desc', label: 'Recently Added' },
  { value: 'eval-desc', label: 'Last Evaluation' },
]

interface TraineesClientProps {
  trainees: Trainee[]
}

export default function TraineesClient({ trainees }: TraineesClientProps) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('name-asc')
  const [filters, setFilters] = useState<FilterState>({ levels: [], groups: [] })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const filtered = useMemo(() => {
    let list = [...trainees]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.searchTags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }

    // Level filter
    if (filters.levels.length) {
      list = list.filter((t) => filters.levels.includes(t.level))
    }

    // Training group filter
    if (filters.groups.length) {
      list = list.filter((t) => filters.groups.includes(TRAINING_GROUP_LABELS[t.trainingGroup]))
    }

    // Sort
    list.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        case 'level':
          return a.levelRank - b.levelRank
        case 'joined-desc':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        case 'eval-desc':
          return (
            new Date(b.lastEvalAt ?? 0).getTime() - new Date(a.lastEvalAt ?? 0).getTime()
          )
        default:
          return 0
      }
    })

    return list
  }, [trainees, search, sort, filters])

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainees</h1>
          <p className="text-sm text-gray-500 mt-1">Track And Evaluate Player Performance Over Time</p>
        </div>
        <Button variant="secondary" onClick={() => setShowAddModal(true)} className="shrink-0">
          <UserPlus size={18} />
          Add Trainee
        </Button>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 py-[1.9rem] px-8 bg-white rounded-[2rem] shadow-[0_1.4rem_3.063rem_0_rgba(0,0,0,0.04)] mb-6">
        {/* Search */}
        <div className="flex items-center flex-1 bg-[#f8f9fb] rounded-xl px-3 py-2 w-full relative">
          <Search size={20} className="text-[#365c8e] shrink-0 relative z-10" />
          <input
            type="text"
            placeholder="Search By Name Or Tags...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none border-0 bg-transparent placeholder:text-gray-400 px-3 py-0.5"
            aria-label="Search trainees"
          />
          <Button variant="primary" size="sm" onClick={() => {}}>
            Search
          </Button>
        </div>

        {/* Sort + Filter */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sort dropdown */}
          <div className="relative">
            <Button
              variant="outline-primary"
              size="md"
              onClick={() => setShowSortMenu((v) => !v)}
              aria-label="Sort"
            >
              <ArrowUpDown size={18} />
            </Button>
            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <ul className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => { setSort(opt.value); setShowSortMenu(false) }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                          sort === opt.value ? 'font-semibold text-[#365c8e]' : 'text-gray-700',
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

          {/* Filter */}
          <Button variant="primary" size="md" onClick={() => setShowFilter(true)} aria-label="Filter">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Trainee Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((trainee) => (
            <TraineeCard key={trainee.id} trainee={trainee} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-16 text-sm" role="status">
          No trainees match your search.
        </p>
      )}

      {/* Add Trainee Modal */}
      <AddTraineeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => setShowToast(true)}
      />

      {/* Filter Panel */}
      <FilterPanel
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setFilters}
      />

      {/* Success Toast */}
      <Toast
        message="Player Added Successfully!"
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </>
  )
}
