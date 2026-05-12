'use client'

import { useState } from 'react'
import { Info, CircleCheckBig } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const LEVELS = [
  { value: '2.0', label: '2.0', color: 'green' },
  { value: '2.5', label: '2.5', color: 'dark-green' },
  { value: '3.0', label: '3.0', color: 'blue' },
  { value: '3.5', label: '3.5', color: 'purple' },
  { value: '4.0', label: '4.0', color: 'orange' },
]

const GROUPS = [
  { value: 'mon-thu', label: 'Mon & Thu, 3-5 PM', color: 'orange' },
  { value: 'sun-wed', label: 'Sun & Wed, 3-5 PM', color: 'blue' },
  { value: 'sat-tue', label: 'Sat & Tue, 3-5 PM', color: 'purple' },
]

const LEVEL_CHIP_COLORS: Record<string, string> = {
  green: 'border-[#6fbf45] text-[#6fbf45] bg-green-50',
  'dark-green': 'border-emerald-600 text-emerald-700 bg-emerald-50',
  blue: 'border-[#365c8e] text-[#365c8e] bg-blue-50',
  purple: 'border-purple-500 text-purple-600 bg-purple-50',
  orange: 'border-[#fd5303] text-[#fd5303] bg-orange-50',
}

interface AddTraineeModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddTraineeModal({ open, onClose, onSuccess }: AddTraineeModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [level, setLevel] = useState('2.0')
  const [group, setGroup] = useState('mon-thu')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = "Please enter the player's full name."
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.'
    if (!phone.trim()) e.phone = 'Please enter a valid phone number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // Reset form
    setName('')
    setEmail('')
    setPhone('')
    setLevel('2.0')
    setGroup('mon-thu')
    setErrors({})
    onClose()
    onSuccess()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Player"
      footer={
        <Button variant="orange" className="w-full" type="submit" form="addPlayerForm">
          <CircleCheckBig size={20} />
          Add
        </Button>
      }
    >
      <form id="addPlayerForm" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="playerName" className="text-sm font-semibold text-gray-700">Full Name</label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Trainee's Full Name"
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors',
              errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#365c8e]',
            )}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="playerEmail" className="text-sm font-semibold text-gray-700">Email Address</label>
          <input
            id="playerEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors',
              errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#365c8e]',
            )}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="playerPhone" className="text-sm font-semibold text-gray-700">Phone Number</label>
          <input
            id="playerPhone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone Number"
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors',
              errors.phone ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#365c8e]',
            )}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Player Level */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Player Level</label>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all',
                  LEVEL_CHIP_COLORS[l.color],
                  level === l.value ? 'ring-2 ring-offset-1 ring-current' : 'opacity-70 hover:opacity-100',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Training Group */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Training Group</label>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGroup(g.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all',
                  LEVEL_CHIP_COLORS[g.color],
                  group === g.value ? 'ring-2 ring-offset-1 ring-current' : 'opacity-70 hover:opacity-100',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-[#365c8e]">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            Players Will Automatically Be Added To Email And Text Groups Based On Their Level And Training Group.
          </p>
        </div>
      </form>
    </Modal>
  )
}
