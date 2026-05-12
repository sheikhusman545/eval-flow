import { cn, BADGE_COLOR_CLASSES } from '@/lib/utils'
import { BadgeColor } from '@/types'

interface BadgeProps {
  label: string
  color: BadgeColor
  className?: string
}

export default function Badge({ label, color, className }: BadgeProps) {
  const colors = BADGE_COLOR_CLASSES[color] ?? BADGE_COLOR_CLASSES.blue
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
    >
      {label}
    </span>
  )
}

export function ScoreBadge({ score, color }: { score: number; color: BadgeColor }) {
  const colors = BADGE_COLOR_CLASSES[color] ?? BADGE_COLOR_CLASSES.orange
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[48px] px-2 py-1 rounded-lg text-sm font-bold border',
        colors.bg,
        colors.text,
        colors.border,
      )}
    >
      {score.toFixed(1)}
    </span>
  )
}
