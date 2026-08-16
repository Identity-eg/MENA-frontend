export type Jurisdiction = {
  code: string
  name: string
}

// The 11 MENA jurisdictions covered by Ident-ity's services (PRD §10, sourced
// from the Aug 2026 price list). Kept as one structured file so the coverage
// strip, footer list, and Contact form dropdown all stay in sync (FR4).
//
// `code` is the ISO 3166-1 alpha-2 code, used to look up the matching flag
// SVG from `country-flag-icons` (flag emoji render as plain text on Windows
// desktop browsers, which lack the glyphs — see jurisdiction-badge-row.tsx).
export const jurisdictions: Array<Jurisdiction> = [
  { code: 'eg', name: 'Egypt' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'kw', name: 'Kuwait' },
  { code: 'qa', name: 'Qatar' },
  { code: 'ae', name: 'UAE' },
  { code: 'om', name: 'Oman' },
  { code: 'sy', name: 'Syria' },
  { code: 'ma', name: 'Morocco' },
  { code: 'dz', name: 'Algeria' },
  { code: 'tn', name: 'Tunisia' },
  { code: 'ir', name: 'Iran' },
]
