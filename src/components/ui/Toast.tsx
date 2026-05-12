'use client'

import { Check } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onHide: () => void
  duration?: number
}

export default function Toast({ message, show, onHide, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onHide, duration])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-8 py-6 flex flex-col items-center gap-3 pointer-events-auto">
        <div className="w-14 h-14 rounded-full bg-[#6fbf45] flex items-center justify-center">
          <Check size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <p className="text-gray-900 font-semibold text-center">{message}</p>
      </div>
    </div>
  )
}
