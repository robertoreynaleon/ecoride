import { Link } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import './styles/home.scss'

function Home() {
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>

      <Header />

      <main className="home" id="main-content" tabIndex={-1}>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__content">
            <h1 id="home-title">Partagez la route, réduisez l’empreinte.</h1>
            <p>
              Trouvez un covoiturage adapté à votre trajet et voyagez de façon plus économique et
              responsable.
            </p>

            <div className="home-hero__actions">
              <a className="home-hero__primary" href="#ride-search">
                Rechercher un trajet
              </a>
              <Link className="home-hero__secondary" to="/rides/new">
                Proposer un trajet
              </Link>
            </div>
          </div>

          <figure className="home-hero__media">
            <img
              src="/assets/img/00-covoit.webp"
              alt=""
              width="3840"
              height="2160"
              decoding="async"
              fetchPriority="high"
            />
          </figure>
        </section>

        <SearchBar />

        <section className="home-benefits" aria-labelledby="home-benefits-title">
          <h2 id="home-benefits-title">Pourquoi choisir EcoRide&nbsp;?</h2>

          <ul className="home-benefits__list">
            <li className="home-benefits__item">
              <div className="home-benefits__visual" aria-hidden="true">
                <img src="/assets/icons/01-icon-gps.svg" alt="" width="83" height="104" loading="lazy" />
              </div>
              <h3>Trouvez votre trajet</h3>
              <p>Recherchez un départ adapté à votre itinéraire.</p>
            </li>

            <li className="home-benefits__item">
              <div className="home-benefits__visual" aria-hidden="true">
                <img src="/assets/icons/00-icon-chat.svg" alt="" width="125" height="105" loading="lazy" />
              </div>
              <h3>Échangez simplement</h3>
              <p>Préparez le trajet avec les autres membres.</p>
            </li>

            <li className="home-benefits__item">
              <div className="home-benefits__visual" aria-hidden="true">
                <img
                  src="/assets/icons/02-icon-travellers.svg"
                  alt=""
                  width="147"
                  height="104"
                  loading="lazy"
                />
              </div>
              <h3>Voyagez ensemble</h3>
              <p>Partagez les frais et réduisez le nombre de voitures.</p>
            </li>

            <li className="home-benefits__item">
              <div className="home-benefits__visual" aria-hidden="true">
                <img
                  src="/assets/icons/03-icon-reviews.svg"
                  alt=""
                  width="142"
                  height="98"
                  loading="lazy"
                />
              </div>
              <h3>Donnez votre avis</h3>
              <p>Aidez la communauté grâce aux évaluations.</p>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
