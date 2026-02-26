import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
