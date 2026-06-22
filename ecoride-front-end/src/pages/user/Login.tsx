import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import './Login.scss'

function Login() {
  return (
    <div className="app">
      <Header />

      <main className="login">
        <section className="login__content" aria-labelledby="login-title">
          <div className="login__panel">
            <h1 id="login-title">Connexion</h1>

            <form className="login__form" action="/login" method="post">
              <div className="login__field">
                <label htmlFor="identifier">Pseudo ou adresse e-mail</label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                />
              </div>

              <div className="login__field">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button className="login__submit" type="submit">
                Se connecter
              </button>
            </form>
          </div>

          <p className="login__register-link">
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Login
