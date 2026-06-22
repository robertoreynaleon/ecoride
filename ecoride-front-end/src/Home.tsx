import { Link } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import './styles/home.scss'

function Home() {
  return (
    <div className="app">
      <Header />

      <main className="home">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__content">
            <h1 id="home-title">Partagez la route, réduisez l’empreinte.</h1>

            <nav className="home-hero__actions" aria-label="Actions principales">
              <Link to="/login">Se connecter</Link>
              <a href="/rides/new">Proposer un trajet</a>
            </nav>
          </div>

          <figure className="home-hero__media">
            <img
              src="/assets/img/00-covoit.webp"
              alt="Des voyageurs partageant un trajet en covoiturage"
            />
          </figure>
        </section>

        <SearchBar />

        <section className="home-benefits" aria-label="Les avantages du covoiturage Ecoride">
          <ul className="home-benefits__list">
            <li className="home-benefits__item home-benefits__item--icon">
              <img src="/assets/icons/01-icon-gps.svg" alt="Trouver un point de départ" />
            </li>
            <li className="home-benefits__item home-benefits__item--arrow" aria-hidden="true">
              <img src="/assets/icons/00-arrow.svg" alt="" />
            </li>
            <li className="home-benefits__item home-benefits__item--icon">
              <img src="/assets/icons/00-icon-chat.svg" alt="Échanger avec les membres" />
            </li>
            <li className="home-benefits__item home-benefits__item--arrow" aria-hidden="true">
              <img src="/assets/icons/01-arrow.svg" alt="" />
            </li>
            <li className="home-benefits__item home-benefits__item--icon">
              <img src="/assets/icons/02-icon-travellers.svg" alt="Voyager ensemble" />
            </li>
            <li className="home-benefits__item home-benefits__item--arrow" aria-hidden="true">
              <img src="/assets/icons/02-arrow.svg" alt="" />
            </li>
            <li className="home-benefits__item home-benefits__item--icon">
              <img src="/assets/icons/03-icon-reviews.svg" alt="Partager une évaluation" />
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
