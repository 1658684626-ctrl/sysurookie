import type { SiteCopy } from '../data/content'

function PromptPanel({ copy }: { copy: SiteCopy }) {
  return (
    <div className="border border-black/30 bg-[var(--ee-dark)] p-5 text-[#f5f3ee]">
      <div className="ee-mono flex items-center justify-between border-b border-white/14 pb-4 text-xs uppercase tracking-[0.22em] text-white/55">
        <span>{copy.aiHeading.promptPanel}</span>
        <span className="text-[var(--ee-acid)]">{copy.aiHeading.planned}</span>
      </div>
      <div className="mt-5 grid gap-3">
        {copy.aiPrompts.map((prompt) => (
          <p key={prompt} className="ee-mono border border-white/12 bg-white/[0.04] p-4 text-sm text-white/78">
            &gt; {prompt}
          </p>
        ))}
      </div>
    </div>
  )
}

function CopilotColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-black/30 p-5">
      <h3 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <p key={item} className="border-t border-black/15 pt-3 text-sm text-[var(--ee-muted)]">
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

export function AiAssistantSection({ copy }: { copy: SiteCopy }) {
  return (
    <section id="ai" className="ee-section px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-[var(--ee-muted)]">
              {copy.aiHeading.index}
            </p>
            <h2 className="ee-serif mt-5 text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              {copy.aiHeading.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ee-muted)]">
              {copy.aiHeading.subtitle}
            </p>
          </div>

          <div className="grid gap-5">
            <PromptPanel copy={copy} />
            <div className="grid gap-5 lg:grid-cols-2">
              <CopilotColumn title={copy.aiHeading.organizers} items={copy.organizerCopilot} />
              <CopilotColumn title={copy.aiHeading.participants} items={copy.participantCopilot} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {copy.aiBoundaries.map((item) => (
            <span key={item} className="ee-mono border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
