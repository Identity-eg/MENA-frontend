import { memo } from 'react'
import type { TCompanyManager } from '@/types/company'

export const CompanyDetailManagersTable = memo(function CompanyDetailManagersTable({
  rows,
}: {
  rows: TCompanyManager[]
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No managers listed for this company.
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
            <th className="px-3 py-2.5">Position</th>
            <th className="px-3 py-2.5">Authority</th>
            <th className="px-3 py-2.5">Nationality</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m, i) => (
            <tr
              key={m.id ?? `m-${i}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="px-3 py-2.5">{m.nameEn ?? '—'}</td>
              <td className="px-3 py-2.5">{m.nameAr}</td>
              <td className="px-3 py-2.5 font-mono text-xs">{m.idNumber}</td>
              <td className="px-3 py-2.5">{m.position ?? '—'}</td>
              <td className="px-3 py-2.5">{m.authority ?? '—'}</td>
              <td className="px-3 py-2.5">{m.nationality ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
