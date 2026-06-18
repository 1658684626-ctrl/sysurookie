import { motion } from 'motion/react'
import type { SiteCopy } from '../data/content'
import { GenerativeEventFigure } from './GenerativeEventFigure'

export function HeroSection({ copy }: { copy: SiteCopy }) {
  const { hero } = copy

  return (
    <section className="relative px-4 pb-16 pt-10 sm:pb-24 lg:pt-16">
      <div className="mx-auto grid max-w-7xl gap-px border border-black/30 bg-black/30 lg:grid-cols-[0.86fr_1.14fr]">
        <GenerativeEventFigure label={copy.figure.label} stat={copy.figure.stat} />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative flex min-h-[34rem] flex-col justify-between bg-[#f5f3ee] p-6 sm:p-10 lg:p-12"
        >
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-[var(--ee-muted)]">
              {hero.eyebrow}
            </p>
            <h1 className="ee-serif mt-8 max-w-4xl text-[4.2rem] leading-[0.82] tracking-[-0.075em] text-[var(--ee-ink)] sm:text-[6.2rem] lg:text-[7.8rem]">
              {hero.title}
            </h1>
            <p className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-[var(--ee-ink)]">
              {hero.titleCn}
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--ee-muted)] sm:text-lg">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="ee-mono inline-flex min-h-12 items-center justify-center border border-black bg-[var(--ee-ink)] px-5 text-xs uppercase tracking-[0.2em] text-[#f5f3ee] transition hover:bg-[var(--ee-acid)] hover:text-black"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#product"
                className="ee-mono inline-flex min-h-12 items-center justify-center border border-black/35 px-5 text-xs uppercase tracking-[0.2em] text-[var(--ee-ink)] transition hover:border-black hover:bg-black/5"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="border-t border-black/30 pt-4">
              <div className="h-px w-full bg-black/80">
                <div className="h-px w-1/3 bg-[var(--ee-acid)]" />
              </div>
              <p className="ee-mono mt-3 text-xs uppercase tracking-[0.22em] text-[var(--ee-muted)]">
                {copy.meta.scroll}
              </p>
            </div>
            <div className="ee-acid-shadow bg-[var(--ee-acid)] p-5 text-black sm:w-64">
              <p className="ee-mono text-sm">01</p>
              <p className="mt-8 text-xl font-semibold leading-6 tracking-[-0.03em]">
                {hero.principle}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
