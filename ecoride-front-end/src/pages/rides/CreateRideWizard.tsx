import Footer from '../../components/Footer'
import Header from '../../components/Header'

function CreateRideWizard() {
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
            <li>Départ</li>
            <li>Destination</li>
            <li>Itinéraire</li>
            <li>Correspondances</li>
            <li>Détails</li>
            <li>Description</li>
            <li>Récapitulatif</li>
          </ol>
        </section>

        <form className="ride-wizard__form" action="#" method="post">
          <section className="ride-wizard__step" aria-labelledby="step-departure-title">
            <h2 id="step-departure-title">1. Point de départ</h2>
            <p>Indiquez l’adresse précise où les passagers pourront vous rejoindre.</p>

            <label htmlFor="departure-location">Lieu de départ</label>
            <input
              id="departure-location"
              name="departureLocation"
              type="text"
              placeholder="Adresse, ville ou point de rendez-vous"
            />

            <div className="ride-wizard__map" aria-label="Carte du point de départ">
              Carte du point de départ
            </div>

            <div className="ride-wizard__actions">
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-arrival-title" hidden>
            <h2 id="step-arrival-title">2. Destination</h2>
            <p>Choisissez l’adresse d’arrivée du trajet.</p>

            <label htmlFor="arrival-location">Lieu d’arrivée</label>
            <input
              id="arrival-location"
              name="arrivalLocation"
              type="text"
              placeholder="Adresse, ville ou destination finale"
            />

            <div className="ride-wizard__map" aria-label="Carte de la destination">
              Carte de la destination
            </div>

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-route-title" hidden>
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
                  defaultChecked
                />
                Avec péages
              </label>

              <label htmlFor="route-without-tolls">
                <input
                  id="route-without-tolls"
                  name="routeChoice"
                  type="radio"
                  value="no_tolls"
                />
                Sans péages
              </label>
            </fieldset>

            <dl className="ride-wizard__route-summary">
              <div>
                <dt>Distance estimée</dt>
                <dd>-</dd>
              </div>
              <div>
                <dt>Durée estimée</dt>
                <dd>-</dd>
              </div>
            </dl>

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-waypoints-title" hidden>
            <h2 id="step-waypoints-title">4. Points de correspondance</h2>
            <p>Ajoutez des arrêts possibles sur votre trajet, si vous le souhaitez.</p>

            <button type="button">Ajouter un arrêt sur la carte</button>

            <div className="ride-wizard__map" aria-label="Carte des points de correspondance">
              Carte des points de correspondance
            </div>

            <section className="ride-wizard__waypoints" aria-labelledby="waypoints-list-title">
              <h3 id="waypoints-list-title">Arrêts ajoutés</h3>
              <p>Aucun arrêt ajouté pour le moment.</p>
            </section>

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-details-title" hidden>
            <h2 id="step-details-title">5. Détails du trajet</h2>
            <p>Renseignez les informations pratiques pour vos passagers.</p>

            <label htmlFor="departure-date">Date de départ</label>
            <input id="departure-date" name="departureDate" type="date" />

            <label htmlFor="departure-time">Heure de départ</label>
            <input id="departure-time" name="departureTime" type="time" />

            <label htmlFor="seats-available">Places disponibles</label>
            <input id="seats-available" name="seatsAvailable" type="number" min="1" max="9" />

            <label htmlFor="ride-price">Prix par passager</label>
            <input id="ride-price" name="price" type="number" min="0" step="0.01" />

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-description-title" hidden>
            <h2 id="step-description-title">6. Description</h2>
            <p>Ajoutez des détails utiles sur votre trajet.</p>

            <label htmlFor="ride-description">Description du trajet</label>
            <textarea
              id="ride-description"
              name="description"
              rows={4}
              placeholder="Bagages, ambiance, préférences, informations pratiques..."
            />

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="button">Suivant</button>
            </div>
          </section>

          <section className="ride-wizard__step" aria-labelledby="step-summary-title" hidden>
            <h2 id="step-summary-title">7. Récapitulatif</h2>
            <p>Vérifiez les informations avant de publier votre trajet.</p>

            <section aria-labelledby="summary-route-title">
              <h3 id="summary-route-title">Itinéraire</h3>
              <p>Départ : -</p>
              <p>Destination : -</p>
              <p>Correspondances : -</p>
            </section>

            <section aria-labelledby="summary-details-title">
              <h3 id="summary-details-title">Détails</h3>
              <p>Date : -</p>
              <p>Heure : -</p>
              <p>Places : -</p>
              <p>Prix : -</p>
            </section>

            <section aria-labelledby="summary-estimation-title">
              <h3 id="summary-estimation-title">Estimation</h3>
              <p>Distance totale : -</p>
              <p>Durée estimée : -</p>
            </section>

            <div className="ride-wizard__map" aria-label="Carte récapitulative du trajet">
              Carte récapitulative du trajet
            </div>

            <div className="ride-wizard__actions">
              <button type="button">Précédent</button>
              <button type="submit">Publier le trajet</button>
            </div>
          </section>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CreateRideWizard
