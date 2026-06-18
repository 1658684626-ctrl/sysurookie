import { contactEmail } from '../data/content'
import type { SiteCopy } from '../data/content'

export function Footer({ copy }: { copy: SiteCopy }) {
  return (
    <footer className="border-t border-black/25 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="ee-serif text-6xl leading-none tracking-[-0.07em] sm:text-8xl">
          EasyEvent
        </div>
        <div className="mt-8 flex flex-col gap-6 border-t border-black/18 pt-6 text-sm text-[var(--ee-muted)] lg:flex-row lg:items-center lg:justify-between">
          <p>{copy.footer.tagline}</p>
          <div className="flex flex-wrap gap-4">
            {copy.navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </a>
            ))}
          </div>
          <p>{copy.footer.copyright}</p>
        </div>
        <div className="mt-6 border-t border-black/18 pt-6 text-sm text-[var(--ee-muted)]">
          <span className="ee-mono mr-3 text-xs uppercase tracking-[0.18em]">
            {copy.footer.emailLabel}
          </span>
          <a className="font-semibold text-[var(--ee-ink)] underline decoration-black/25" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}
