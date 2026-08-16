import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from './ui/button'

export function ClosingCtaSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h2 className="text-2xl font-bold text-brand-navy sm:text-4xl">
        Let's talk about your MENA intelligence needs.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        Tell us what you're looking for and we'll route you to the right
        solution.
      </p>
      <div className="mt-8">
        <Link to="/lets-talk">
          <Button size="lg">
            Contact Us
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </section>
  )
}
