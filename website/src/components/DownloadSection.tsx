import type { SiteCopy } from '../data/content'

export function DownloadSection({ copy }: { copy: SiteCopy }) {
  return (
    <section id="download" className="ee-section bg-[var(--ee-dark)] px-4 py-20 text-[#f5f3ee] sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-white/18 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-white/50">
              {copy.downloadHeading.index}
            </p>
            <h2 className="ee-serif mt-5 max-w-4xl text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              {copy.downloadHeading.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/62">
            {copy.downloadHeading.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-white/18 bg-white/18 md:grid-cols-2 xl:grid-cols-4">
          {copy.downloads.map((item) => (
            <article key={item[0]} className="min-h-72 bg-[var(--ee-dark)] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">{item[0]}</h3>
                <span className="ee-mono border border-[var(--ee-acid)]/70 px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-[var(--ee-acid)]">
                  {item[2]}
                </span>
              </div>
              <p className="mt-6 text-sm text-white/55">{item[1]}</p>
              <a
                href="#contact"
                className="ee-focus-ring mt-24 inline-flex border border-white/22 px-4 py-3 text-sm font-semibold text-white transition hover:border-[var(--ee-acid)] hover:text-[var(--ee-acid)]"
              >
                {item[3]}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
