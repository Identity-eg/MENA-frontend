import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Reveal } from './marketing/reveal'
import { Button } from './ui/button'

export function ClosingCtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-cyan/20 blur-[150px]"
      />

      <Reveal className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-balance text-3xl font-semibold leading-[0.98] tracking-display text-brand-navy sm:text-5xl">
          Tell us the counterparty. We will tell you what the record shows.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
          Send us a name and a jurisdiction. You get scope, price, and
          turnaround back before anything is committed.
        </p>
        <div className="mt-10">
          <Link to="/lets-talk">
            <Button
              size="lg"
              className="h-11 rounded-full bg-brand-navy px-7 text-[15px] font-semibold text-white transition-transform hover:bg-brand-navy/90 active:scale-[0.98]"
              data-testid="closing-cta"
            >
              Talk to us
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
