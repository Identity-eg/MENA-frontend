import { StatTile } from './marketing/stat-tile'

const stats = [
  { value: '10', label: 'Jurisdictions' },
  { value: '5M+', label: 'Companies' },
  { value: '6', label: 'Solutions' },
  { value: '1–3 BD', label: 'Turnaround' },
]

export function StatusSection() {
  return (
    <section className="relative bg-brand-navy pb-16 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
