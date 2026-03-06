import { ShieldCheck } from 'lucide-react'

export function HomeFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 border-t pt-8 sm:pt-12 md:flex-row">
        <div className="flex items-center gap-2 grayscale opacity-60">
          <ShieldCheck size={20} />
          <span className="text-sm font-bold tracking-tighter">
            CompliancePortal
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Service Terms
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact Support
          </a>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase">
          &copy; 2026 Compliance Intelligence Platform
        </div>
      </div>
    </footer>
  )
}
