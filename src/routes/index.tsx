import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/hero-section'
import { PlatformFeaturesSection } from '@/components/platform-features-section'
import { StatusSection } from '@/components/status-section'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    const user = context.user
    return user
  },
  component: HomePage,
})

export default function HomePage() {
  const user = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user?.user} />

        <main className="relative">
          <HeroSection />

          <PlatformFeaturesSection />

          <StatusSection />

          <HomeFooter />
        </main>
      </div>
    </div>
  )
}
