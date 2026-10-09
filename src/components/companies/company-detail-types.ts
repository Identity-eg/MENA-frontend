export type CompanyProfileFieldRow = {
  key: string
  label: string
  value: string | null | undefined
  /** Masked and not offered for sale: render "Not available for purchase". */
  unavailable?: boolean
}
