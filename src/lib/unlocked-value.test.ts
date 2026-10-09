import { describe, expect, it } from 'vitest'

import { describeUnlockedPerson, formatUnlockFieldName } from './unlocked-value'

describe('describeUnlockedPerson', () => {
  it('renders a partner with share and nationality, preferring English', () => {
    expect(
      describeUnlockedPerson('partners', {
        nameAr: 'أحمد',
        nameEn: 'Ahmed',
        percentage: '40',
        nationalityAr: 'كويتي',
        nationalityEn: null,
      }),
    ).toEqual({ name: 'Ahmed', details: ['40% share', 'كويتي'] })
  })

  it('falls back to the Arabic name and shows manager position', () => {
    expect(
      describeUnlockedPerson('managers', {
        nameAr: 'سارة',
        nameEn: '',
        positionEn: 'General Manager',
      }),
    ).toEqual({ name: 'سارة', details: ['General Manager'] })
  })

  it('labels known fields', () => {
    expect(formatUnlockFieldName('authSignatories')).toBe(
      'Authorized signatories',
    )
  })
})
