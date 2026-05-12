import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'orange' | 'outline-primary' | 'outline-orange' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-[#365c8e] text-white hover:bg-[#2b4a72] border-transparent',
  secondary: 'bg-[#6fbf45] text-white hover:bg-[#59a036] border-transparent',
  orange: 'bg-[#fd5303] text-white hover:bg-[#e04a02] border-transparent',
  'outline-primary': 'bg-transparent text-[#365c8e] border-[#365c8e] hover:bg-[#365c8e]/10',
  'outline-orange': 'bg-transparent text-[#fd5303] border-[#fd5303] hover:bg-[#fd5303]/10',
  ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#365c8e]/50 disabled:opacity-50 disabled:cursor-not-allowed',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
