import { memo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { TCompany } from '@/types/company'

type CompanyDetailSidebarProps = Pick<
  TCompany,
  'country' | 'industry' | 'legalForm'
> & {
  lockedFieldCount: number
}

export const CompanyDetailSidebar = memo(function CompanyDetailSidebar({
  country,
  industry,
  legalForm,
  lockedFieldCount,
}: CompanyDetailSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
      <Card className="overflow-hidden hidden xl:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Quick info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="flex justify-between py-3 text-sm">
            <span className="text-muted-foreground">Country</span>
            <span className="font-medium text-right">{country.nameEn}</span>
          </div>
          <Separator />
          <div className="flex justify-between py-3 text-sm">
            <span className="text-muted-foreground">Industry</span>
            <span className="font-medium text-right">{industry}</span>
          </div>
          {legalForm && (
            <>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Legal type</span>
                <span className="font-medium text-right">{legalForm}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {lockedFieldCount > 0 && (
        <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Premium fields available
            </p>
            <p className="text-2xl font-bold text-primary">
              {lockedFieldCount} locked
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Unlock individually or all at once below
            </p>
          </CardContent>
        </Card>
      )}
    </aside>
  )
})
