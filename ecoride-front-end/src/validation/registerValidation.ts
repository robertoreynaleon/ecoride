import { z } from 'zod'

// Autorise les lettres Unicode, les accents, les espaces, les apostrophes et les traits d'union.
const PERSON_NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u

// Le pseudo reste lisible et prévisible : aucun espace ni caractère de contrôle n'est accepté.
const NICKNAME_PATTERN = /^[\p{L}\p{N}_-]+$/u

// Le téléphone peut être saisi dans un format français ou international courant.
const PHONE_PATTERN = /^\+?[0-9\s().-]+$/

/**
 * Construit la règle commune au prénom et au nom de famille.
 * Le texte est nettoyé aux extrémités, limité à 50 caractères comme dans Symfony,
 * puis contrôlé pour éviter chiffres, balises et ponctuation inattendue.
 */
const createPersonNameSchema = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(2, `${fieldName} doit contenir au moins 2 caractères.`)
    .max(50, `${fieldName} ne peut pas dépasser 50 caractères.`)
    .regex(PERSON_NAME_PATTERN, `${fieldName} contient des caractères non autorisés.`)

/**
 * Vérifie le nombre réel de chiffres d'un téléphone sans imposer un seul format visuel.
 * Les séparateurs autorisés ne sont donc pas comptabilisés.
 */
const hasValidPhoneLength = (phone: string) => {
  const digitCount = phone.replace(/\D/g, '').length

  return digitCount >= 8 && digitCount <= 15
}

/**
 * Détecte les caractères de contrôle invisibles qui pourraient altérer une donnée textuelle.
 * La vérification explicite évite une expression régulière difficile à lire et à maintenir.
 */
const hasControlCharacters = (value: string) =>
  Array.from(value).some((character) => {
    const characterCode = character.charCodeAt(0)

    return characterCode <= 31 || characterCode === 127
  })

/**
 * Schéma central du formulaire d'inscription.
 * Zod valide et normalise les données avant qu'elles puissent être envoyées à l'API.
 */
export const registerSchema = z.object({
  firstName: createPersonNameSchema('Le prénom'),
  lastName: createPersonNameSchema('Le nom de famille'),

  // Le pseudo correspond à la limite SQL de 50 caractères et interdit les espaces.
  nickname: z
    .string()
    .trim()
    .min(3, 'Le pseudo doit contenir au moins 3 caractères.')
    .max(50, 'Le pseudo ne peut pas dépasser 50 caractères.')
    .regex(NICKNAME_PATTERN, 'Utilisez uniquement des lettres, chiffres, tirets ou underscores.'),

  // L'e-mail est limité comme dans Symfony puis normalisé en minuscules.
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire.")
    .max(180, "L'adresse e-mail ne peut pas dépasser 180 caractères.")
    .email("L'adresse e-mail n'est pas valide.")
    .transform((email) => email.toLowerCase()),

  // Le téléphone accepte plusieurs présentations, mais exige entre 8 et 15 chiffres.
  phone: z
    .string()
    .trim()
    .min(1, 'Le téléphone est obligatoire.')
    .max(20, 'Le téléphone ne peut pas dépasser 20 caractères.')
    .regex(PHONE_PATTERN, "Le format du téléphone n'est pas valide.")
    .refine(hasValidPhoneLength, 'Le téléphone doit contenir entre 8 et 15 chiffres.'),

  // L'adresse est conservée sur une ligne et respecte la limite SQL de 255 caractères.
  address: z
    .string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères.")
    .max(255, "L'adresse ne peut pas dépasser 255 caractères.")
    .refine(
      (address) => !hasControlCharacters(address),
      "L'adresse contient des caractères non autorisés.",
    ),

  // Le mot de passe n'est jamais nettoyé automatiquement afin de ne pas le modifier à l'insu de l'utilisateur.
  password: z
    .string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères.')
    .regex(/[a-z]/, 'Ajoutez au moins une lettre minuscule.')
    .regex(/[A-Z]/, 'Ajoutez au moins une lettre majuscule.')
    .regex(/[0-9]/, 'Ajoutez au moins un chiffre.')
    .regex(/[^\p{L}\p{N}\s]/u, 'Ajoutez au moins un caractère spécial.')
    .refine(
      (password) => !hasControlCharacters(password),
      'Le mot de passe contient un caractère de contrôle interdit.',
    ),
})

// Ce type est déduit du schéma : le formulaire et ses données restent synchronisés automatiquement.
export type RegisterFormData = z.infer<typeof registerSchema>
