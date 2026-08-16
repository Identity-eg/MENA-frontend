import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { SolutionWordmark } from './brand/logo'
import { StatusBadge } from './marketing/status-badge'
import type { SolutionMark } from './brand/logo'
import { activeSolutions, pipelineSolutions } from '@/lib/solutions'

export function SolutionsOverviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Our Solutions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            6 solutions — 3 active, 3 in the pipeline.
          </p>
        </div>
        <Link
          to="/solutions"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:text-brand-cyan transition-colors"
        >
          See all solutions
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
        {activeSolutions.map((solution) => (
          <div
            key={solution.slug}
            className="flex flex-col rounded-xl bg-brand-navy p-6"
          >
            <div className="flex items-center justify-between">
              <SolutionWordmark
                mark={solution.mark as SolutionMark}
                className="text-lg"
              />
              <StatusBadge status={solution.status} />
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
              {solution.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-border p-4 sm:p-5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Coming soon
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {pipelineSolutions.map((solution) => (
            <SolutionWordmark
              key={solution.slug}
              mark={solution.mark as SolutionMark}
              tone="navy"
              className="text-sm opacity-60"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
