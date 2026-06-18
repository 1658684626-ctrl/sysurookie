import type { SiteCopy } from '../data/content'

export function LiveSignalsSection({ copy }: { copy: SiteCopy }) {
  return (
    <section id="signals" className="ee-section bg-[var(--ee-dark)] px-4 py-20 text-[#f5f3ee] sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-white/50">
              {copy.signalsHeading.index}
            </p>
            <h2 className="ee-serif mt-5 text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              {copy.signalsHeading.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
              {copy.signalsHeading.subtitle}
            </p>
          </div>

          <div className="grid gap-px border border-white/18 bg-white/18 sm:grid-cols-2">
            {copy.liveSignals.map((signal, index) => (
              <div key={signal} className="min-h-32 bg-[var(--ee-dark)] p-5">
                <p className="ee-mono text-xs text-white/35">0{index + 1}</p>
                <p className="mt-10 text-2xl font-semibold tracking-[-0.04em]">{signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="border border-white/18 p-5">
            <p className="ee-mono text-xs uppercase tracking-[0.22em] text-[var(--ee-acid)]">
              {copy.signalsHeading.ecosystem}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {copy.integrations.map((item) => (
                <span key={item} className="border border-white/16 px-3 py-2 text-sm text-white/72">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-[var(--ee-acid)]/70 p-5">
            <p className="ee-mono text-xs uppercase tracking-[0.22em] text-[var(--ee-acid)]">
              {copy.signalsHeading.boundaries}
            </p>
            <div className="mt-5 grid gap-3">
              {copy.signalPrinciples.map((item) => (
                <p key={item} className="border-t border-white/12 pt-3 text-sm text-white/72">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
