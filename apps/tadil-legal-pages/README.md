# Pages légales Tadil (AR + EN)

Site statique pour les URLs **Privacy Policy**, **Terms of Use** et **Support** exigées par l’App Store et Google Play.

| Page | Fichier | URL une fois hébergé |
| --- | --- | --- |
| Accueil | `index.html` | `/` |
| Politique de confidentialité | `privacy/index.html` | `/privacy/` |
| CGU / Conditions d’utilisation | `terms/index.html` | `/terms/` |
| Support | `support/index.html` | `/support/` |

Chaque page est **arabe + anglais** (bouton العربية / English).

## Avant publication — à faire remplir par le client

Éditer `assets/config.js` :

- `legalNameEn` / `legalNameAr` : raison sociale exacte
- `addressEn` / `addressAr` : adresse légale
- `email` : boîte support réelle (actuellement `tadil.refit@gmail.com`)
- `phone` : optionnel ; s’il est renseigné, il s’affiche

Les textes décrivent l’app réelle (téléphone, photos, micro, pin carte sans GPS, Moyasar/mada, chat, wallet). Ce n’est **pas** un avis juridique : faire relire par un avocat (PDPL / SDAIA).

## Hébergement

Dossier à servir tel quel en HTTPS (GitHub Pages, Netlify, Railway Static, S3+CloudFront…). Activer `.nojekyll` déjà présent si GitHub Pages.

Exemple en local :

```sh
npx --yes serve apps/tadil-legal-pages
```

Dans App Store Connect et Play Console, coller les trois URLs `/privacy/`, `/terms/`, `/support/`.
