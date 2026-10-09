import { createFileRoute, Link } from '@tanstack/react-router'
import { Building2, ExternalLink, Search, Unlock } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import {
  getUnlocksQueryOptions,
  useGetUnlocks,
} from '@/apis/unlocks/get-unlocks'
import {
  describeUnlockedPerson,
  formatUnlockFieldName,
} from '@/lib/unlocked-value'
import type { TUnlock } from '@/types/unlock'

export const Route = createFileRoute('/_protected/unlocks/')({
  pendingComponent: FullPageLoading,
  component: UnlocksPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUnlocksQueryOptions())
    return {}
  },
})

function UnlockedValue({ unlock }: { unlock: TUnlock }) {
  const value = unlock.unlockedValue
  const fieldName = unlock.lockedField.lockedType.fieldName

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
  const { data } = useGetUnlocks()
  const unlocks = data?.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="My Unlocks"
          subtitle="Direct access to your recently unlocked company intelligence."
        />
      </div>

      {unlocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Unlock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold">No unlocks yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You haven't unlocked any company fields. Browse companies and unlock
            premium data to see it here.
          </p>
          <Link to="/companies">
            <Button className="mt-5" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Browse Companies
            </Button>
          </Link>
        </div>
      ) : (
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
                  dir={unlock.lockedField.company.nameAr ? 'rtl' : 'ltr'}
                >
                  {unlock.lockedField.company.nameAr ??
                    unlock.lockedField.company.nameEn ??
                    '—'}
                </CardTitle>
                {unlock.lockedField.company.nameAr &&
                  unlock.lockedField.company.nameEn && (
                    <div className="text-sm text-muted-foreground font-medium">
                      {unlock.lockedField.company.nameEn}
                    </div>
                  )}
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Unlock size={16} />
                    {formatUnlockFieldName(
                      unlock.lockedField.lockedType.fieldName,
                    )}
                  </span>
                  <UnlockedValue unlock={unlock} />
                </div>
              </CardContent>
              <CardFooter className="bg-transparent p-2">
                <Link
                  to="/companies/$companyId"
                  params={{
                    companyId: String(unlock.lockedField.company.id),
                  }}
                  search={{ unlock: undefined }}
                >
                  <Button variant="ghost">
                    View Full Profile
                    <ExternalLink size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
