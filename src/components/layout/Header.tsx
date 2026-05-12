'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Video, LibraryBig, Trophy, LineChart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Trainees', icon: Users },
  { href: '/coach-clips', label: 'Coach Clips', icon: Video },
  { href: '/player-library', label: 'Player Library', icon: LibraryBig },
  { href: '/pro-library', label: 'Pro Library', icon: Trophy },
  { href: '/performance-comparison', label: 'Compare', icon: LineChart },
]

function NavPill({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
        active
          ? 'bg-[#365c8e] text-white shadow-sm'
          : 'text-[#868686] hover:bg-[#f8f9fb] hover:text-black',
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/trainees')
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="bg-white/90 border border-[#f0f0f0] sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-[6.25rem] gap-6">
            {/* Brand */}
            <Link href="/" className="font-bold text-lg text-black shrink-0 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Performance Coach
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4 flex-1 justify-end" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <NavPill key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#365c8e] text-[#365c8e] hover:bg-[#f8f9fb] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-end p-4 border-b border-[#f0f0f0]">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-[#f8f9fb] transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              {NAV_ITEMS.map((item) => (
                <NavPill
                  key={item.href}
                  {...item}
                  active={isActive(item.href)}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
