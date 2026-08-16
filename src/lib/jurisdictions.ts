export type Jurisdiction = {
  code: string
  name: string
  flag: string
}

// The 11 MENA jurisdictions covered by Ident-ity's services (PRD §10, sourced
// from the Aug 2026 price list). Kept as one structured file so the coverage
// strip, footer list, and Contact form dropdown all stay in sync (FR4).
export const jurisdictions: Array<Jurisdiction> = [
  { code: 'eg', name: 'Egypt', flag: '🇪🇬' },
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'kw', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'qa', name: 'Qatar', flag: '🇶🇦' },
  { code: 'ae', name: 'UAE', flag: '🇦🇪' },
  { code: 'om', name: 'Oman', flag: '🇴🇲' },
  { code: 'sy', name: 'Syria', flag: '🇸🇾' },
  { code: 'ma', name: 'Morocco', flag: '🇲🇦' },
  { code: 'dz', name: 'Algeria', flag: '🇩🇿' },
  { code: 'tn', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'ir', name: 'Iran', flag: '🇮🇷' },
]
