import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'
import { DatabaseScale } from './marketing/visuals/database-scale'
import { DirectorsList } from './marketing/visuals/directors-list'
import { GazetteFeed } from './marketing/visuals/gazette-feed'
import { MonitoringFeed } from './marketing/visuals/monitoring-feed'
import { OwnershipGraph } from './marketing/visuals/ownership-graph'
import { ScreeningList } from './marketing/visuals/screening-list'

const capabilities = [
  {
    visual: OwnershipGraph,
    title: 'Ownership and control',
    body: 'Shareholders, percentages, and the offshore vehicles in between, read off the registry filing rather than inferred.',
  },
  {
    visual: DirectorsList,
    title: 'Directors and signatories',
    body: 'Who signs, who was appointed when, and which other companies they sit on across the region.',
  },
  {
    visual: ScreeningList,
    title: 'Sanctions and adverse media',
    body: 'Sanctions lists checked alongside Arabic-language press and court filings, reviewed by a researcher.',
  },
  {
    visual: DatabaseScale,
    title: 'Bulk company data',
    body: 'Five million MENA companies as a structured feed, refreshed monthly for your own enrichment pipeline.',
  },
  {
    visual: GazetteFeed,
    title: 'Official gazette entries',
    body: 'Legal publications and notices as they are issued, indexed back to the company they belong to.',
  },
  {
    visual: MonitoringFeed,
    title: 'Ongoing monitoring',
    body: 'Tell us which counterparties matter and we flag the amendment the day the registry publishes it.',
  },
]

export function CapabilitiesSection() {
  return (
    <Section id="capabilities" className="border-t border-border">
      <SectionHeading
        eyebrow="What lands on your desk"
        title="The record, in the shape you can act on."
        body="Every output below comes from an official channel and cites where it came from, so it survives a compliance review."
      />

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, index) => {
          const Visual = capability.visual
          return (
            <Reveal key={capability.title} delay={(index % 3) * 70}>
              <Visual />
              <h3 className="mt-7 text-xl font-medium leading-[1.2] tracking-title text-brand-navy">
                {capability.title}
              </h3>
              <p className="mt-2.5 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                {capability.body}
              </p>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
