import './SearchBar.scss'

function SearchBar() {
  return (
    <section className="ride-search" id="ride-search" aria-labelledby="ride-search-title">
      <div className="ride-search__intro">
        <h2 id="ride-search-title">Trouvez votre prochain trajet</h2>
        <p id="ride-search-required-fields">
          Les champs marqués d’un <span aria-hidden="true">*</span> sont obligatoires.
        </p>
      </div>

      <form
        className="ride-search__form"
        action="/rides"
        method="get"
        aria-describedby="ride-search-required-fields"
      >
        <div className="ride-search__field">
          <label htmlFor="departure">
            Départ <span aria-hidden="true">*</span>
            <span className="sr-only"> obligatoire</span>
          </label>
          <input id="departure" name="departure" type="text" autoComplete="address-level2" required />
        </div>

        <div className="ride-search__field">
          <label htmlFor="destination">
            Destination <span aria-hidden="true">*</span>
            <span className="sr-only"> obligatoire</span>
          </label>
          <input id="destination" name="destination" type="text" autoComplete="address-level2" required />
        </div>

        <div className="ride-search__field">
          <label htmlFor="departure-date">
            Date <span aria-hidden="true">*</span>
            <span className="sr-only"> obligatoire</span>
          </label>
          <input id="departure-date" name="departureDate" type="date" required />
        </div>

        <div className="ride-search__field">
          <label htmlFor="return-date">
            Retour <span className="ride-search__optional">(facultatif)</span>
          </label>
          <input id="return-date" name="returnDate" type="date" />
        </div>

        <div className="ride-search__field">
          <label htmlFor="passengers">
            Passagers <span aria-hidden="true">*</span>
            <span className="sr-only"> obligatoire</span>
          </label>
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
