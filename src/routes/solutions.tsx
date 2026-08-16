import {
  Link,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { SolutionMark } from '@/components/brand/logo'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Button } from '@/components/ui/button'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { Logo, SolutionWordmark } from '@/components/brand/logo'
import { StatusBadge } from '@/components/marketing/status-badge'
import { JurisdictionBadgeRow } from '@/components/marketing/jurisdiction-badge-row'
import { activeSolutions, pipelineSolutions } from '@/lib/solutions'

export const Route = createFileRoute('/solutions')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Solutions | Ident-ity' },
      {
        name: 'description',
        content:
          'Ident-RR, IdentBase, and IdentMedia — Ident-ity\'s active MENA business intelligence solutions, with three more in the pipeline.',
      },
    ],
  }),
  component: SolutionsPage,
})

function SolutionsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative">
          <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-24">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-cyan">
              6 Solutions — 3 Active · 3 Pipeline
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              Our Solutions
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Full service catalogues, coverage tables, and pricing are
              available once you register for access.
            </p>
          </section>

          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="space-y-6 sm:space-y-8">
              {activeSolutions.map((solution) => (
                <div
                  key={solution.slug}
                  className="overflow-hidden rounded-xl border border-border lg:grid lg:grid-cols-[280px_1fr]"
                >
                  <div className="flex flex-col justify-between gap-6 bg-brand-navy p-6 sm:p-8 lg:p-10">
                    <div>
                      <SolutionWordmark
                        mark={solution.mark as SolutionMark}
                        className="text-2xl"
                      />
                      <div className="mt-3">
                        <StatusBadge status={solution.status} />
                      </div>
                    </div>
                    <Link to="/auth/signup">
                      <Button
                        size="sm"
                        className="h-auto w-full whitespace-normal py-2.5 text-center leading-snug bg-brand-cyan text-brand-navy-deep hover:bg-brand-cyan/90"
                      >
                        {solution.cta}
                        <ArrowRight className="shrink-0" />
                      </Button>
                    </Link>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <p className="text-sm leading-relaxed text-foreground sm:text-base">
                      {solution.description}
                    </p>
                    {solution.bullets && (
                      <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {solution.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="mt-0.5 size-3.5 shrink-0 text-brand-cyan" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {solution.slug === 'ident-rr' && (
                      <div className="mt-6 border-t pt-5">
                        <JurisdictionBadgeRow className="justify-start" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t bg-brand-mist/40">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Pipeline solutions
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {pipelineSolutions.map((solution) => (
                  <div
                    key={solution.slug}
                    className="rounded-xl border border-border bg-background p-5"
                  >
                    <div className="flex items-center justify-between">
                      <SolutionWordmark
                        mark={solution.mark as SolutionMark}
                        tone="navy"
                        className="text-base"
                      />
                      <StatusBadge status="Soon" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <Logo size="lg" className="mx-auto justify-center" />
            <h2 className="mt-6 text-2xl font-bold text-brand-navy sm:text-3xl">
              Not sure which solution fits?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Talk to us — we'll point you in the right direction.
            </p>
            <div className="mt-6">
              <Link to="/lets-talk">
                <Button size="lg">
                  Talk to Us
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
