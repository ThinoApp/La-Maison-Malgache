# La Maison Malgache

Refonte complète de l'architecture web de La Maison Malgache.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Motion

## Structure

- `src/app`: routes et composition des pages
- `src/components`: composants visuels par domaine
- `src/data`: données de migration temporaires
- `src/lib`: accès et helpers de domaine
- `src/types`: contrats de données
- `public/assets`: actifs de marque conservés pendant la migration

## Prérequis

Node.js 20.9 ou plus récent.

## Lancer le projet

```bash
npm install
npm run dev
```

Les prix, stocks, variantes, biographies d'artisans, coordonnées et autres données commerciales restent volontairement absents tant qu'ils ne sont pas validés.
