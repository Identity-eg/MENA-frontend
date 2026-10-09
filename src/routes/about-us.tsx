import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Reveal } from '@/components/marketing/reveal'
import { Section, SectionHeading } from '@/components/marketing/section'
import { Button } from '@/components/ui/button'
import { FullPageLoading } from '@/components/ui/full-page-loading'

export const Route = createFileRoute('/about-us')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'About Us | Ident-ity' },
      {
        name: 'description',
        content:
          'Ident-ity is a multidisciplinary MENA business intelligence company. Legal, research, and technology specialists active across 12 jurisdictions.',
      },
    ],
  }),
  component: AboutUsPage,
})

const story = [
  {
    heading: 'Where we started',
    body: 'Ident-ity began with due diligence and verification work for companies operating in a highly regulated industry, where accuracy and source integrity were non-negotiable. That experience meant building the relationships and processes needed to verify information directly at the source, a discipline that still defines how we work today.',
  },
  {
    heading: 'Founded in 2022',
    body: 'What started as a focused corporate verification and retrieval operation grew into Ident-ity, built around our own proprietary database and a commitment to verified, first-hand information.',
  },
  {
    heading: 'Steady, deliberate growth',
    body: 'We expanded market by market across the Middle East and North Africa, growing our team, our regional network, and our product suite along the way.',
  },
  {
    heading: 'Today',
    body: 'A multidisciplinary team of legal, research, and technology specialists, active across 12 jurisdictions, offering six solutions with a clear, focused vision for business intelligence across the region.',
  },
]

const team = [
  { value: '2', label: 'Co-founders, strategy and legal' },
  { value: '3', label: 'Legal specialists, Egypt based' },
  { value: '3', label: 'Developers, one AI specialist' },
  { value: '4', label: 'Regional lawyers across MENA' },
]

function AboutUsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <MarketingShell user={user}>
      <Section className="pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="About"
          title="A MENA-focused corporate intelligence company, founded 2022."
          body="Legal, research, and technology specialists who retrieve the corporate record where it is filed, not where it is resold."
        />
      </Section>

      <Section className="border-t border-border pt-0 sm:pt-0">
        <ol className="divide-y divide-border border-y border-border">
          {story.map((block, index) => (
            <Reveal as="li" key={block.heading} delay={index * 60}>
              <div className="grid gap-4 py-9 sm:grid-cols-12 sm:gap-8">
                <h2 className="text-lg font-medium leading-[1.25] tracking-title text-brand-navy sm:col-span-4">
                  {block.heading}
                </h2>
                <p className="max-w-[64ch] text-base leading-relaxed text-muted-foreground sm:col-span-8">
                  {block.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="The team" title="Who does the work." />
        <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {team.map((item) => (
            <div key={item.label} className="bg-white p-7">
              <dt className="sr-only">{item.label}</dt>
              <dd className="text-3xl font-semibold tabular-nums leading-none tracking-display text-brand-navy">
                {item.value}
              </dd>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-semibold leading-[1.02] tracking-heading text-brand-navy sm:text-4xl">
            Work with us.
          </h2>
          <div className="mt-8">
            <Link to="/lets-talk">
              <Button
                size="lg"
                className="h-11 rounded-full bg-brand-navy px-7 text-[15px] font-semibold text-white hover:bg-brand-navy/90 active:scale-[0.98]"
              >
                Talk to us
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </MarketingShell>
  )
}
