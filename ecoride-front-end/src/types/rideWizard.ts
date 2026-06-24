export type Coordinates = {
  lon: number
  lat: number
}

export type Place = {
  address: string
  coordinates: Coordinates | null
}

export type Waypoint = {
  id: string
  address: string
  coordinates: Coordinates
  order: number
}

export type RouteChoice = 'with_tolls' | 'no_tolls'

export type RideWizardData = {
  departure: Place
  arrival: Place
  routeChoice: RouteChoice
  waypoints: Waypoint[]
  departureDate: string
  departureTime: string
  seatsAvailable: string
  price: string
  description: string
  estimatedDistanceMeters: number | null
  estimatedDurationSeconds: number | null
}
