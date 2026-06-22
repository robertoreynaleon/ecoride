import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import {
  registerSchema,
  type RegisterFormData,
} from '../../validation/registerValidation'
import './Register.scss'

function Register() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const handleValidRegistration = () => {
    // L'envoi vers l'API Symfony sera ajouté lors de la validation back-end.
  }

  return (
    <div className="app">
      <Header />

      <main className="register">
        <section className="register__content" aria-labelledby="register-title">
          <div className="register__panel">
            <h1 id="register-title">Créer un compte</h1>

            <form
              className="register__form"
              method="post"
              noValidate
              onSubmit={handleSubmit(handleValidRegistration)}
            >
              <div className="register__field">
                <label htmlFor="first-name">Prénom</label>
                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  maxLength={50}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'first-name-error' : undefined}
                  {...registerField('firstName')}
                />
                {errors.firstName && (
                  <p className="register__error" id="first-name-error" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="last-name">Nom de famille</label>
                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  maxLength={50}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? 'last-name-error' : undefined}
                  {...registerField('lastName')}
                />
                {errors.lastName && (
                  <p className="register__error" id="last-name-error" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="nickname">Pseudo</label>
                <input
                  id="nickname"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={50}
                  aria-invalid={Boolean(errors.nickname)}
                  aria-describedby={errors.nickname ? 'nickname-error' : undefined}
                  {...registerField('nickname')}
                />
                {errors.nickname && (
                  <p className="register__error" id="nickname-error" role="alert">
                    {errors.nickname.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={180}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...registerField('email')}
                />
                {errors.email && (
                  <p className="register__error" id="email-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  {...registerField('phone')}
                />
                {errors.phone && (
                  <p className="register__error" id="phone-error" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="address">Adresse</label>
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  maxLength={255}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  {...registerField('address')}
                />
                {errors.address && (
                  <p className="register__error" id="address-error" role="alert">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="register__field">
                <label htmlFor="register-password">Mot de passe</label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  maxLength={128}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...registerField('password')}
                />
                {errors.password && (
                  <p className="register__error" id="password-error" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button className="register__submit" type="submit" disabled={isSubmitting}>
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
