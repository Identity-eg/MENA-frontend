import {
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Unlock,
  Users,
  X,
} from 'lucide-react'

import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { clearServerCredentials } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

const items = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Requests', href: '/requests', icon: FileText },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Individuals', href: '/individuals', icon: Users },
  { label: 'My Unlocks', href: '/unlocks', icon: Unlock },
]

interface DashboardSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAccessToken } = useAuthStore()

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-primary" />
          <span className="font-semibold tracking-tight">CompliancePortal</span>
        </div>
        {/* Close button — only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 text-muted-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            activeProps={{
              className: 'bg-accent text-primary hover:text-primary',
            }}
            data-testid={`nav-link-${item.label.toLowerCase()}`}
            onClick={onClose}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <Link to="/">
          <Button
            onClick={async () => {
              await clearServerCredentials()
              clearAccessToken()
              queryClient.clear()
              router.invalidate()
            }}
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-card lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-card lg:hidden animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
