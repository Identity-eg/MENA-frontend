import { FeatureCard } from './marketing/feature-card'
import { whyUs } from '@/lib/why-us'

export function PlatformFeaturesSection() {
  return (
    <section className="border-t bg-brand-mist/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            The Ident-ity Advantage
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Why compliance teams, banks, and law firms across the region work
            with us.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
              accent={item.accent ?? 'cyan'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
