import type { RouteOption } from '@/types/trip'

export function RecommendationNote({ route }: { route: RouteOption }) {
  const blocked = route.max_risk.key === 'no_travel'
  return (
    <section className="space-y-0.5" aria-label="Recommendation">
      <p className="text-sm font-semibold">Recommended: {route.name}</p>
      <p className="text-xs leading-snug text-muted-foreground">
        {blocked && 'Every option crosses No Travel conditions; this one is least exposed. '}
        {route.recommendation_reason}
      </p>
    </section>
  )
}
