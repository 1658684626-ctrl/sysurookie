import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { contactEmail } from '../data/content'
import type { SiteCopy } from '../data/content'

export function ContactSection({ copy }: { copy: SiteCopy }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    eventType: '',
    message: '',
  })

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`EasyEvent early access - ${form.organization || form.name || 'New contact'}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Organization: ${form.organization}`,
        `Event type: ${form.eventType}`,
        '',
        form.message,
      ].join('\n'),
    )
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }, [form])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="ee-section px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-px border border-black/30 bg-black/30 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#f5f3ee] p-6 sm:p-10">
            <p className="ee-mono text-xs uppercase tracking-[0.28em] text-[var(--ee-muted)]">
              {copy.contactHeading.index}
            </p>
            <h2 className="ee-serif mt-5 text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              {copy.contactHeading.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ee-muted)]">
              {copy.contactHeading.subtitle}
            </p>

            <div className="mt-12 border border-black/25 bg-[#ebe7dc] p-5">
              <p className="ee-mono text-xs uppercase tracking-[0.22em] text-[var(--ee-muted)]">
                {copy.contactHeading.brief}
              </p>
              <div className="mt-5 grid gap-3">
                {copy.contactBrief.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 border-t border-black/15 pt-3 text-sm">
                    <span className="text-[var(--ee-muted)]">{label}</span>
                    <span className="max-w-52 text-right font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 bg-[#f5f3ee] p-6 sm:p-10">
            {[
              ['name', copy.contactHeading.fields.name],
              ['email', copy.contactHeading.fields.email],
              ['organization', copy.contactHeading.fields.organization],
              ['eventType', copy.contactHeading.fields.eventType],
            ].map(([key, label]) => (
              <label key={key} className="ee-mono grid gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)]">
                {label}
                <input
                  className="ee-focus-ring min-h-12 border border-black/25 bg-transparent px-4 font-sans text-base normal-case tracking-normal text-[var(--ee-ink)] outline-none"
                  value={form[key as keyof typeof form]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  required={key === 'name' || key === 'email'}
                />
              </label>
            ))}
            <label className="ee-mono grid gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ee-muted)]">
              {copy.contactHeading.fields.message}
              <textarea
                className="ee-focus-ring min-h-36 border border-black/25 bg-transparent px-4 py-3 font-sans text-base normal-case tracking-normal text-[var(--ee-ink)] outline-none"
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                required
              />
            </label>

            <button
              type="submit"
              className="ee-focus-ring min-h-12 bg-[var(--ee-ink)] px-6 py-3 text-sm font-semibold text-[#f5f3ee] transition hover:bg-[var(--ee-acid)] hover:text-black"
            >
              {copy.contactHeading.button}
            </button>

            {submitted ? (
              <div className="border border-[var(--ee-acid)] bg-[var(--ee-acid)]/18 p-4 text-sm leading-7">
                {copy.contactHeading.successPrefix}
                <a className="ml-1 font-bold underline" href={mailtoHref}>
                  {copy.contactHeading.successLink}
                </a>
                .
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  )
}
