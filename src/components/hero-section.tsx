import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { CoverageMarquee } from './marketing/coverage-marquee'
import { RegistryPreview } from './marketing/registry-preview'
import { Reveal } from './marketing/reveal'
import { Button } from './ui/button'

const proofPoints = [
  { value: '12', label: 'Jurisdictions' },
  { value: '5M+', label: 'Companies on file' },
  { value: '1-3 days', label: 'Typical turnaround' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-brand-cyan/20 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cyan-ink">
            Middle East and North Africa
          </p>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[0.98] tracking-display text-brand-navy sm:text-5xl lg:text-6xl">
            The corporate record,{' '}
            <span className="text-brand-cyan-ink">
              retrieved at the source.
            </span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Verification, retrieval, and due diligence across 12 MENA
            jurisdictions, filed by our own people and returned in days.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/lets-talk" className="sm:w-auto">
              <Button
                size="lg"
                className="h-11 w-full rounded-full bg-brand-navy px-6 text-[15px] font-semibold text-white transition-transform hover:bg-brand-navy/90 active:scale-[0.98] sm:w-auto"
                data-testid="hero-cta-primary"
              >
                Talk to us
                <ArrowRight />
              </Button>
            </Link>
            <Link to="/solutions" className="sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full rounded-full border-border bg-white px-6 text-[15px] font-semibold text-brand-navy transition-transform hover:bg-brand-mist active:scale-[0.98] sm:w-auto"
                data-testid="hero-cta-secondary"
              >
                See solutions
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-6">
          <div className="relative mx-auto max-w-xl lg:mx-0 lg:ms-auto">
            {/* Two offset plates behind the record give the panel depth without
                borrowing a stock photograph to fill the column. */}
            <div
              aria-hidden
              className="absolute inset-x-8 -top-6 h-24 rounded-2xl border border-border/60 bg-brand-mist/50"
            />
            <div
              aria-hidden
              className="absolute inset-x-4 -top-3 h-24 rounded-2xl border border-border bg-brand-mist"
            />
            <RegistryPreview className="relative" />
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-20 max-w-7xl px-5 sm:mt-24 sm:px-8">
        <dl className="grid gap-x-8 gap-y-8 border-y border-border py-9 sm:grid-cols-3">
          {proofPoints.map((point) => (
            <div key={point.label}>
              <dt className="sr-only">{point.label}</dt>
              <dd className="text-3xl font-semibold tabular-nums leading-none tracking-display text-brand-navy">
                {point.value}
              </dd>
              <p className="mt-2 text-sm text-muted-foreground">
                {point.label}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-12 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Coverage
        </p>
        <CoverageMarquee className="mt-5" />
      </div>
    </section>
  )
}
