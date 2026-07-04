# Seranya — Frontend

Application Next.js (App Router) de Seranya, plateforme de yoga/méditation à univers fantastique. Comprend le site public (univers, encyclopédie, tutoriels, articles, abonnement) et un backoffice d'administration.

## Stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS (thème noir/blanc, accent vert) + [Ant Design](https://ant.design/) pour l'admin
- Framer Motion pour les animations
- Axios pour les appels à l'API backend
- `next-sitemap` pour le sitemap/robots.txt
- Lighthouse (runner maison dans `lighthouse/`) pour l'audit de performance
- `next-auth` (préparé, désactivé par défaut — pas d'OAuth actif)

## Prérequis

- Node.js 20+
- L'API backend Seranya lancée (voir `../backend/README.md`)

## Installation

```bash
npm install
```

Copier `.env.example` en `.env.local` et renseigner les variables :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL_LOCAL` | URL de l'API backend en local |
| `NEXT_PUBLIC_API_URL_PROD` | URL de l'API backend en production |
| `NEXT_PUBLIC_SITE_URL` | Domaine du site (utilisé pour le SEO : canonical, Open Graph, sitemap, Lighthouse) |
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Clé API Google utilisée par l'audit Lighthouse/PageSpeed |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optionnel — à activer si l'auth OAuth Google est réintroduite |

## Lancer le projet

```bash
npm run dev
```

Le site est accessible sur `http://localhost:3000`.

```bash
npm run build   # build de production (génère aussi le sitemap via postbuild)
npm run start   # lancement du build de production
npm run lint    # lint
```

## Structure

```
app/
├── admin/           # backoffice (CRUD unités, classes, tutoriels, posts, users, discussions...)
├── auth/            # login, register, reset password
├── univers/         # pages publiques de l'univers Seranya
├── encyclopedie/     # entrées d'encyclopédie
├── tutoriels/       # tutoriels publics
├── posts/           # articles/actualités
├── subscription/    # abonnement (Stripe)
├── contact/         # formulaire de contact
├── rgpd/            # formulaire de demande RGPD (accès, rectification, suppression...)
├── confidentialite/ # politique de confidentialité
├── mentions/        # mentions légales
└── about/           # page à propos

components/          # composants partagés (Header, Sidebar, Table, CookieConsent...)
lighthouse/          # runner Lighthouse maison pour l'audit de performance
```

## Design system

- Thème noir/blanc avec accent vert (`green-400`, `teal-400`).
- Polices : Iceberg (titres), Kanit (corps), Oxanium (alternative), Poppins (fallback) — configurées dans `tailwind.config.ts`.
- Le backoffice (`app/admin`) utilise un layout `flex h-screen overflow-hidden` avec sidebar sombre (`gray-950`) et accent vert au hover.

## RGPD / conformité

- `/rgpd` : formulaire de demande d'accès/rectification/suppression/opposition/portabilité, relié à l'endpoint backend `POST /mailer/data-request`.
- `/confidentialite` : politique de confidentialité (données collectées, droits RGPD, Google Analytics, paiements), distincte de `/mentions` (mentions légales).
- Bandeau de consentement cookies via `react-cookie-consent` (`components/CookieConsent.tsx`).

## Licence

Projet privé.
