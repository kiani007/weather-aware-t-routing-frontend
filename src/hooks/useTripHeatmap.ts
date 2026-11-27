import { useQuery } from '@tanstack/react-query'

import { fetchTripHeatmap } from '@/api/trips'

export function useTripHeatmap(tripId: string | undefined) {
  return useQuery({
    queryKey: ['heatmap', tripId],
    queryFn: ({ signal }) => fetchTripHeatmap(tripId!, signal),
    enabled: Boolean(tripId),
    staleTime: 1000 * 60 * 20,
  })
}
