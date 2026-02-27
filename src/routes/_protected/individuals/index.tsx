import { Suspense } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Loader2, Plus, Search, User } from 'lucide-react'
import z from 'zod'
import { parseAsString, useQueryState } from 'nuqs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import {
  getIndividualsQueryOptions,
  useGetIndividuals,
} from '@/apis/individual/get-individuals'
import { useDebounceCallback } from '@/hooks/use-debounce-cb'

function IndividualsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">
        Searching individuals...
      </p>
    </div>
  )
}

function IndividualsStartSearchingState() {
  return (
    <Card className="border-dashed py-12">
      <CardContent className="flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Start searching</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter a person's name, ID number, or email in the search box above
            to find individuals across the MENA region.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const Route = createFileRoute('/_protected/individuals/')({
  component: IndividualSearchPage,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  loaderDeps(opts) {
    return { search: opts.search }
  },
  loader: ({ context, deps }) => {
    const query = deps.search.q?.trim()
    if (!query) return {}
    context.queryClient.ensureQueryData(
      getIndividualsQueryOptions({ q: query }),
    )
    return {}
  },
})

function IndividualSearchResults({ q }: { q: string }) {
  const { data } = useGetIndividuals({ q })
  const individuals = data.data

  return (
    <div className="grid gap-3">
      {individuals.length > 0 ? (
        individuals.map((individual) => (
          <Link
            key={individual.id}
            to="/individuals/$individualId"
            params={{ individualId: String(individual.id) }}
          >
            <Card className="cursor-pointer transition-all hover:bg-accent/50 group">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-5">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center rounded bg-muted group-hover:bg-muted/80 transition-colors">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-sans tracking-tight">
                      {individual.fullName}
                    </div>
                    {individual.email && (
                      <div className="text-sm font-medium text-muted-foreground">
                        {individual.email}
                      </div>
                    )}
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60">
                      {individual.nationality ||
                        individual.countryCode ||
                        'N/A'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <Card className="border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Individual Not Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                We couldn&apos;t find an individual matching your search. You
                can manually request a screening for this person.
              </p>
            </div>
            <Link to="/requests/new/individual">
              <Button className="gap-2 px-6">
                <Plus className="h-4 w-4" /> Request Individual
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function IndividualSearchPage() {
  const [searchParam, setSearchParam] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
  )

  const debounce = useDebounceCallback((e) => setSearchParam(e.target.value))

  const searchQuery = searchParam.trim()
  const hasQuery = searchQuery.length > 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="Individual Search"
        subtitle="Search and verify individuals across the MENA region."
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 h-10"
          placeholder="Search by name, ID number, or keywords..."
          value={searchParam}
          onChange={(e) => debounce(e.target.value)}
        />
      </div>

      {hasQuery ? (
        <Suspense fallback={<IndividualsLoadingFallback />}>
          <IndividualSearchResults q={searchQuery} />
        </Suspense>
      ) : (
        <IndividualsStartSearchingState />
      )}
    </div>
  )
}
