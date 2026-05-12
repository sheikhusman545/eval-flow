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

export const BADGE_COLOR_CLASSES: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-[#365c8e]',
    border: 'border-[#365c8e]/20',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-[#6fbf45]',
    border: 'border-[#6fbf45]/20',
  },
  yellow: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    border: 'border-red-200',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-[#fd5303]',
    border: 'border-[#fd5303]/20',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  'dark-green': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
}
