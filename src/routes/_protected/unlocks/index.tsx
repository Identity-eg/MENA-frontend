import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, ExternalLink, Search, Unlock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import {
  getUnlocksQueryOptions,
  useGetUnlocks,
} from '@/apis/unlocks/get-unlocks'

export const Route = createFileRoute('/_protected/unlocks/')({
  component: UnlocksPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUnlocksQueryOptions())
    return {}
  },
})

function formatFieldName(fieldName: string) {
  return (
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ')
  )
}

function formatUnlockedValue(
  value: string | number | Array<string> | null | undefined,
): string {
  if (value == null) return '—'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
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
                <CardTitle className="text-lg mt-3 font-sans" dir="rtl">
                  {unlock.lockedField.company.nameAr ??
                    unlock.lockedField.company.nameEn}
                </CardTitle>
                <div className="text-sm text-muted-foreground font-medium">
                  {unlock.lockedField.company.nameEn}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Unlock size={16} />
                    {formatFieldName(unlock.lockedField.lockedType.fieldName)}
                  </span>
                  <span className="font-medium">
                    {formatUnlockedValue(unlock.unlockedValue)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="bg-transparent p-2">
                <Link
                  to="/companies/$companyId"
                  params={{
                    companyId: String(unlock.lockedField.company.id),
                  }}
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
