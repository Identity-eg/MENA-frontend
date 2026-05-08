import { memo } from 'react'
import type { TAuthSignatory } from '@/types/company'

export const CompanyDetailAuthSignatoriesTable = memo(function CompanyDetailAuthSignatoriesTable({
  rows,
}: {
  rows: TAuthSignatory[]
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No authorized signatories listed for this company.
      </p>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2.5">Name (EN)</th>
            <th className="px-3 py-2.5">Name (AR)</th>
            <th className="px-3 py-2.5">ID number</th>
            <th className="px-3 py-2.5">Sig. Level (EN)</th>
            <th className="px-3 py-2.5">Sig. Level (AR)</th>
            <th className="px-3 py-2.5">Auth. Limit (EN)</th>
            <th className="px-3 py-2.5">Auth. Limit (AR)</th>
            <th className="px-3 py-2.5">Designation (EN)</th>
            <th className="px-3 py-2.5">Designation (AR)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr
              key={s.id ?? `s-${i}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="px-3 py-2.5">{s.nameEn ?? '—'}</td>
              <td className="px-3 py-2.5">{s.nameAr}</td>
              <td className="px-3 py-2.5 font-mono text-xs">{s.idNumber ?? '—'}</td>
              <td className="px-3 py-2.5">{s.signatureLevelEn ?? '—'}</td>
              <td className="px-3 py-2.5">{s.signatureLevelAr ?? '—'}</td>
              <td className="px-3 py-2.5">{s.authorizationLimitEn ?? '—'}</td>
              <td className="px-3 py-2.5">{s.authorizationLimitAr ?? '—'}</td>
              <td className="px-3 py-2.5">{s.designationEn ?? '—'}</td>
              <td className="px-3 py-2.5">{s.designationAr ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
