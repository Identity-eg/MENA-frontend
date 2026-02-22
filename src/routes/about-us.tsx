import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

export const Route = createFileRoute('/about-us')({
  component: AboutUsPage,
})

function AboutUsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user?.user} />

        <main className="relative p-6">
          <h1 className="text-2xl font-bold">About us</h1>
          <p className="mt-2 text-muted-foreground">About us content.</p>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
