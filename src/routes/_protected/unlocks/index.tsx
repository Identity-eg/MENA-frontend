import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  Coins,
  ExternalLink,
  RotateCw,
  Search,
  Unlock,
} from 'lucide-react'

import type { TUnlock } from '@/types/unlock'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { getUnlocksQueryOptions } from '@/apis/unlocks/get-unlocks'
import { formatCredits } from '@/lib/credits'
import { describeUnlockedPerson } from '@/lib/unlocked-value'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_protected/unlocks/')({
  component: UnlocksPage,
  // Start the read early; the page renders its own loading, empty and error states.
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(getUnlocksQueryOptions())
  },
})

const unlockedOn = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

function UnlockedValue({ unlock }: { unlock: TUnlock }) {
  const value = unlock.value
  const fieldName = unlock.field.key

  if (value == null || value === '') {
    return <span className="font-medium">—</span>
  }
  if (!Array.isArray(value)) {
    return <span className="font-medium wrap-break-word">{value}</span>
  }
  if (value.length === 0) {
    return <span className="text-muted-foreground">No records</span>
  }

  return (
    <ul className="divide-y rounded-lg border">
      {value.map((person, index) => {
        const { name, details } = describeUnlockedPerson(fieldName, person)
        return (
          <li key={person.id ?? index} className="px-3 py-2">
            <p className="font-medium">{name}</p>
            {details.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {details.join(' · ')}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function UnlocksPage() {
  const query = useQuery(getUnlocksQueryOptions())

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="My Unlocks"
          subtitle="Direct access to your recently unlocked company intelligence."
        />
      </div>

      <div aria-live="polite" aria-busy={query.isFetching}>
        {query.isPending ? (
          <UnlocksSkeleton />
        ) : query.isError ? (
          <UnlocksError
            retrying={query.isRefetching}
            onRetry={() => void query.refetch()}
          />
        ) : query.data.data.length === 0 ? (
          <NoUnlocksYet />
        ) : (
          <UnlockGrid unlocks={query.data.data} />
        )}
      </div>
    </div>
  )
}

function NoUnlocksYet() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Unlock className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold">No unlocks yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        You haven't unlocked any company fields. Browse companies and unlock
        premium data to see it here.
      </p>
      <Link
        to="/companies"
        className={cn(buttonVariants({ size: 'lg' }), 'mt-5 min-h-11 gap-2')}
      >
        <Search className="h-4 w-4" aria-hidden />
        Browse Companies
      </Link>
    </div>
  )
}

function UnlocksError({
  retrying,
  onRetry,
}: {
  retrying: boolean
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <RotateCw className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold">
        Your Unlocks couldn&rsquo;t be loaded
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Check your connection and try again. Nothing you unlocked is lost.
      </p>
      <Button
        variant="outline"
        size="lg"
        className="mt-5 min-h-11 gap-2"
        onClick={onRetry}
        disabled={retrying}
      >
        <RotateCw
          className={cn(
            'size-4',
            retrying && 'animate-spin motion-reduce:animate-none',
          )}
          aria-hidden
        />
        Try again
      </Button>
    </div>
  )
}

/** Placeholder cards matching the Unlock cards while the list loads. */
function UnlocksSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your Unlocks"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-xl ring-1 ring-border">
          <div className="space-y-3 border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex justify-between border-t pt-3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UnlockGrid({ unlocks }: { unlocks: Array<TUnlock> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {unlocks.map((unlock) => (
        <Card className="p-0" key={unlock.id}>
          <CardHeader className="bg-muted/30 border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className="font-semibold bg-green-50 text-green-600 border-green-400 dark:bg-green-950/50 dark:text-green-400 dark:border-green-700"
              >
                Unlocked
              </Badge>
            </div>
            <CardTitle
              className="text-lg mt-3 font-sans"
              dir={unlock.company.nameAr ? 'rtl' : 'ltr'}
            >
              {unlock.company.nameAr ?? unlock.company.nameEn ?? '—'}
            </CardTitle>
            {unlock.company.nameAr && unlock.company.nameEn && (
              <div className="text-sm text-muted-foreground font-medium">
                {unlock.company.nameEn}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <Unlock size={16} />
                {unlock.field.label}
              </span>
              <UnlockedValue unlock={unlock} />
            </div>
            <dl className="flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Credits charged</dt>
                <Coins className="h-3.5 w-3.5 text-primary" aria-hidden />
                <dd className="font-medium text-foreground tabular-nums">
                  {unlock.creditsCharged > 0
                    ? formatCredits(unlock.creditsCharged)
                    : 'No Credits charged'}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Unlocked on</dt>
                <dd>
                  <time dateTime={unlock.createdAt}>
                    {unlockedOn.format(new Date(unlock.createdAt))}
                  </time>
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="bg-transparent p-2">
            <Link
              to="/companies/$companyId"
              params={{
                companyId: String(unlock.company.id),
              }}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'lg' }),
                'min-h-11',
              )}
            >
              View Full Profile
              <ExternalLink size={16} aria-hidden />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
