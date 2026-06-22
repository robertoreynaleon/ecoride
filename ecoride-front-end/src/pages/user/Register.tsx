import Footer from '../../components/Footer'
import Header from '../../components/Header'
import './Register.scss'

function Register() {
  return (
    <div className="app">
      <Header />

      <main className="register">
        <section className="register__content" aria-labelledby="register-title">
          <div className="register__panel">
            <h1 id="register-title">Créer un compte</h1>

            <form className="register__form" action="/register" method="post">
              <div className="register__field">
                <label htmlFor="first-name">Prénom</label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="last-name">Nom de famille</label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="nickname">Pseudo</label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="phone">Téléphone</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" required />
              </div>

              <div className="register__field">
                <label htmlFor="address">Adresse</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="register-password">Mot de passe</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button className="register__submit" type="submit">
                Créer mon compte
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Register
