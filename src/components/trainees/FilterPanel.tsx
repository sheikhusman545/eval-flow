'use client'

import { useState } from 'react'
import { Check, CircleCheckBig, RefreshCw } from 'lucide-react'
import SidePanel from '@/components/ui/SidePanel'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const SKILL_LEVELS = [
  { value: 'Adult Beginner', color: 'red' },
  { value: 'Intermediate', color: 'blue' },
  { value: 'Beginner', color: 'yellow' },
  { value: 'Advanced', color: 'green' },
]

const TRAINING_GROUPS = [
  { value: 'Mon & Thu, 3-5 PM', color: 'blue' },
  { value: 'Sun & Wed, 3-5 PM', color: 'green' },
  { value: 'Sat & Tue, 3-5 PM', color: 'red' },
]

const CHIP_COLORS: Record<string, string> = {
  red: 'border-red-300 text-red-500 hover:bg-red-50',
  blue: 'border-[#365c8e]/30 text-[#365c8e] hover:bg-blue-50',
  yellow: 'border-amber-300 text-amber-600 hover:bg-amber-50',
  green: 'border-[#6fbf45]/30 text-[#6fbf45] hover:bg-green-50',
}

export interface FilterState {
  levels: string[]
  groups: string[]
}

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
}

export default function FilterPanel({ open, onClose, onApply }: FilterPanelProps) {
  const [levels, setLevels] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])

  function toggle(arr: string[], val: string, setArr: (v: string[]) => void) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  function handleApply() {
    onApply({ levels, groups })
    onClose()
  }

  function handleReset() {
    setLevels([])
    setGroups([])
    onApply({ levels: [], groups: [] })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter"
      footer={
        <div className="flex flex-col gap-3">
          <Button variant="secondary" className="w-full" onClick={handleApply}>
            <CircleCheckBig size={18} />
            Apply
          </Button>
          <Button variant="outline-orange" className="w-full" onClick={handleReset}>
            <RefreshCw size={16} />
            Reset
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Skill Level */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Skill Level</label>
          <div className="flex flex-col gap-2">
            {SKILL_LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => toggle(levels, l.value, setLevels)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-medium transition-colors',
                  CHIP_COLORS[l.color],
                  levels.includes(l.value) ? 'ring-1 ring-current bg-current/5' : 'bg-white',
                )}
              >
                {l.value}
                {levels.includes(l.value) && (
                  <Check size={14} strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Training Group */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Training Group</label>
          <div className="flex flex-col gap-2">
            {TRAINING_GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => toggle(groups, g.value, setGroups)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-medium transition-colors',
                  CHIP_COLORS[g.color],
                  groups.includes(g.value) ? 'ring-1 ring-current bg-current/5' : 'bg-white',
                )}
              >
                {g.value}
                {groups.includes(g.value) && (
                  <Check size={14} strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidePanel>
  )
}
