import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'
import { RegistryCoverage } from './marketing/visuals/registry-coverage'

export function JurisdictionStripSection() {
  return (
    <Section id="coverage" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Coverage"
            title="Twelve jurisdictions, one counterparty at a time."
            body="Depth varies by registry. We tell you which record is available where before you commit to a request."
          />
        </div>

        <Reveal delay={80} className="lg:col-span-8">
          <RegistryCoverage />
        </Reveal>
      </div>
    </Section>
  )
}
