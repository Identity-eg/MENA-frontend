import { memo } from 'react'
import { Building2, Globe } from 'lucide-react'
import type { TCompany } from '@/types/company'

type CompanyDetailHeroProps = Pick<TCompany, 'nameEn' | 'nameAr' | 'industry' | 'country'>

export const CompanyDetailHero = memo(function CompanyDetailHero({
  nameEn,
  nameAr,
  industry,
  country,
}: CompanyDetailHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-card via-card to-muted/30 px-6 py-8 shadow-sm sm:px-8 sm:py-10">
      <div className="absolute right-0 top-0 h-32 w-48 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {nameEn}
              </h1>
              <p className="text-sm text-muted-foreground truncate">{nameAr}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {country.nameEn}
            </span>
            {industry && (
              <>
                <span className="hidden sm:inline text-muted-foreground/40">
                  •
                </span>
                <span>{industry}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})
