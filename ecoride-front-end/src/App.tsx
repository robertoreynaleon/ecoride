function App() {
  return (
    <div className="app">
      <header className="site-header">
        <a className="site-header__logo" href="/account" aria-label="Accéder à mon compte Ecoride">
          ECORIDE
        </a>
      </header>

      <main className="home">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__content">
            <h1 id="home-title">Partagez la route, réduisez l’empreinte.</h1>

            <nav className="home-hero__actions" aria-label="Actions principales">
              <a href="#ride-search">Chercher un trajet</a>
              <a href="/rides/new">Proposer un trajet</a>
            </nav>
          </div>

          <figure className="home-hero__media">
            <img
              src="/images/home-carpool.jpg"
              alt="Des voyageurs partageant un trajet en covoiturage"
            />
          </figure>
        </section>

        <section className="ride-search" id="ride-search" aria-label="Rechercher un trajet">
          <form className="ride-search__form" action="/rides" method="get">
            <div className="ride-search__field">
              <label htmlFor="departure">Départ</label>
              <input id="departure" name="departure" type="text" autoComplete="address-level2" required />
            </div>

            <div className="ride-search__field">
              <label htmlFor="destination">Destination</label>
              <input id="destination" name="destination" type="text" autoComplete="address-level2" required />
            </div>

            <div className="ride-search__field">
              <label htmlFor="departure-date">Date</label>
              <input id="departure-date" name="departureDate" type="date" required />
            </div>

            <div className="ride-search__field">
              <label htmlFor="return-date">Retour</label>
              <input id="return-date" name="returnDate" type="date" />
            </div>

            <div className="ride-search__field">
              <label htmlFor="passengers">Passagers</label>
              <input id="passengers" name="passengers" type="number" min="1" max="8" defaultValue="1" required />
            </div>

            <button className="ride-search__submit" type="submit">
              Rechercher
            </button>
          </form>
        </section>

        <section className="home-benefits" aria-label="Les avantages du covoiturage Ecoride">
          <ul className="home-benefits__list">
            <li aria-label="Trouver un point de départ">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#location-icon" />
              </svg>
            </li>
            <li aria-label="Organiser son trajet">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#route-icon" />
              </svg>
            </li>
            <li aria-label="Voyager ensemble">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#passengers-icon" />
              </svg>
            </li>
            <li aria-label="Échanger avec les membres">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#messages-icon" />
              </svg>
            </li>
            <li aria-label="Conduire ou réserver">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#car-icon" />
              </svg>
            </li>
            <li aria-label="Partager une évaluation">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#reviews-icon" />
              </svg>
            </li>
            <li aria-label="Réduire son empreinte environnementale">
              <svg aria-hidden="true" focusable="false">
                <use href="/icons.svg#eco-icon" />
              </svg>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
