import { Fragment, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import {
  fetchAddressSuggestions,
  type AddressSuggestion,
} from '../../services/geocodingService'
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
  const visibleProgressSteps = WIZARD_STEPS.map((stepLabel, index) => ({
    label: stepLabel,
    number: index + 1,
  })).filter(({ number }) => Math.abs(number - currentStep) <= 1)

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

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(FIRST_STEP, step - 1))
  }

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(LAST_STEP, step + 1))
  }

  const updateDepartureAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value

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
    }))
  }

  const selectDepartureSuggestion = (suggestion: AddressSuggestion) => {
    setSelectedDepartureAddress(suggestion.label)
    setDepartureSuggestions([])
    setDepartureSearchError('')

    setRideData((currentData) => ({
      ...currentData,
      departure: {
        address: suggestion.label,
        coordinates: suggestion.coordinates,
      },
    }))
  }

  const updateArrivalAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value

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
    }))
  }

  const selectArrivalSuggestion = (suggestion: AddressSuggestion) => {
    setSelectedArrivalAddress(suggestion.label)
    setArrivalSuggestions([])
    setArrivalSearchError('')

    setRideData((currentData) => ({
      ...currentData,
      arrival: {
        address: suggestion.label,
        coordinates: suggestion.coordinates,
      },
    }))
  }

  const updateRouteChoice = (event: ChangeEvent<HTMLInputElement>) => {
    setRideData((currentData) => ({
      ...currentData,
      routeChoice: event.target.value as RouteChoice,
    }))
  }

  const updateRideField = (
    field: 'departureDate' | 'departureTime' | 'seatsAvailable' | 'price' | 'description',
    value: string,
  ) => {
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
                <button type="button" onClick={goToNextStep}>
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
                <button type="button" onClick={goToNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="ride-wizard__step" aria-labelledby="step-route-title">
              <h2 id="step-route-title">3. Choix de l’itinéraire</h2>
              <p>Comparez le trajet avec péages et le trajet sans péages.</p>

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
                </label>
              </fieldset>

              <dl className="ride-wizard__route-summary">
                <div>
                  <dt>Distance estimée</dt>
                  <dd>{rideData.estimatedDistanceMeters ?? '-'}</dd>
                </div>
                <div>
                  <dt>Durée estimée</dt>
                  <dd>{rideData.estimatedDurationSeconds ?? '-'}</dd>
                </div>
              </dl>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={goToNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className="ride-wizard__step" aria-labelledby="step-waypoints-title">
              <h2 id="step-waypoints-title">4. Points de correspondance</h2>
              <p>Ajoutez des arrêts possibles sur votre trajet, si vous le souhaitez.</p>

              <button type="button">Ajouter un arrêt sur la carte</button>

              <div className="ride-wizard__map" aria-label="Carte des points de correspondance">
                Carte des points de correspondance
              </div>

              <section className="ride-wizard__waypoints" aria-labelledby="waypoints-list-title">
                <h3 id="waypoints-list-title">Arrêts ajoutés</h3>
                {rideData.waypoints.length === 0 ? (
                  <p>Aucun arrêt ajouté pour le moment.</p>
                ) : (
                  <ol>
                    {rideData.waypoints.map((waypoint) => (
                      <li key={waypoint.id}>{waypoint.address}</li>
                    ))}
                  </ol>
                )}
              </section>

              <div className="ride-wizard__actions">
                <button type="button" onClick={goToPreviousStep}>
                  Précédent
                </button>
                <button type="button" onClick={goToNextStep}>
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
                <button type="button" onClick={goToNextStep}>
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
                <button type="button" onClick={goToNextStep}>
                  Suivant
                </button>
              </div>
            </section>
          )}

          {currentStep === 7 && (
            <section className="ride-wizard__step" aria-labelledby="step-summary-title">
              <h2 id="step-summary-title">7. Récapitulatif</h2>
              <p>Vérifiez les informations avant de publier votre trajet.</p>

              <section aria-labelledby="summary-route-title">
                <h3 id="summary-route-title">Itinéraire</h3>
                <p>Départ : {rideData.departure.address || '-'}</p>
                <p>Destination : {rideData.arrival.address || '-'}</p>
                <p>Correspondances : {rideData.waypoints.length}</p>
              </section>

              <section aria-labelledby="summary-details-title">
                <h3 id="summary-details-title">Détails</h3>
                <p>Date : {rideData.departureDate || '-'}</p>
                <p>Heure : {rideData.departureTime || '-'}</p>
                <p>Places : {rideData.seatsAvailable || '-'}</p>
                <p>Prix : {rideData.price || '-'}</p>
              </section>

              <section aria-labelledby="summary-estimation-title">
                <h3 id="summary-estimation-title">Estimation</h3>
                <p>Distance totale : {rideData.estimatedDistanceMeters ?? '-'}</p>
                <p>Durée estimée : {rideData.estimatedDurationSeconds ?? '-'}</p>
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
