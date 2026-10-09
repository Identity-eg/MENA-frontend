import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import type { TUser } from '@/types/user'
import { request } from '../base'

export const getMe = async (): Promise<{ user: TUser } | null> => {
  try {
    const res = await request<{ user: TUser }>({
      url: '/auth/me',
    })
    return res
  } catch {
    return null
  }
}

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ['me'],
    staleTime: Infinity,
    queryFn: getMe,
  })

export const useGetMe = () => {
  return useSuspenseQuery(getMeQueryOptions())
}
