import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { partnershipTiers } from '@/lib/partnership-tiers'
import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'

export function PartnershipTeaserSection() {
  return (
    <Section id="partnership" className="border-t border-border">
      <SectionHeading
        eyebrow="Ways to work together"
        title="Most partners start with one of these."
        aside={
          <Link
            to="/lets-talk"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan-ink"
          >
            Talk to us
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="mt-14 divide-y divide-border border-y border-border sm:mt-16">
        {partnershipTiers.map((tier, index) => (
          <Reveal key={tier.index} delay={index * 70}>
            <div className="group grid gap-4 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
              <h3 className="text-lg font-medium leading-[1.25] tracking-title text-brand-navy transition-colors group-hover:text-brand-cyan-ink sm:col-span-4">
                {tier.title}
              </h3>
              <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:col-span-8">
                {tier.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
