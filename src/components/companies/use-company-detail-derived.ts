import type { TCompany, TSensitiveField } from '@/types/company'
import type { CompanyProfileFieldRow } from './company-detail-types'
import type { SensitiveFieldGroups } from '@/lib/sensitive-fields'
import { groupSensitiveFields, unlockAllTotal } from '@/lib/sensitive-fields'

export type CompanyDetailDerived = {
  /** Public company columns; Sensitive fields are never among them. */
  publicFields: Array<CompanyProfileFieldRow>
  /** The company's Sensitive fields by how they are shown, in the server's order. */
  sensitiveFields: SensitiveFieldGroups
  /** Credits "Unlock all remaining fields" would cost. */
  unlockAllCost: number
  partners: TSensitiveField | undefined
  managers: TSensitiveField | undefined
  authSignatories: TSensitiveField | undefined
}

export function useCompanyDetailDerived(
  company: TCompany,
): CompanyDetailDerived {
  const profileFields: Array<CompanyProfileFieldRow> = [
    { key: 'UNN', label: 'UNN (Jordan-Saudi-Egypt)', value: company.UNN },
    {
      key: 'centralNumber',
      label: 'Central Number (Kuwait)',
      value: company.centralNumber,
    },
    { key: 'civilId', label: 'Civil ID (Kuwait)', value: company.civilId },
    { key: 'legalForm', label: 'Legal Type', value: company.legalForm },
    {
      key: 'classification',
      label: 'Classification',
      value: company.classification,
    },
    { key: 'estDate', label: 'Est. Date', value: company.estDate },
    { key: 'expiryDate', label: 'Expiry Date', value: company.expiryDate },
    { key: 'capital', label: 'Capital', value: company.capital },
    { key: 'status', label: 'Status', value: company.status },
    {
      key: 'entityNumber',
      label: 'Entity Number (Qatar)',
      value: company.entityNumber,
    },
    {
      key: 'TaxRegNumber',
      label: 'Tax Reg Number (Qatar)',
      value: company.TaxRegNumber,
    },
    {
      key: 'unifiedEconomicNumber',
      label: 'Unified Economic Number (Qatar)',
      value: company.unifiedEconomicNumber,
    },
    {
      key: 'bcciIssueDate',
      label: 'BCCI Issue Date (Bahrain)',
      value: company.bcciIssueDate,
    },
    {
      key: 'bcciExpiryDate',
      label: 'BCCI Expiry Date (Bahrain)',
      value: company.bcciExpiryDate,
    },
    {
      key: 'businessNameAr',
      label: 'Business Name (Ar) (Dubai)',
      value: company.businessNameAr,
    },
    {
      key: 'businessNameEn',
      label: 'Business Name (En) (Dubai)',
      value: company.businessNameEn,
    },
    {
      key: 'licenseCategory',
      label: 'License Category (Dubai)',
      value: company.licenseCategory,
    },
    {
      key: 'licenseNumber',
      label: 'License Number (Dubai)',
      value: company.licenseNumber,
    },
    {
      key: 'mainLicenseNumber',
      label: 'Main License Number (Dubai)',
      value: company.mainLicenseNumber,
    },
    {
      key: 'dcciNumber',
      label: 'DCCI Number (Dubai)',
      value: company.dcciNumber,
    },
    {
      key: 'D_B_dunsNumber',
      label: 'D&B Duns Number (Dubai)',
      value: company.D_B_dunsNumber,
    },
    {
      key: 'licenseTarget',
      label: 'License Target (Kuwait)',
      value: company.licenseTarget,
    },
    {
      key: 'lastBudgetStatus',
      label: 'Last Budget Status (Kuwait)',
      value: company.lastBudgetStatus,
    },

    { key: 'amendDate', label: 'Amend Date', value: company.amendDate },
    { key: 'amendType', label: 'Amend Type', value: company.amendType },
    {
      key: 'amendDescription',
      label: 'Amend Description',
      value: company.amendDescription,
    },

    {
      key: 'activityCode',
      label: 'Activity Code',
      value: company.activityCode,
    },
    {
      key: 'activityName',
      label: 'Activity Name',
      value: company.activityName,
    },
    {
      key: 'activityStatus',
      label: 'Activity Status',
      value: company.activityStatus,
    },
    {
      key: 'activity_ISICCode',
      label: 'Activity ISIC Code (Oman)',
      value: company.activity_ISICCode,
    },
    {
      key: 'sectorDescription',
      label: 'Sector Description (Kuwait-Saudi)',
      value: company.sectorDescription,
    },

    { key: 'totalShares', label: 'Total Shares', value: company.totalShares },
    { key: 'shareValue', label: 'Share Value', value: company.shareValue },
    { key: 'currency', label: 'Currency', value: company.currency },
    { key: 'paid', label: 'Paid', value: company.paid },
    {
      key: 'totalCapital',
      label: 'Total Capital',
      value: company.totalCapital,
    },
    { key: 'cashCapital', label: 'Cash Capital', value: company.cashCapital },
    {
      key: 'assetCapital',
      label: 'Asset Capital',
      value: company.assetCapital,
    },
    { key: 'nominated', label: 'Nominated', value: company.nominated },
    { key: 'auth', label: 'Auth', value: company.auth },

    { key: 'country', label: 'Country', value: company.country.nameEn },
  ]

  const sensitiveField = (key: TSensitiveField['key']) =>
    company.sensitiveFields.find((field) => field.key === key)

  return {
    publicFields: profileFields,
    sensitiveFields: groupSensitiveFields(company.sensitiveFields),
    unlockAllCost: unlockAllTotal(company.sensitiveFields),
    partners: sensitiveField('partners'),
    managers: sensitiveField('managers'),
    authSignatories: sensitiveField('authSignatories'),
  }
}
