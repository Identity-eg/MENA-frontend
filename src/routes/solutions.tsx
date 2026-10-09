import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'

import { SolutionWordmark, type SolutionMark } from '@/components/brand/logo'
import { CoverageMarquee } from '@/components/marketing/coverage-marquee'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Reveal } from '@/components/marketing/reveal'
import { Section, SectionHeading } from '@/components/marketing/section'
import { StatusBadge } from '@/components/marketing/status-badge'
import { DatabaseScale } from '@/components/marketing/visuals/database-scale'
import { OwnershipGraph } from '@/components/marketing/visuals/ownership-graph'
import { ScreeningList } from '@/components/marketing/visuals/screening-list'
import { Button } from '@/components/ui/button'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import { activeSolutions, pipelineSolutions } from '@/lib/solutions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/solutions')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Solutions | Ident-ity' },
      {
        name: 'description',
        content:
          "Ident-RR, IdentBase, and IdentMedia: Ident-ity's active MENA business intelligence solutions, with three more in the pipeline.",
      },
    ],
  }),
  component: SolutionsPage,
})

const solutionVisuals: Record<string, () => React.JSX.Element> = {
  'ident-rr': OwnershipGraph,
  'ident-base': DatabaseScale,
  'ident-media': ScreeningList,
}

function SolutionsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <MarketingShell user={user}>
      <Section className="pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Six solutions, three live"
          title="Our solutions."
          body="Full service catalogues, coverage tables, and pricing are available once you register for access."
        />
        <CoverageMarquee className="mt-14" />
      </Section>

      <Section className="border-t border-border pt-0 sm:pt-0">
        <div className="space-y-20 sm:space-y-28">
          {activeSolutions.map((solution, index) => {
            const flipped = index % 2 === 1
            const SolutionVisual = solutionVisuals[solution.slug]
            return (
              <Reveal key={solution.slug}>
                <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div
                    className={cn(
                      'lg:col-span-5',
                      flipped ? 'lg:order-2' : 'lg:order-1',
                    )}
                  >
                    <SolutionVisual />
                  </div>

                  <div
                    className={cn(
                      'lg:col-span-7',
                      flipped ? 'lg:order-1' : 'lg:order-2',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <SolutionWordmark
                        mark={solution.mark as SolutionMark}
                        tone="navy"
                        className="text-2xl"
                      />
                      <StatusBadge status={solution.status} />
                    </div>
                    <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
                      {solution.description}
                    </p>
                    {solution.bullets && (
                      <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                        {solution.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2.5 text-sm text-foreground"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-brand-cyan-ink" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {solution.cta && (
                      <p className="mt-6 text-sm text-muted-foreground">
                        {solution.cta}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="In build for 2027" title="What comes next." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {pipelineSolutions.map((solution) => (
            <Reveal key={solution.slug} className="bg-white p-7 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <SolutionWordmark
                  mark={solution.mark as SolutionMark}
                  tone="navy"
                  className="text-lg"
                />
                <StatusBadge status="Soon" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {solution.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-semibold leading-[1.02] tracking-heading text-brand-navy sm:text-4xl">
            Not sure which solution fits?
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-base text-muted-foreground">
            Send us the counterparty and the jurisdiction. We will point you at
            the right service.
          </p>
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
