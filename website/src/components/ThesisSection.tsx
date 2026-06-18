import { motion } from 'motion/react'
import type { SiteCopy } from '../data/content'

export function ThesisSection({ copy }: { copy: SiteCopy }) {
  return (
    <section className="ee-section px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-[var(--ee-muted)]">
              {copy.thesisHeading.index}
            </p>
            <h2 className="ee-serif mt-5 max-w-3xl text-5xl leading-[0.95] tracking-[-0.055em] text-[var(--ee-ink)] sm:text-7xl">
              {copy.thesisHeading.title}
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-8 text-[var(--ee-muted)]">
              {copy.thesisHeading.subtitle}
            </p>
          </div>

          <div className="grid gap-px border border-black/25 bg-black/25 sm:grid-cols-2">
            {copy.thesis.map((item, index) => (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className="group min-h-64 bg-[#f5f3ee] p-6 transition hover:bg-[#f1efe7]"
              >
                <p className="ee-mono text-sm text-[var(--ee-muted)] transition group-hover:text-[var(--ee-acid)]">
                  {item.number}
                </p>
                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em] text-[var(--ee-ink)]">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-[var(--ee-muted)]">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
