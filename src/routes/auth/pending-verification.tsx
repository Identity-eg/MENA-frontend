import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Clock, Mail, ShieldCheck } from 'lucide-react'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/auth/pending-verification')({
  pendingComponent: FullPageLoading,
  component: PendingVerificationPage,
})

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="absolute inset-0 app-grid opacity-[0.2]" />
      <Card className="w-full max-w-lg relative z-10 text-center overflow-hidden">
        <div className="h-2 w-full bg-primary/20 absolute top-0 left-0">
          <div className="h-full bg-primary w-1/3 animate-[progress_2s_ease-in-out_infinite]" />
        </div>

        <CardHeader className="py-8">
          <div className="mx-auto h-16 w-16 rounded-2xl border bg-card grid place-items-center mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Application Received</CardTitle>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Your request for access is being reviewed by our compliance team.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid gap-6 text-left max-w-md mx-auto">
            <div className="flex gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="size-3 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Step 1: Admin Review</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We verify your work email and institutional affiliation to
                  ensure platform security.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-3 text-muted-foreground" />
              </div>
              <div className="opacity-50">
                <h4 className="font-bold text-sm">Step 2: Invitation Link</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once approved, you'll receive a secure token via email to set
                  up your password.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-2 text-xs text-muted-foreground flex items-center gap-2 border border-border/50">
            <ShieldCheck className="size-4 shrink-0" />
            Typical review time: 2–4 business hours.
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/20 justify-center">
          <Link to="/">
            <Button variant="ghost">Return Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
