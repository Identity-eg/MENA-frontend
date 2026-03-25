import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { request } from '../base'
import type { TUser } from '@/types/user'

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

export const getMeAction = createServerFn().handler(async () => {
  return getMe()
})

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ['me'],
    staleTime: Infinity,
    queryFn: getMe,
  })

export const useGetMe = () => {
  return useSuspenseQuery(getMeQueryOptions())
}
