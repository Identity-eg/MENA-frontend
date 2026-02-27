/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'

export function useDebounceCallback<T extends (...args: Array<any>) => void>(
  callback: T,
  delay: number = 500,
) {
  // eslint-disable-next-line no-undef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedCallback = (...args: Array<any>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback as T
}
