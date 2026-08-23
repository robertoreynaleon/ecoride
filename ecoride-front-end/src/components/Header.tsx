import { Link } from 'react-router-dom'
import './Header.scss'

function Header() {
  const handleHomeNavigation = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="site-header__logo"
          to="/"
          aria-label="EcoRide, aller à la page d’accueil"
          onClick={handleHomeNavigation}
        >
          ECORIDE
        </Link>

        <nav className="site-header__nav" aria-label="Navigation principale">
          <Link className="site-header__account" to="/login" aria-label="Se connecter">
            <svg
              className="site-header__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="site-header__desktop-label">Se connecter</span>
          </Link>

          <Link
            className="site-header__cta"
            to="/rides/new"
            aria-label="Proposer un trajet"
          >
            <svg
              className="site-header__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 5v14M5 12h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="site-header__mobile-label">Trajet</span>
            <span className="site-header__desktop-label">Proposer un trajet</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
