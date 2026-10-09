import { whyUs } from '@/lib/why-us'
import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'

/**
 * Six differentiators on a hairline grid. Deliberately not six cards: the list
 * is read, not scanned, and card chrome on every item flattens the hierarchy.
 */
export function PlatformFeaturesSection() {
  return (
    <Section id="why-us" className="border-t border-border bg-brand-mist/40">
      <SectionHeading
        eyebrow="Why buyers move to us"
        title="What changes when the source is ours."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((item, index) => (
          <Reveal
            key={item.title}
            delay={(index % 3) * 60}
            className="bg-white p-7 transition-colors hover:bg-brand-mist/70 sm:p-8"
          >
            <span
              aria-hidden
              className="block h-0.5 w-8 rounded-full bg-brand-cyan-ink"
            />
            <h3 className="mt-5 text-base font-medium text-brand-navy">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
