import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchTrip } from '@/api/trips'
import type { Trip } from '@/types/trip'

/** Loads a saved trip by id, e.g. from the recent-trips list. */
export function useLoadTrip(onLoaded: (trip: Trip) => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fetchTrip,
    onSuccess: (trip) => {
      queryClient.setQueryData(['trip', trip.id], trip)
      onLoaded(trip)
    },
  })
}
