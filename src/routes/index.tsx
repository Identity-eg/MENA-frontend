import { createFileRoute } from '@tanstack/react-router'

import { ClosingCtaSection } from '@/components/closing-cta-section'
import { HeroSection } from '@/components/hero-section'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { JurisdictionStripSection } from '@/components/jurisdiction-strip-section'
import { PartnershipTeaserSection } from '@/components/partnership-teaser-section'
import { PlatformFeaturesSection } from '@/components/platform-features-section'
import { SolutionsOverviewSection } from '@/components/solutions-overview-section'
import { StatusSection } from '@/components/status-section'
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
          'On-demand corporate retrieval, verification, and due diligence across 10 MENA jurisdictions.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const user = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative">
          <HeroSection />
          <StatusSection />
          <SolutionsOverviewSection />
          <PlatformFeaturesSection />
          <JurisdictionStripSection />
          <PartnershipTeaserSection />
          <ClosingCtaSection />
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
