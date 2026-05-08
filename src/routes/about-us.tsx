import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

export const Route = createFileRoute('/about-us')({
  pendingComponent: FullPageLoading,
  component: AboutUsPage,
})

function AboutUsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative p-6">
          <h1 className="text-2xl font-bold">About us</h1>
          <p className="mt-2 text-muted-foreground">About us content.</p>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
