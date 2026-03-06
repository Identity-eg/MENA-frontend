import { Link } from '@tanstack/react-router'
import { ArrowRight, Search } from 'lucide-react'

import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:py-32 text-center bg-radial-[at_50%_30%] from-primary/5 to-primary/0 to-50%">
      <Badge
        variant="outline"
        className="rounded-full text-[10px] sm:text-[11px] font-bold uppercase text-primary border-primary/20 mb-6 sm:mb-8"
        data-testid="badge-status"
      >
        Evaluation Hours: 07:00 – 19:00 (EET)
      </Badge>

      <h1
        className="mx-auto max-w-4xl font-serif text-3xl sm:text-5xl lg:text-7xl"
        data-testid="text-hero-title"
      >
        Institutional-Grade <br />
        <span className="text-primary italic">Compliance Intelligence</span>
      </h1>

      <p
        className="mt-4 sm:mt-8 mx-auto max-w-2xl text-sm sm:text-lg text-muted-foreground leading-relaxed text-pretty"
        data-testid="text-hero-subtitle"
      >
        The unified platform for MENA-focused third-party risk management.
        Request high-fidelity reports for individuals and companies with rapid
        evaluation.
      </p>

      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Link
          to="/individuals"
          data-testid="hero-cta-primary"
          className="w-full sm:w-auto"
        >
          <Button size="lg" className="w-full sm:w-50">
            Search Individual
            <ArrowRight />
          </Button>
        </Link>
        <Link
          to="/companies"
          data-testid="hero-cta-secondary"
          className="w-full sm:w-auto"
        >
          <Button variant="outline" size="lg" className="w-full sm:w-50">
            <Search />
            Explore Company
          </Button>
        </Link>
      </div>
    </section>
  )
}
