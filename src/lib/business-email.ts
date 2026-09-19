import freeEmailDomains from 'free-email-domains'
import { z } from 'zod'

const freeEmailDomainSet = new Set<string>(freeEmailDomains)

export const isBusinessEmail = (email: string) => {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase()
  return domain.length > 0 && !freeEmailDomainSet.has(domain)
}

export const businessEmailSchema = z
  .email('Please enter a valid Business email.')
  .refine(isBusinessEmail, {
    message: 'Please use your work email, not a personal email address.',
  })
