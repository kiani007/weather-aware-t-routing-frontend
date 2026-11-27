import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { TripPlannerPage } from '@/pages/TripPlannerPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TripPlannerPage />
    </QueryClientProvider>
  )
}
