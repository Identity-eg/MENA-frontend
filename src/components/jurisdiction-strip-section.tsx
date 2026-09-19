import { JurisdictionBadgeRow } from './marketing/jurisdiction-badge-row'

export function JurisdictionStripSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        Coverage across the region
      </h2>
      <JurisdictionBadgeRow className="mt-8" />
    </section>
  )
}
