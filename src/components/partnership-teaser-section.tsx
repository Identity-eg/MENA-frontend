import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from './ui/button'
import { partnershipTiers } from '@/lib/partnership-tiers'

export function PartnershipTeaserSection() {
  return (
    <section className="border-t bg-brand-navy">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            What we hope to be for you
          </h2>
          <p className="mt-2 text-sm text-brand-cyan sm:text-base">
            Three ways we can work together
          </p>
        </div>

        <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
          {partnershipTiers.map((tier) => (
            <div
              key={tier.index}
              className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6"
            >
              <div className="font-black text-3xl text-brand-cyan/70 sm:text-4xl">
                {tier.index}
              </div>
              <div className="border-brand-cyan/40 sm:border-l sm:pl-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                  {tier.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  {tier.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link to="/lets-talk">
            <Button
              size="lg"
              className="bg-brand-cyan text-brand-navy-deep hover:bg-brand-cyan/90"
            >
              Talk to us about partnering
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
