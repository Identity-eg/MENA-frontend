import { DeliveryPreview } from './marketing/delivery-preview'
import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'

const flow = [
  {
    title: 'Submit the subject',
    body: 'A company name, a registration number, or a list of both. Arabic or English.',
  },
  {
    title: 'We scope and price it',
    body: 'Cost and turnaround come back against the jurisdiction, before any work starts.',
  },
  {
    title: 'We file at the registry',
    body: 'Our own people and regional counsel pull the record from the official channel.',
  },
  {
    title: 'You download the output',
    body: 'Report, extract, and invoice sit on the same request, with the source noted.',
  },
]

export function DeliverySection() {
  return (
    <Section id="how-it-works" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="How it runs"
            title="One request, tracked from filing to delivery."
            body="No email chains, no chasing a status update. Every stage of the request is timestamped and visible while it happens."
          />

          <ol className="mt-12 divide-y divide-border border-t border-border">
            {flow.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 60}>
                <div className="py-6">
                  <h3 className="text-base font-medium text-brand-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={100} className="lg:col-span-6 lg:self-center">
          <DeliveryPreview className="mx-auto max-w-md lg:max-w-none" />
        </Reveal>
      </div>
    </Section>
  )
}
