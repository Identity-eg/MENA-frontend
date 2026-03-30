import { memo } from 'react'
import type { TCompanyPartner } from '@/types/company'

export const CompanyDetailPartnersTable = memo(function CompanyDetailPartnersTable({
  rows,
}: {
  rows: TCompanyPartner[]
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No partners listed for this company.
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
            <th className="px-3 py-2.5">Ownership %</th>
            <th className="px-3 py-2.5">Nationality</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr
              key={p.id ?? `p-${i}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="px-3 py-2.5">{p.nameEn ?? '—'}</td>
              <td className="px-3 py-2.5">{p.nameAr}</td>
              <td className="px-3 py-2.5 font-mono text-xs">{p.idNumber}</td>
              <td className="px-3 py-2.5">
                {p.percentage != null ? `${p.percentage}%` : '—'}
              </td>
              <td className="px-3 py-2.5">{p.nationality ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
