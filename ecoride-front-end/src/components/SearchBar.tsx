import './SearchBar.scss'

function SearchBar() {
  return (
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
  )
}

export default SearchBar
