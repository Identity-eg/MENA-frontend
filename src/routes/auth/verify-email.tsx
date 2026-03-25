import { createFileRoute, Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/auth/verify-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 grid place-items-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Check your inbox</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              We&apos;ve sent a verification link to your email address. Please
              click it to confirm your account.
            </CardDescription>
            <Button variant="outline" className="w-full">
              Resend Verification
            </Button>
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to="/auth/login"
            className="text-primary hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
