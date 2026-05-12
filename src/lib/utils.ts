import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BadgeColor } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

// Colors match original CSS variables exactly:
// --color-info-bg: #dbeafe; --color-info-text: #1d4ed8
// --color-success-chip-bg: #dcfce7; --color-success-chip-text: #166534
// --color-warning-chip-bg: #fef9c3; --color-warning-chip-text: #a16207
// --color-danger-chip-bg: #fff1f2; --color-danger-chip-text: #e11d48
// --color-purple-chip-bg: #e8eaf6; --color-purple-chip-text: #5c6bc0
// --color-green-chip-bg: #e0f2f1; --color-green-chip-text: #26a69a
// --color-light-orange: #fcf0dc; --color-orange: #fd5303
export const BADGE_COLOR_CLASSES: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-[#dbeafe]',
    text: 'text-[#1d4ed8]',
    border: 'border-[#1d4ed8]',
  },
  green: {
    bg: 'bg-[#dcfce7]',
    text: 'text-[#166534]',
    border: 'border-[#166534]',
  },
  yellow: {
    bg: 'bg-[#fef9c3]',
    text: 'text-[#a16207]',
    border: 'border-[#a16207]',
  },
  red: {
    bg: 'bg-[#fff1f2]',
    text: 'text-[#e11d48]',
    border: 'border-[#e11d48]',
  },
  orange: {
    bg: 'bg-[#fcf0dc]',
    text: 'text-[#fd5303]',
    border: 'border-[#fd5303]',
  },
  purple: {
    bg: 'bg-[#e8eaf6]',
    text: 'text-[#5c6bc0]',
    border: 'border-[#5c6bc0]',
  },
  'dark-green': {
    bg: 'bg-[#e0f2f1]',
    text: 'text-[#26a69a]',
    border: 'border-[#26a69a]',
  },
}
