import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react'

export function getCompanyDetailFieldIcon(key: string): LucideIcon {
  switch (key) {
    case 'phone':
      return Phone
    case 'address':
      return MapPin
    case 'email':
      return Mail
    case 'website':
      return Globe
    case 'partners':
      return Users
    case 'managers':
      return Briefcase
    default:
      return Lock
  }
}
