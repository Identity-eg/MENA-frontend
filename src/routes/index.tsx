import { createFileRoute } from '@tanstack/react-router'

import { CapabilitiesSection } from '@/components/capabilities-section'
import { ClosingCtaSection } from '@/components/closing-cta-section'
import { DeliverySection } from '@/components/delivery-section'
import { HeroSection } from '@/components/hero-section'
import { JurisdictionStripSection } from '@/components/jurisdiction-strip-section'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PartnershipTeaserSection } from '@/components/partnership-teaser-section'
import { PlatformFeaturesSection } from '@/components/platform-features-section'
import { SolutionsOverviewSection } from '@/components/solutions-overview-section'
import { FullPageLoading } from '@/components/ui/full-page-loading'

export const Route = createFileRoute('/')({
  pendingComponent: FullPageLoading,
  loader: ({ context }) => {
    const user = context.user
    return user
  },
  head: () => ({
    meta: [
      {
        title: 'Ident-ity | Source-Verified Business Intelligence Across MENA',
      },
      {
        name: 'description',
        content:
          'On-demand corporate retrieval, verification, and due diligence across 12 MENA jurisdictions.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const user = Route.useLoaderData()

  return (
    <MarketingShell user={user}>
      <HeroSection />
      <CapabilitiesSection />
      <SolutionsOverviewSection />
      <DeliverySection />
      <PlatformFeaturesSection />
      <JurisdictionStripSection />
      <PartnershipTeaserSection />
      <ClosingCtaSection />
    </MarketingShell>
  )
}
