import { useEffect, useMemo, useRef } from 'react'
import Collection from 'ol/Collection'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
import Modify from 'ol/interaction/Modify'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { fromLonLat, toLonLat } from 'ol/proj'
import { unByKey } from 'ol/Observable'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import type { EventsKey } from 'ol/events'
import type MapBrowserEvent from 'ol/MapBrowserEvent'
import type { ModifyEvent } from 'ol/interaction/Modify'
import type { Geometry } from 'ol/geom'
import type { GeoapifyRouteGeometry } from '../services/routingService'
import type { Coordinates, Waypoint } from '../types/rideWizard'
import 'ol/ol.css'

type MarkerKind = 'departure' | 'arrival' | 'waypoint'

type MapMarker = {
  id: string
  coordinates: Coordinates
  kind: MarkerKind
}

type RideMapProps = {
  departure?: Coordinates | null
  arrival?: Coordinates | null
  waypoints?: Waypoint[]
  routeGeometry?: GeoapifyRouteGeometry | null
  routeVariant?: 'with_tolls' | 'no_tolls'
  allowWaypointEditing?: boolean
  onWaypointAdd?: (coordinates: Coordinates) => void
  onWaypointMove?: (waypointId: string, coordinates: Coordinates) => void
}

const FALLBACK_CENTER: Coordinates = {
  lon: 2.3522,
  lat: 48.8566,
}

const MARKER_COLORS: Record<MarkerKind, string> = {
  departure: '#ff5f00',
  arrival: '#c82363',
  waypoint: '#22c5a4',
}

function createMarkerStyle(kind: MarkerKind): Style {
  return new Style({
    image: new Circle({
      radius: kind === 'waypoint' ? 8 : 10,
      fill: new Fill({ color: MARKER_COLORS[kind] }),
      stroke: new Stroke({ color: '#ffffff', width: 3 }),
    }),
  })
}

function createRouteStyle(routeVariant: RideMapProps['routeVariant']): Style {
  return new Style({
    stroke: new Stroke({
      color: routeVariant === 'no_tolls' ? '#64748b' : '#c82363',
      lineDash: routeVariant === 'no_tolls' ? [10, 10] : undefined,
      width: 5,
    }),
  })
}

function getMarkerCoordinates(marker: MapMarker): [number, number] {
  return [marker.coordinates.lon, marker.coordinates.lat]
}

function createMarkers({
  departure,
  arrival,
  waypoints = [],
}: Pick<RideMapProps, 'departure' | 'arrival' | 'waypoints'>): MapMarker[] {
  const markers: MapMarker[] = []

  if (departure) {
    markers.push({
      id: 'departure',
      coordinates: departure,
      kind: 'departure',
    })
  }

  waypoints.forEach((waypoint) => {
    markers.push({
      id: waypoint.id,
      coordinates: waypoint.coordinates,
      kind: 'waypoint',
    })
  })

  if (arrival) {
    markers.push({
      id: 'arrival',
      coordinates: arrival,
      kind: 'arrival',
    })
  }

  return markers
}

function RideMap({
  departure = null,
  arrival = null,
  waypoints = [],
  routeGeometry = null,
  routeVariant = 'with_tolls',
  allowWaypointEditing = false,
  onWaypointAdd,
  onWaypointMove,
}: RideMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const markerLayerRef = useRef<VectorLayer<VectorSource<Feature<Geometry>>> | null>(null)
  const routeLayerRef = useRef<VectorLayer<VectorSource<Feature<Geometry>>> | null>(null)
  const modifyInteractionRef = useRef<Modify | null>(null)
  const markers = useMemo(() => {
    return createMarkers({ departure, arrival, waypoints })
  }, [departure, arrival, waypoints])

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return
    }

    const center = FALLBACK_CENTER
    const map = new Map({
      target: mapElementRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lon, center.lat]),
        zoom: 11,
      }),
    })

    mapRef.current = map

    return () => {
      map.setTarget(undefined)
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    if (markerLayerRef.current) {
      map.removeLayer(markerLayerRef.current)
    }

    if (modifyInteractionRef.current) {
      map.removeInteraction(modifyInteractionRef.current)
      modifyInteractionRef.current = null
    }

    const markerFeatures = markers.map((marker) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(getMarkerCoordinates(marker))),
      })

      feature.set('markerId', marker.id)
      feature.set('markerKind', marker.kind)
      feature.setStyle(createMarkerStyle(marker.kind))

      return feature
    })

    const markerSource = new VectorSource({
      features: markerFeatures,
    })
    const markerLayer = new VectorLayer({
      source: markerSource,
    })
    markerLayer.setZIndex(2)

    markerLayerRef.current = markerLayer
    map.addLayer(markerLayer)

    if (markerFeatures.length > 1) {
      const extent = markerSource.getExtent()

      if (extent) {
        map.getView().fit(extent, {
          padding: [48, 48, 48, 48],
          maxZoom: 14,
          duration: 250,
        })
      }
    } else if (markerFeatures.length === 1) {
      const center = getMarkerCoordinates(markers[0])
      map.getView().animate({
        center: fromLonLat(center),
        zoom: 13,
        duration: 250,
      })
    }

    if (allowWaypointEditing && onWaypointMove) {
      const waypointFeatures = markerFeatures.filter((feature) => {
        return feature.get('markerKind') === 'waypoint'
      })
      const modifyInteraction = new Modify({
        features: new Collection(waypointFeatures),
      })

      modifyInteraction.on('modifyend', (event: ModifyEvent) => {
        event.features.forEach((feature) => {
          if (feature.get('markerKind') !== 'waypoint') {
            return
          }

          const geometry = feature.getGeometry()

          if (!(geometry instanceof Point)) {
            return
          }

          const waypointId = feature.get('markerId') as string
          const [lon, lat] = toLonLat(geometry.getCoordinates())
          onWaypointMove(waypointId, { lon, lat })
        })
      })

      modifyInteractionRef.current = modifyInteraction
      map.addInteraction(modifyInteraction)
    }
  }, [allowWaypointEditing, markers, onWaypointMove])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (!routeGeometry) {
      return
    }

    const routeFeature = new GeoJSON().readFeature(routeGeometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }) as Feature<Geometry>

    routeFeature.setStyle(createRouteStyle(routeVariant))

    const routeSource = new VectorSource({
      features: [routeFeature],
    })
    const routeLayer = new VectorLayer({
      source: routeSource,
    })
    routeLayer.setZIndex(1)

    routeLayerRef.current = routeLayer
    map.addLayer(routeLayer)

    const extent = routeSource.getExtent()

    if (extent) {
      map.getView().fit(extent, {
        padding: [56, 56, 56, 56],
        maxZoom: 14,
        duration: 250,
      })
    }
  }, [routeGeometry, routeVariant])

  useEffect(() => {
    const map = mapRef.current

    if (!map || !allowWaypointEditing || !onWaypointAdd) {
      return
    }

    const handleClick = (event: MapBrowserEvent) => {
      const clickedFeature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature: FeatureLike) => feature,
      )

      if (clickedFeature) {
        return
      }

      const [lon, lat] = toLonLat(event.coordinate)
      onWaypointAdd({ lon, lat })
    }

    const listenerKey: EventsKey = map.on('singleclick', handleClick)

    return () => {
      unByKey(listenerKey)
    }
  }, [allowWaypointEditing, onWaypointAdd])

  return <div className="ride-map" ref={mapElementRef} />
}

export default RideMap
