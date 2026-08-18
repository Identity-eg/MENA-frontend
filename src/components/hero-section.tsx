import { Link } from '@tanstack/react-router'
import { ArrowRight, FileSearch } from 'lucide-react'

import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(41,182,216,0.22),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Badge
          variant="outline"
          className="rounded-full border-brand-cyan/30 bg-white/5 text-[10px] font-bold uppercase tracking-wide text-brand-cyan sm:text-[11px]"
          data-testid="badge-status"
        >
          MENA Business Intelligence
        </Badge>

        <h1
          className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:mt-8 sm:text-5xl lg:text-6xl"
          data-testid="text-hero-title"
        >
          Source-Verified Business Intelligence{' '}
          <span className="text-brand-cyan">Across MENA</span>
        </h1>

        <p
          className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-lg"
          data-testid="text-hero-subtitle"
        >
          On-demand corporate verification, retrieval, and due diligence across
          10 jurisdictions and 5M+ companies — delivered in 1–3 business days.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-brand-cyan text-brand-navy-deep hover:bg-brand-cyan/90 sm:w-auto"
              data-testid="hero-cta-primary"
            >
              Request a Report
              <ArrowRight />
            </Button>
          </Link>
          <Link to="/solutions" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              data-testid="hero-cta-secondary"
            >
              <FileSearch />
              View Solutions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
