import type { Coordinates } from '../types/rideWizard'

const ADDRESS_API_URL = 'https://api-adresse.data.gouv.fr/search/'
const MIN_SEARCH_LENGTH = 3
const MAX_SUGGESTIONS = 5

export type AddressApiFeature = {
  geometry: {
    coordinates: [number, number]
  }
  properties: {
    id?: string
    label: string
    name?: string
    city?: string
    postcode?: string
    context?: string
  }
}

export type AddressApiResponse = {
  features: AddressApiFeature[]
}

export type AddressSuggestion = {
  id: string
  label: string
  city: string
  postcode: string
  context: string
  coordinates: Coordinates
}

function mapAddressFeatureToSuggestion(feature: AddressApiFeature, index: number): AddressSuggestion {
  const [lon, lat] = feature.geometry.coordinates

  return {
    id: feature.properties.id ?? `${feature.properties.label}-${index}`,
    label: feature.properties.label,
    city: feature.properties.city ?? '',
    postcode: feature.properties.postcode ?? '',
    context: feature.properties.context ?? '',
    coordinates: {
      lon,
      lat,
    },
  }
}

export async function fetchAddressSuggestions(
  search: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const query = search.trim()

  if (query.length < MIN_SEARCH_LENGTH) {
    return []
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(MAX_SUGGESTIONS),
  })

  const response = await fetch(`${ADDRESS_API_URL}?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error('La recherche d’adresse est momentanément indisponible.')
  }

  const data = (await response.json()) as AddressApiResponse

  return data.features.map(mapAddressFeatureToSuggestion)
}
