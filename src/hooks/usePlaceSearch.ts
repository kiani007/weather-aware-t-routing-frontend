import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { searchPlaces } from '@/api/geocoding'

import { useDebouncedValue } from './useDebouncedValue'

const MIN_QUERY_LENGTH = 3

export function usePlaceSearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 350)
  return useQuery({
    queryKey: ['places', debounced.toLowerCase()],
    queryFn: ({ signal }) => searchPlaces(debounced, signal),
    enabled: debounced.length >= MIN_QUERY_LENGTH,
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  })
}
