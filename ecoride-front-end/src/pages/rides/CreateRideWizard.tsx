import { Fragment, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import {
  fetchAddressSuggestions,
  type AddressSuggestion,
} from '../../services/geocodingService'
import {
  calculateRoute,
  type RouteCalculationResult,
} from '../../services/routingService'
import type { RideWizardData, RouteChoice } from '../../types/rideWizard'
import './CreateRideWizard.scss'

const WIZARD_STEPS = [
  'Départ',
  'Destination',
  'Itinéraire',
  'Correspondances',
  'Détails',
  'Description',
  'Récapitulatif',
] as const

const FIRST_STEP = 1
const LAST_STEP = WIZARD_STEPS.length
const ROUTE_CHOICES: RouteChoice[] = ['with_tolls', 'no_tolls']
const ROUTE_CHOICE_LABELS: Record<RouteChoice, string> = {
  with_tolls: 'Avec péages',
  no_tolls: 'Sans péages',
}

function formatDistance(distanceMeters?: number): string {
  if (!distanceMeters) {
    return '-'
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`
}

function formatDuration(durationSeconds?: number): string {
  if (!durationSeconds) {
    return '-'
  }

  const totalMinutes = Math.round(durationSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours} h ${minutes} min`
  }

  return `${minutes} min`
}

const initialRideWizardData: RideWizardData = {
  departure: {
    address: '',
    coordinates: null,
  },
  arrival: {
    address: '',
    coordinates: null,
  },
  routeChoice: 'with_tolls',
  waypoints: [],
  departureDate: '',
  departureTime: '',
  seatsAvailable: '',
  price: '',
  description: '',
  estimatedDistanceMeters: null,
  estimatedDurationSeconds: null,
}

function CreateRideWizard() {
  const [currentStep, setCurrentStep] = useState(FIRST_STEP)
  const [rideData, setRideData] = useState<RideWizardData>(initialRideWizardData)
  const [departureSuggestions, setDepartureSuggestions] = useState<AddressSuggestion[]>([])
  const [selectedDepartureAddress, setSelectedDepartureAddress] = useState('')
  const [isSearchingDeparture, setIsSearchingDeparture] = useState(false)
  const [departureSearchError, setDepartureSearchError] = useState('')
  const [arrivalSuggestions, setArrivalSuggestions] = useState<AddressSuggestion[]>([])
  const [selectedArrivalAddress, setSelectedArrivalAddress] = useState('')
  const [isSearchingArrival, setIsSearchingArrival] = useState(false)
  const [arrivalSearchError, setArrivalSearchError] = useState('')
  const [routeResults, setRouteResults] = useState<Partial<Record<RouteChoice, RouteCalculationResult>>>({})
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false)
  const [routeCalculationError, setRouteCalculationError] = useState('')
  const [waypointSearch, setWaypointSearch] = useState('')
  const [waypointSuggestions, setWaypointSuggestions] = useState<AddressSuggestion[]>([])
  const [isSearchingWaypoint, setIsSearchingWaypoint] = useState(false)
  const [waypointSearchError, setWaypointSearchError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const visibleProgressSteps = WIZARD_STEPS.map((stepLabel, index) => ({
    label: stepLabel,
    number: index + 1,
  })).filter(({ number }) => Math.abs(number - currentStep) <= 1)

  const selectedRouteResult = routeResults[rideData.routeChoice]

  const getCurrentStepValidationMessage = (): string => {
    if (currentStep === 1 && !rideData.departure.coordinates) {
      return 'Sélectionnez une adresse de départ dans les suggestions.'
    }

    if (currentStep === 2 && !rideData.arrival.coordinates) {
      return 'Sélectionnez une adresse de destination dans les suggestions.'
    }

    if (currentStep === 3) {
      if (!rideData.departure.coordinates || !rideData.arrival.coordinates) {
        return 'Sélectionnez un départ et une destination avant de continuer.'
      }

      if (isCalculatingRoutes) {
        return 'Patientez pendant le calcul des itinéraires.'
      }

      if (routeCalculationError) {
        return routeCalculationError
      }

      if (!selectedRouteResult) {
        return 'Attendez le calcul du trajet avant de continuer.'
      }
    }

    if (currentStep === 4) {
      if (waypointSearch.trim().length > 0) {
        return 'Sélectionnez une suggestion pour ajouter cet arrêt, ou videz le champ.'
      }

      if (!rideData.estimatedDistanceMeters || !rideData.estimatedDurationSeconds) {
        return 'Les arrêts ont modifié le trajet. Revenez à l’étape Itinéraire pour recalculer.'
      }
    }

    if (currentStep === 5) {
      const seatsAvailable = Number(rideData.seatsAvailable)
      const price = Number(rideData.price)

      if (!rideData.departureDate) {
        return 'Renseignez la date de départ.'
      }

      if (!rideData.departureTime) {
        return 'Renseignez l’heure de départ.'
      }

      if (!Number.isInteger(seatsAvailable) || seatsAvailable < 1 || seatsAvailable > 9) {
        return 'Renseignez un nombre de places entre 1 et 9.'
      }

      if (rideData.price === '' || Number.isNaN(price) || price < 0) {
        return 'Renseignez un prix valide.'
      }
    }

    return ''
  }

  useEffect(() => {
    const search = rideData.departure.address.trim()

    if (search.length < 3 || search === selectedDepartureAddress) {
      return undefined
    }

    const abortController = new AbortController()
    const searchTimeout = window.setTimeout(async () => {
      try {
        setIsSearchingDeparture(true)
        setDepartureSearchError('')

        const suggestions = await fetchAddressSuggestions(search, abortController.signal)
        setDepartureSuggestions(suggestions)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setDepartureSuggestions([])
        setDepartureSearchError('Impossible de récupérer les suggestions pour le moment.')
      } finally {
        setIsSearchingDeparture(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(searchTimeout)
      abortController.abort()
    }
  }, [rideData.departure.address, selectedDepartureAddress])

  useEffect(() => {
    const search = rideData.arrival.address.trim()

    if (search.length < 3 || search === selectedArrivalAddress) {
      return undefined
    }

    const abortController = new AbortController()
    const searchTimeout = window.setTimeout(async () => {
      try {
        setIsSearchingArrival(true)
        setArrivalSearchError('')

        const suggestions = await fetchAddressSuggestions(search, abortController.signal)
        setArrivalSuggestions(suggestions)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setArrivalSuggestions([])
        setArrivalSearchError('Impossible de récupérer les suggestions pour le moment.')
      } finally {
        setIsSearchingArrival(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(searchTimeout)
      abortController.abort()
    }
  }, [rideData.arrival.address, selectedArrivalAddress])

  useEffect(() => {
    const start = rideData.departure.coordinates
    const end = rideData.arrival.coordinates

    if (currentStep !== 3 || !start || !end) {
      return undefined
    }

    const routeStart = start
    const routeEnd = end
    const routeWaypoints = rideData.waypoints
      .toSorted((firstWaypoint, secondWaypoint) => firstWaypoint.order - secondWaypoint.order)
      .map((waypoint) => waypoint.coordinates)
    const abortController = new AbortController()

    async function loadRouteOptions() {
      try {
        setIsCalculatingRoutes(true)
        setRouteCalculationError('')

        const routeEntries = await Promise.all(
          ROUTE_CHOICES.map(async (routeChoice) => {
            const route = await calculateRoute({
              start: routeStart,
              end: routeEnd,
              waypoints: routeWaypoints,
              routeChoice,
              signal: abortController.signal,
            })

            return [routeChoice, route] as const
          }),
        )

        const routes = Object.fromEntries(routeEntries) as Record<
          RouteChoice,
          RouteCalculationResult
        >

        setRouteResults(routes)
        setRideData((currentData) => {
          const selectedRoute = routes[currentData.routeChoice]

          return {
            ...currentData,
            estimatedDistanceMeters: selectedRoute.distanceMeters,
            estimatedDurationSeconds: selectedRoute.durationSeconds,
          }
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setRouteResults({})
        setRouteCalculationError(
          error instanceof Error
            ? error.message
            : 'Impossible de calculer les trajets pour le moment.',
        )
      } finally {
        setIsCalculatingRoutes(false)
      }
    }

    void loadRouteOptions()

    return () => {
      abortController.abort()
    }
  }, [
    currentStep,
    rideData.departure.coordinates,
    rideData.arrival.coordinates,
    rideData.waypoints,
  ])

  useEffect(() => {
    const search = waypointSearch.trim()

    if (currentStep !== 4 || search.length < 3) {
      return undefined
    }

    const abortController = new AbortController()
    const searchTimeout = window.setTimeout(async () => {
      try {
        setIsSearchingWaypoint(true)
        setWaypointSearchError('')

        const suggestions = await fetchAddressSuggestions(search, abortController.signal)
        setWaypointSuggestions(suggestions)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setWaypointSuggestions([])
        setWaypointSearchError('Impossible de récupérer les suggestions pour le moment.')
      } finally {
        setIsSearchingWaypoint(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(searchTimeout)
      abortController.abort()
    }
  }, [currentStep, waypointSearch])

  const goToPreviousStep = () => {
    setValidationMessage('')
    setCurrentStep((step) => Math.max(FIRST_STEP, step - 1))
  }

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(LAST_STEP, step + 1))
  }

  const handleNextStep = () => {
    const message = getCurrentStepValidationMessage()

    if (message) {
      setValidationMessage(message)
      return
    }

    setValidationMessage('')
    goToNextStep()
  }

  const updateDepartureAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value

    setValidationMessage('')
    setSelectedDepartureAddress('')

    if (address.trim().length < 3) {
      setDepartureSuggestions([])
      setIsSearchingDeparture(false)
      setDepartureSearchError('')
    }

    setRideData((currentData) => ({
      ...currentData,
      departure: {
        ...currentData.departure,
        address,
        coordinates: null,
      },
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))
    setRouteResults({})
  }

  const selectDepartureSuggestion = (suggestion: AddressSuggestion) => {
    setValidationMessage('')
    setSelectedDepartureAddress(suggestion.label)
    setDepartureSuggestions([])
    setDepartureSearchError('')

    setRideData((currentData) => ({
      ...currentData,
      departure: {
        address: suggestion.label,
        coordinates: suggestion.coordinates,
      },
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))
    setRouteResults({})
  }

  const updateArrivalAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value

    setValidationMessage('')
    setSelectedArrivalAddress('')

    if (address.trim().length < 3) {
      setArrivalSuggestions([])
      setIsSearchingArrival(false)
      setArrivalSearchError('')
    }

    setRideData((currentData) => ({
      ...currentData,
      arrival: {
        ...currentData.arrival,
        address,
        coordinates: null,
      },
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))
    setRouteResults({})
  }

  const selectArrivalSuggestion = (suggestion: AddressSuggestion) => {
    setValidationMessage('')
    setSelectedArrivalAddress(suggestion.label)
    setArrivalSuggestions([])
    setArrivalSearchError('')

    setRideData((currentData) => ({
      ...currentData,
      arrival: {
        address: suggestion.label,
        coordinates: suggestion.coordinates,
      },
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))
    setRouteResults({})
  }

  const updateRouteChoice = (event: ChangeEvent<HTMLInputElement>) => {
    const routeChoice = event.target.value as RouteChoice
    const route = routeResults[routeChoice]

    setValidationMessage('')
    setRideData((currentData) => ({
      ...currentData,
      routeChoice,
      estimatedDistanceMeters: route?.distanceMeters ?? currentData.estimatedDistanceMeters,
      estimatedDurationSeconds: route?.durationSeconds ?? currentData.estimatedDurationSeconds,
    }))
  }

  const updateWaypointSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value

    setValidationMessage('')
    setWaypointSearch(search)

    if (search.trim().length < 3) {
      setWaypointSuggestions([])
      setIsSearchingWaypoint(false)
      setWaypointSearchError('')
    }
  }

  const addWaypoint = (suggestion: AddressSuggestion) => {
    setValidationMessage('')
    setRideData((currentData) => ({
      ...currentData,
      waypoints: [
        ...currentData.waypoints,
        {
          id: `${Date.now()}-${suggestion.id}`,
          address: suggestion.label,
          coordinates: suggestion.coordinates,
          order: currentData.waypoints.length + 1,
        },
      ],
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))

    setWaypointSearch('')
    setWaypointSuggestions([])
    setWaypointSearchError('')
    setRouteResults({})
  }

  const removeWaypoint = (waypointId: string) => {
    setValidationMessage('')
    setRideData((currentData) => ({
      ...currentData,
      waypoints: currentData.waypoints
        .filter((waypoint) => waypoint.id !== waypointId)
        .map((waypoint, index) => ({
          ...waypoint,
          order: index + 1,
        })),
      estimatedDistanceMeters: null,
      estimatedDurationSeconds: null,
    }))
    setRouteResults({})
  }

  const updateRideField = (
    field: 'departureDate' | 'departureTime' | 'seatsAvailable' | 'price' | 'description',
    value: string,
  ) => {
    setValidationMessage('')
    setRideData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="app">
      <Header />

      <main className="ride-wizard" aria-labelledby="ride-wizard-title">
        <header className="ride-wizard__intro">
          <p className="ride-wizard__eyebrow">Proposer un trajet</p>
          <h1 id="ride-wizard-title">Créez votre trajet étape par étape.</h1>
        </header>

        <section className="ride-wizard__progress" aria-label="Progression du formulaire">
          <ol>
            {visibleProgressSteps.map((step, index) => {
              return (
                <Fragment key={step.label}>
                  {index > 0 && (
                    <li className="ride-wizard__progress-arrow" aria-hidden="true">
                      {step.number <= currentStep ? '←' : '→'}
                    </li>
                  )}
                  <li aria-current={currentStep === step.number ? 'step' : undefined}>
                    {step.number < currentStep && <span aria-hidden="true">← </span>}
                    {step.number}. {step.label}
                    {step.number > currentStep && <span aria-hidden="true"> →</span>}
                  </li>
                </Fragment>
              )
            })}
          </ol>
        </section>

        <form className="ride-wizard__form" action="#" method="post" onSubmit={handleSubmit}>
          {validationMessage && (
            <p className="ride-wizard__status ride-wizard__status--error" role="alert">
              {validationMessage}
            </p>
          )}

          {currentStep === 1 && (
            <section className="ride-wizard__step" aria-labelledby="step-departure-title">
              <h2 id="step-departure-title">1. Point de départ</h2>
              <p>Indiquez l’adresse précise où les passagers pourront vous rejoindre.</p>

              <label htmlFor="departure-location">Lieu de départ</label>
              <input
                id="departure-location"
                name="departureLocation"
                type="text"
                placeholder="Adresse, ville ou point de rendez-vous"
                value={rideData.departure.address}
                onChange={updateDepartureAddress}
                autoComplete="off"
                aria-describedby="departure-location-help"
              />

              <div id="departure-location-help" className="ride-wizard__field-help">
                {isSearchingDeparture && <p>Recherche d’adresses en cours...</p>}
                {departureSearchError && <p>{departureSearchError}</p>}
                {departureSuggestions.length > 0 && (
                  <ul className="ride-wizard__suggestions" aria-label="Suggestions de départ">
                    {departureSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button
                          type="button"
                          onClick={() => selectDepartureSuggestion(suggestion)}
                        >
                          <span>{suggestion.label}</span>
                          {(suggestion.postcode || suggestion.city) && (
                            <small>
                              {suggestion.postcode} {suggestion.city}
                            </small>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="ride-wizard__map" aria-label="Carte du point de départ">
                Carte du point de départ
              </div>

              <div className="ride-wizard__actions">
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="ride-wizard__step" aria-labelledby="step-arrival-title">
              <h2 id="step-arrival-title">2. Destination</h2>
              <p>Choisissez l’adresse d’arrivée du trajet.</p>

              <label htmlFor="arrival-location">Lieu d’arrivée</label>
              <input
                id="arrival-location"
                name="arrivalLocation"
                type="text"
                placeholder="Adresse, ville ou destination finale"
                value={rideData.arrival.address}
                onChange={updateArrivalAddress}
                autoComplete="off"
                aria-describedby="arrival-location-help"
              />

              <div id="arrival-location-help" className="ride-wizard__field-help">
                {isSearchingArrival && <p>Recherche d’adresses en cours...</p>}
                {arrivalSearchError && <p>{arrivalSearchError}</p>}
                {arrivalSuggestions.length > 0 && (
                  <ul className="ride-wizard__suggestions" aria-label="Suggestions d’arrivée">
                    {arrivalSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button type="button" onClick={() => selectArrivalSuggestion(suggestion)}>
                          <span>{suggestion.label}</span>
                          {(suggestion.postcode || suggestion.city) && (
                            <small>
                              {suggestion.postcode} {suggestion.city}
                            </small>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="ride-wizard__map" aria-label="Carte de la destination">
                Carte de la destination
              </div>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="ride-wizard__step" aria-labelledby="step-route-title">
              <h2 id="step-route-title">3. Choix de l’itinéraire</h2>
              <p>Comparez le trajet avec péages et le trajet sans péages.</p>

              {!rideData.departure.coordinates || !rideData.arrival.coordinates ? (
                <p className="ride-wizard__status">
                  Sélectionnez une suggestion de départ et une suggestion de destination avant de
                  calculer les itinéraires.
                </p>
              ) : (
                <>
                  {isCalculatingRoutes && (
                    <p className="ride-wizard__status">Calcul des itinéraires en cours...</p>
                  )}
                  {routeCalculationError && (
                    <p className="ride-wizard__status ride-wizard__status--error">
                      {routeCalculationError}
                    </p>
                  )}
                </>
              )}

              <div className="ride-wizard__map" aria-label="Carte des itinéraires proposés">
                Carte des itinéraires proposés
              </div>

              <fieldset>
                <legend>Type de trajet</legend>

                <label htmlFor="route-with-tolls">
                  <input
                    id="route-with-tolls"
                    name="routeChoice"
                    type="radio"
                    value="with_tolls"
                    checked={rideData.routeChoice === 'with_tolls'}
                    onChange={updateRouteChoice}
                  />
                  Avec péages
                  {routeResults.with_tolls && (
                    <small>
                      {formatDistance(routeResults.with_tolls.distanceMeters)} ·{' '}
                      {formatDuration(routeResults.with_tolls.durationSeconds)}
                    </small>
                  )}
                </label>

                <label htmlFor="route-without-tolls">
                  <input
                    id="route-without-tolls"
                    name="routeChoice"
                    type="radio"
                    value="no_tolls"
                    checked={rideData.routeChoice === 'no_tolls'}
                    onChange={updateRouteChoice}
                  />
                  Sans péages
                  {routeResults.no_tolls && (
                    <small>
                      {formatDistance(routeResults.no_tolls.distanceMeters)} ·{' '}
                      {formatDuration(routeResults.no_tolls.durationSeconds)}
                    </small>
                  )}
                </label>
              </fieldset>

              <dl className="ride-wizard__route-summary">
                <div>
                  <dt>Distance estimée</dt>
                  <dd>{formatDistance(selectedRouteResult?.distanceMeters)}</dd>
                </div>
                <div>
                  <dt>Durée estimée</dt>
                  <dd>{formatDuration(selectedRouteResult?.durationSeconds)}</dd>
                </div>
              </dl>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className="ride-wizard__step" aria-labelledby="step-waypoints-title">
              <h2 id="step-waypoints-title">4. Points de correspondance</h2>
              <p>Ajoutez des arrêts possibles sur votre trajet, si vous le souhaitez.</p>

              <label htmlFor="waypoint-location">Ajouter un arrêt</label>
              <input
                id="waypoint-location"
                name="waypointLocation"
                type="text"
                placeholder="Adresse, ville ou point de rendez-vous"
                value={waypointSearch}
                onChange={updateWaypointSearch}
                autoComplete="off"
                aria-describedby="waypoint-location-help"
              />

              <div id="waypoint-location-help" className="ride-wizard__field-help">
                {isSearchingWaypoint && <p>Recherche d’adresses en cours...</p>}
                {waypointSearchError && <p>{waypointSearchError}</p>}
                {waypointSuggestions.length > 0 && (
                  <ul className="ride-wizard__suggestions" aria-label="Suggestions d’arrêts">
                    {waypointSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button type="button" onClick={() => addWaypoint(suggestion)}>
                          <span>{suggestion.label}</span>
                          {(suggestion.postcode || suggestion.city) && (
                            <small>
                              {suggestion.postcode} {suggestion.city}
                            </small>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="ride-wizard__map" aria-label="Carte des points de correspondance">
                Carte des points de correspondance
              </div>

              <section className="ride-wizard__waypoints" aria-labelledby="waypoints-list-title">
                <h3 id="waypoints-list-title">Arrêts ajoutés</h3>
                {rideData.waypoints.length === 0 ? (
                  <p>Aucun arrêt ajouté pour le moment.</p>
                ) : (
                  <ol className="ride-wizard__waypoints-list">
                    {rideData.waypoints.map((waypoint) => (
                      <li key={waypoint.id}>
                        <span>
                          Arrêt {waypoint.order} : {waypoint.address}
                        </span>
                        <button
                          className="ride-wizard__remove-waypoint"
                          type="button"
                          onClick={() => removeWaypoint(waypoint.id)}
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 5 && (
            <section className="ride-wizard__step" aria-labelledby="step-details-title">
              <h2 id="step-details-title">5. Détails du trajet</h2>
              <p>Renseignez les informations pratiques pour vos passagers.</p>

              <label htmlFor="departure-date">Date de départ</label>
              <input
                id="departure-date"
                name="departureDate"
                type="date"
                value={rideData.departureDate}
                onChange={(event) => updateRideField('departureDate', event.target.value)}
              />

              <label htmlFor="departure-time">Heure de départ</label>
              <input
                id="departure-time"
                name="departureTime"
                type="time"
                value={rideData.departureTime}
                onChange={(event) => updateRideField('departureTime', event.target.value)}
              />

              <label htmlFor="seats-available">Places disponibles</label>
              <input
                id="seats-available"
                name="seatsAvailable"
                type="number"
                min="1"
                max="9"
                value={rideData.seatsAvailable}
                onChange={(event) => updateRideField('seatsAvailable', event.target.value)}
              />

              <label htmlFor="ride-price">Prix par passager</label>
              <input
                id="ride-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={rideData.price}
                onChange={(event) => updateRideField('price', event.target.value)}
              />

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 6 && (
            <section className="ride-wizard__step" aria-labelledby="step-description-title">
              <h2 id="step-description-title">6. Description</h2>
              <p>Ajoutez des détails utiles sur votre trajet.</p>

              <label htmlFor="ride-description">Description du trajet</label>
              <textarea
                id="ride-description"
                name="description"
                rows={4}
                placeholder="Bagages, ambiance, préférences, informations pratiques..."
                value={rideData.description}
                onChange={(event) => updateRideField('description', event.target.value)}
              />

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={handleNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 7 && (
            <section className="ride-wizard__step" aria-labelledby="step-summary-title">
              <h2 id="step-summary-title">7. Récapitulatif</h2>
              <p>Vérifiez les informations avant de publier votre trajet.</p>

              <section className="ride-wizard__summary-section" aria-labelledby="summary-route-title">
                <h3 id="summary-route-title">Itinéraire</h3>
                <dl className="ride-wizard__summary-list">
                  <div>
                    <dt>Départ</dt>
                    <dd>{rideData.departure.address || '-'}</dd>
                  </div>
                  <div>
                    <dt>Destination</dt>
                    <dd>{rideData.arrival.address || '-'}</dd>
                  </div>
                  <div>
                    <dt>Type de trajet</dt>
                    <dd>{ROUTE_CHOICE_LABELS[rideData.routeChoice]}</dd>
                  </div>
                  <div>
                    <dt>Distance</dt>
                    <dd>{formatDistance(rideData.estimatedDistanceMeters ?? undefined)}</dd>
                  </div>
                  <div>
                    <dt>Durée</dt>
                    <dd>{formatDuration(rideData.estimatedDurationSeconds ?? undefined)}</dd>
                  </div>
                </dl>
              </section>

              <section
                className="ride-wizard__summary-section"
                aria-labelledby="summary-waypoints-title"
              >
                <h3 id="summary-waypoints-title">Arrêts</h3>
                {rideData.waypoints.length === 0 ? (
                  <p>Aucun arrêt ajouté.</p>
                ) : (
                  <ol className="ride-wizard__summary-waypoints">
                    {rideData.waypoints.map((waypoint) => (
                      <li key={waypoint.id}>
                        Arrêt {waypoint.order} : {waypoint.address}
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className="ride-wizard__summary-section" aria-labelledby="summary-details-title">
                <h3 id="summary-details-title">Détails</h3>
                <dl className="ride-wizard__summary-list">
                  <div>
                    <dt>Date</dt>
                    <dd>{rideData.departureDate || '-'}</dd>
                  </div>
                  <div>
                    <dt>Heure</dt>
                    <dd>{rideData.departureTime || '-'}</dd>
                  </div>
                  <div>
                    <dt>Places</dt>
                    <dd>{rideData.seatsAvailable || '-'}</dd>
                  </div>
                  <div>
                    <dt>Prix par passager</dt>
                    <dd>{rideData.price ? `${rideData.price} €` : '-'}</dd>
                  </div>
                  <div>
                    <dt>Description</dt>
                    <dd>{rideData.description || '-'}</dd>
                  </div>
                </dl>
              </section>

              <div className="ride-wizard__map" aria-label="Carte récapitulative du trajet">
                Carte récapitulative du trajet
              </div>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="submit">Confirmer le trajet</button>
              </div>
            </section>
          )}
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CreateRideWizard
