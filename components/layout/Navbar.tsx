'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { personalInfo } from '@/lib/data'

const navLinks = [
  { label: 'About',      href: '/about' },
  { label: 'Background', href: '/background' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Writings',   href: '/writings' },
  { label: 'Services',   href: '/services' },
  { label: 'Contact',    href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-c-bg border-b-[3px] border-c-text">
      <nav className="max-w-[760px] mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          href="/"
          className="font-display text-[18px] text-c-text select-none tracking-tight"
        >
          {personalInfo.nickname.toLowerCase()}
          <span className="text-c-purple">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 border-2 transition-all duration-100 ${
                isActive(link.href)
                  ? 'bg-c-yellow border-c-text shadow-brutal-sm'
                  : 'border-transparent text-c-muted hover:border-c-text hover:bg-c-surface hover:text-c-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] border-2 border-c-text bg-c-surface shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-4 h-[2px] bg-c-text transition-all ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-4 h-[2px] bg-c-text transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-4 h-[2px] bg-c-text transition-all ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-c-bg border-b-[3px] border-c-text px-6 py-5 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-mono text-[12px] font-bold uppercase tracking-wide px-3 py-2 border-2 ${
                isActive(link.href)
                  ? 'bg-c-yellow border-c-text shadow-brutal-sm'
                  : 'border-c-text bg-c-surface text-c-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
