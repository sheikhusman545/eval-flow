'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export default function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <h2 id="modal-title" className="text-lg font-bold text-gray-900 flex-1 text-center pr-8">
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-gray-200">{footer}</div>
        )}
      </div>
    </div>
  )
}
