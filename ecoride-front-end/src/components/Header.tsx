import { Link } from 'react-router-dom'
import './Header.scss'

function Header() {
  return (
    <header className="site-header">
      <Link className="site-header__logo" to="/" aria-label="Retourner à l’accueil Ecoride">
        ECORIDE
      </Link>
    </header>
  )
}

export default Header
