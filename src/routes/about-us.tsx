import {
  Link,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Button } from '@/components/ui/button'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { StatTileRow } from '@/components/marketing/stat-tile'

export const Route = createFileRoute('/about-us')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'About Us | Ident-ity' },
      {
        name: 'description',
        content:
          'Ident-ity is a multidisciplinary MENA business intelligence company — legal, research, and technology specialists active across 10 jurisdictions.',
      },
    ],
  }),
  component: AboutUsPage,
})

const story = [
  {
    heading: 'Where we started',
    body: 'Ident-ity began with due diligence and verification work for companies operating in a highly regulated industry, where accuracy and source integrity were non-negotiable. That experience meant building the relationships and processes needed to verify information directly at the source — a discipline that still defines how we work today.',
  },
  {
    heading: '2022 — Ident-ity founded',
    body: 'What started as a focused corporate verification and retrieval operation grew into Ident-ity, built around our own proprietary database and a commitment to verified, first-hand information.',
  },
  {
    heading: 'Steady, deliberate growth',
    body: 'We expanded market by market across the Middle East and North Africa, growing our team, our regional network, and our product suite along the way.',
  },
  {
    heading: 'Today',
    body: 'A multidisciplinary team of legal, research, and technology specialists, active across 10 jurisdictions, offering 6 solutions — with a clear, focused vision for business intelligence across the region.',
  },
]

const teamComposition = [
  'Two co-founders — one focused on strategy and operations, the other bringing a legal background',
  '3 legal specialists (Egypt-based)',
  '3 developers, including 1 AI specialist',
  '1 research function',
  '1 finance function',
  'An extended network of 4 regional lawyers across MENA',
]

function AboutUsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative">
          <section className="mx-auto max-w-4xl px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-24">
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              About Ident-ity.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              A MENA-focused business intelligence and corporate due-diligence
              company, founded 2022.
            </p>
          </section>

          <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-cyan">
              Our Story
            </h2>
            <div className="mt-4 space-y-6 sm:mt-6 sm:space-y-8">
              {story.map((block) => (
                <div
                  key={block.heading}
                  className="border-l-2 border-brand-cyan/40 pl-4 sm:pl-6"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide text-brand-navy">
                    {block.heading}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t bg-brand-mist/40">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
              <div className="rounded-xl border-t-[3px] border-brand-cyan bg-brand-navy p-6 sm:p-8">
                <h2 className="text-xs font-bold uppercase tracking-wide text-brand-cyan">
                  Our Team
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  A 10-person team with a clear vision for MENA intelligence
                  — no rosters, just the roles that get the work done.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {teamComposition.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-white/85"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-brand-navy">
            <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
              <StatTileRow
                stats={[
                  { value: '10', label: 'Jurisdictions' },
                  { value: '5M+', label: 'Companies' },
                  { value: '6', label: 'Solutions' },
                ]}
              />
            </div>
          </section>

          <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
              Work with us.
            </h2>
            <div className="mt-6">
              <Link to="/lets-talk">
                <Button size="lg">
                  Contact Us
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
