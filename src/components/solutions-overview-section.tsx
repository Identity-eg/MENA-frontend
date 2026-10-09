import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'

import { activeSolutions, pipelineSolutions } from '@/lib/solutions'
import { SolutionWordmark, type SolutionMark } from './brand/logo'
import { Reveal } from './marketing/reveal'
import { Section, SectionHeading } from './marketing/section'
import { StatusBadge } from './marketing/status-badge'

export function SolutionsOverviewSection() {
  return (
    <Section id="solutions" className="border-t border-border">
      <SectionHeading
        eyebrow="What we run"
        title="Three services live today, three more in build."
        body="Each one answers a different question about a MENA counterparty: what the registry says, what the market looks like at scale, and what the record does not tell you."
        aside={
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan-ink"
          >
            All solutions
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="mt-14 divide-y divide-border border-y border-border sm:mt-16">
        {activeSolutions.map((solution, index) => (
          <Reveal key={solution.slug} delay={index * 70}>
            <article className="grid gap-6 py-9 lg:grid-cols-12 lg:gap-10 lg:py-11">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <SolutionWordmark
                    mark={solution.mark as SolutionMark}
                    tone="navy"
                    className="text-2xl"
                  />
                  <StatusBadge status={solution.status} />
                </div>
              </div>

              <div className="lg:col-span-8">
                <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                  {solution.description}
                </p>

                {solution.bullets && (
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 rounded-2xl border border-border bg-brand-mist/50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            In build for 2027
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {pipelineSolutions.map((solution) => (
              <SolutionWordmark
                key={solution.slug}
                mark={solution.mark as SolutionMark}
                tone="navy"
                className="text-lg opacity-60"
              />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
