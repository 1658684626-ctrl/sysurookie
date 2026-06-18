import type { SiteCopy } from '../data/content'

export function TemplateSection({ copy }: { copy: SiteCopy }) {
  return (
    <section id="templates" className="ee-section px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-[var(--ee-muted)]">
              {copy.templatesHeading.index}
            </p>
            <h2 className="ee-serif mt-5 text-5xl leading-[0.95] tracking-[-0.055em] text-[var(--ee-ink)] sm:text-7xl">
              {copy.templatesHeading.title}
            </h2>
            <p className="mt-5 text-xl text-[var(--ee-muted)]">
              {copy.templatesHeading.subtitle}
            </p>
            <div className="mt-10 border border-black/30 bg-[#ebe7dc] p-5">
              <p className="ee-mono text-xs uppercase tracking-[0.22em] text-[var(--ee-muted)]">
                {copy.templatesHeading.configLabel}
              </p>
              <div className="mt-5 grid gap-2">
                {copy.eventConfigTokens.map((token) => (
                  <div key={token} className="ee-mono flex items-center justify-between border-t border-black/15 py-2 text-sm">
                    <span>{token}</span>
                    <span className="text-[var(--ee-acid)]">{copy.meta.enabled}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-black/30">
            <table className="w-full min-w-[760px] border-collapse bg-[#f5f3ee] text-left">
              <thead className="ee-mono text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)]">
                <tr>
                  {copy.templatesHeading.table.map((heading) => (
                    <th key={heading} className="border-b border-black/25 p-4">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.templates.map((template) => (
                  <tr key={template[0]} className="transition hover:bg-[#ebe7dc]">
                    <td className="border-b border-black/15 p-4 text-lg font-semibold tracking-[-0.03em]">
                      {template[0]}
                    </td>
                    <td className="border-b border-black/15 p-4 text-sm text-[var(--ee-muted)]">
                      {template[1]}
                    </td>
                    <td className="border-b border-black/15 p-4 text-sm text-[var(--ee-muted)]">
                      {template[2]}
                    </td>
                    <td className="border-b border-black/15 p-4 text-sm text-[var(--ee-muted)]">
                      {template[3]}
                    </td>
                    <td className="border-b border-black/15 p-4 text-sm text-[var(--ee-muted)]">
                      {template[4]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
