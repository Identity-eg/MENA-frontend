import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HeroSection } from '@/components/hero-section'
import { StatusSection } from '@/components/status-section'
import { SolutionsOverviewSection } from '@/components/solutions-overview-section'
import { PlatformFeaturesSection } from '@/components/platform-features-section'
import { JurisdictionStripSection } from '@/components/jurisdiction-strip-section'
import { PartnershipTeaserSection } from '@/components/partnership-teaser-section'
import { ClosingCtaSection } from '@/components/closing-cta-section'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

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
          'On-demand corporate verification, retrieval, and due diligence across 10 MENA jurisdictions and 5M+ companies.',
      },
    ],
  }),
  component: HomePage,
})

export default function HomePage() {
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
