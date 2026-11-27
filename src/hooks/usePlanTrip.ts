import { useMutation, useQueryClient } from '@tanstack/react-query'

import { planTrip } from '@/api/trips'
import type { Trip } from '@/types/trip'

export function usePlanTrip(onPlanned: (trip: Trip) => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planTrip,
    onSuccess: (trip) => {
      queryClient.setQueryData(['trip', trip.id], trip)
      onPlanned(trip)
    },
  })
}
