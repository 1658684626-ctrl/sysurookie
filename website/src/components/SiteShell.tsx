import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { Language, SiteCopy } from '../data/content'

interface SiteShellProps {
  children: ReactNode
  copy: SiteCopy
  language: Language
  onLanguageChange: (language: Language) => void
}

export function SiteShell({ children, copy, language, onLanguageChange }: SiteShellProps) {
  const [open, setOpen] = useState(false)
  const nextLanguage: Language = language === 'en' ? 'zh' : 'en'

  return (
    <div className="ee-noise min-h-screen overflow-hidden bg-[var(--ee-paper)] text-[var(--ee-ink)]">
      <header className="sticky top-0 z-50 border-b border-black/20 bg-[#f5f3ee]/82 px-4 py-3 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#top" className="ee-focus-ring flex items-center gap-3">
            <span className="ee-mono grid h-9 w-9 place-items-center border border-black bg-[var(--ee-ink)] text-xs font-bold text-[var(--ee-acid)]">
              EE
            </span>
            <span className="leading-none">
              <span className="block text-sm font-semibold tracking-[-0.02em]">EasyEvent</span>
              <span className="ee-mono block text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ee-muted)]">
                {copy.meta.eventOs}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {copy.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="ee-focus-ring ee-mono text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)] transition hover:text-[var(--ee-ink)]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLanguageChange(nextLanguage)}
              className="ee-focus-ring ee-mono border border-black/25 px-3 py-2 text-xs uppercase tracking-[0.16em] transition hover:border-[var(--ee-acid)]"
              aria-label="Switch language"
            >
              {copy.meta.languageLabel}
            </button>
            <a
              href="#contact"
              className="ee-focus-ring hidden border border-black bg-[var(--ee-ink)] px-4 py-2 text-sm font-semibold text-[#f5f3ee] transition hover:bg-[var(--ee-acid)] hover:text-black sm:inline-flex"
            >
              {copy.meta.requestAccess}
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="ee-focus-ring inline-grid h-10 w-10 place-items-center border border-black/25 bg-transparent lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-3 grid max-w-7xl border border-black/25 bg-[#f5f3ee] lg:hidden"
          >
            {copy.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="ee-mono border-b border-black/12 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)]"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </header>

      <main id="top" className="relative z-10">
        {children}
      </main>
    </div>
  )
}
