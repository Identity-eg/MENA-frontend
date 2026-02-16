import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute(
  '/_protected/requests/payment-failed/$requestId',
)({
  component: PaymentFailedPage,
})

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function PaymentFailedPage() {
  const { requestId } = Route.useParams()
  const id = Number(requestId)

  return (
    <div className="mx-auto max-w-lg space-y-6 py-12">
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-lg">
                Payment cancelled or failed
              </CardTitle>
              <p className="mt-1 text-sm font-normal text-muted-foreground">
                You left the payment page or the payment could not be completed.
                Your request is still pending payment.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Request{' '}
            <span className="font-mono font-medium">{formatRequestId(id)}</span>{' '}
            remains in &quot;Invoice generated&quot; status. You can try again
            when ready.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/requests/$requestId" params={{ requestId: String(id) }}>
              <Button className="gap-2">
                <CreditCard className="h-4 w-4" />
                Back to request & pay again
              </Button>
            </Link>
            <Link to="/requests">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All requests
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
