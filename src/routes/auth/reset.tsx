import { Link, createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/auth/reset')({
  pendingComponent: FullPageLoading,
  component: ResetPasswordPage,
})

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            className="rounded-xl border bg-card p-3 hover:border-primary/30 transition-all"
            to="/"
          >
            <ShieldCheck className="h-6 w-6 text-primary" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Request a password reset link for your account
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Password reset flow can be implemented here (e.g. enter email to
              receive reset link).
            </p>
            <Link
              to="/auth/login"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full mt-4',
              )}
            >
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
