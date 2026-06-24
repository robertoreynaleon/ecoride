import type { Coordinates, RouteChoice } from '../types/rideWizard'

const GEOAPIFY_ROUTING_API_URL = 'https://api.geoapify.com/v1/routing'

export type GeoapifyRouteGeometry = {
  type: string
  coordinates: unknown
}

export type GeoapifyRouteFeature = {
  geometry: GeoapifyRouteGeometry
  properties: {
    distance: number
    time: number
  }
}

export type GeoapifyRoutingResponse = {
  features: GeoapifyRouteFeature[]
}

export type RouteCalculationOptions = {
  start: Coordinates
  end: Coordinates
  waypoints?: Coordinates[]
  routeChoice: RouteChoice
  signal?: AbortSignal
}

export type RouteCalculationResult = {
  distanceMeters: number
  durationSeconds: number
  geometry: GeoapifyRouteGeometry
}

function getGeoapifyApiKey(): string {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY

  if (!apiKey) {
    throw new Error('La clé API Geoapify est manquante.')
  }

  return apiKey
}

function formatGeoapifyWaypoint({ lat, lon }: Coordinates): string {
  return `${lat},${lon}`
}

export async function calculateRoute({
  start,
  end,
  waypoints = [],
  routeChoice,
  signal,
}: RouteCalculationOptions): Promise<RouteCalculationResult> {
  const routeWaypoints = [start, ...waypoints, end].map(formatGeoapifyWaypoint).join('|')

  const params = new URLSearchParams({
    waypoints: routeWaypoints,
    mode: 'drive',
    apiKey: getGeoapifyApiKey(),
  })

  if (routeChoice === 'no_tolls') {
    params.set('avoid', 'tolls')
  }

  const response = await fetch(`${GEOAPIFY_ROUTING_API_URL}?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error('Le calcul du trajet est momentanément indisponible.')
  }

  const data = (await response.json()) as GeoapifyRoutingResponse
  const route = data.features[0]

  if (!route) {
    throw new Error('Aucun trajet trouvé pour ces adresses.')
  }

  return {
    distanceMeters: route.properties.distance,
    durationSeconds: route.properties.time,
    geometry: route.geometry,
  }
}
