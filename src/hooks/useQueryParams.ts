import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useQueryParams() {
  const location = useLocation()

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const entries = Array.from(searchParams.entries())
    return {
      get: (key: string) => searchParams.get(key),
      getAll: () => entries.reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {}),
      toObject: <T extends Record<string, string | undefined>>() =>
        entries.reduce((acc, [key, value]) => {
          ;(acc as Record<string, string>)[key] = value
          return acc
        }, {} as T),
    }
  }, [location.search])
}

export default useQueryParams
