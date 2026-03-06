import { Badge } from './ui/badge'

const statusData = [
  {
    label: 'Average TAT',
    value: '24h',
  },
  {
    label: 'Data Accuracy',
    value: '99.9%',
  },
  {
    label: 'Entities Tracked',
    value: '15k+',
  },
]

export function StatusSection() {
  return (
    <section className="bg-muted/30 border-y py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center justify-between gap-6 sm:gap-8 md:flex-row">
        <div className="flex gap-6 sm:gap-12">
          {statusData.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold text-muted-foreground mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <Badge
          variant="outline"
          className="p-3 sm:p-4 bg-white gap-2 text-xs sm:text-sm whitespace-nowrap"
        >
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          Evaluators Online: Egypt (GMT+2)
        </Badge>
      </div>
    </section>
  )
}
