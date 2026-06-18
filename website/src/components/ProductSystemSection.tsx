import { motion } from 'motion/react'
import type { SiteCopy } from '../data/content'

export function ProductSystemSection({ copy }: { copy: SiteCopy }) {
  return (
    <section id="product" className="ee-section bg-[var(--ee-dark)] px-4 py-20 text-[#f5f3ee] sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 border-b border-white/18 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-white/55">
              {copy.productHeading.index}
            </p>
            <h2 className="ee-serif mt-5 max-w-4xl text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              {copy.productHeading.title}
            </h2>
          </div>
          <p className="ee-mono text-sm uppercase tracking-[0.18em] text-[var(--ee-acid)]">
            {copy.productHeading.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-white/18 bg-white/18 lg:grid-cols-3">
          {copy.productSystem.map((item, index) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.32, delay: index * 0.04 }}
              className="min-h-72 bg-[var(--ee-dark)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="ee-mono text-sm text-white/45">{item.number}</span>
                <span className="ee-mono border border-[var(--ee-acid)] px-2 py-1 text-xs uppercase tracking-[0.18em] text-[var(--ee-acid)]">
                  {item.keyword}
                </span>
              </div>
              <h3 className="mt-20 text-2xl font-semibold tracking-[-0.04em]">{item.title}</h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/62">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
