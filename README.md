
# Frontend CIN

## 🚀 Démarrage rapide

1. Installer les dépendances :
    ```bash
    npm install
    ```
2. Lancer le serveur de développement :
    ```bash
    npm run dev
    ```

## 🗂️ Structure du projet
- `src/components/` : composants UI réutilisables
- `src/components/icons/` : icônes SVG centralisées
- `src/features/` : logique métier par fonctionnalité (appointment, tracking...)
- `src/features/appointment/lib/validation.ts` : logique de validation
- `src/styles/` : styles globaux et tokens CSS
- `tests/` : tests unitaires, intégration, e2e (Vitest, Playwright)

## ⚙️ Variables d'environnement
- Crée un fichier `.env.local` à partir de `.env.example`.
- Exemple :
   ```env
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001/api
   SESSION_SECRET=remplace-par-un-secret
   ```
- Ne jamais mettre de secrets sensibles côté frontend.

## 🧪 Tests & Qualité
- Lancer tous les tests unitaires :
   ```bash
   npm run test
   ```
- Lancer les tests end-to-end :
   ```bash
   npm run test:e2e
   ```
- Lint :
   ```bash
   npm run lint
   ```
- Vérification de typage :
   ```bash
   npm run typecheck
   ```

## 🏗️ Scripts utiles
- `npm run dev` : serveur Next.js local
- `npm run build` : build de production
- `npm run start` : démarre le build
- `npm run lint` : lint du code
- `npm run typecheck` : vérification TypeScript
- `npm run test` : tests unitaires (Vitest)
- `npm run test:e2e` : tests e2e (Playwright)

## 🔄 CI/CD (GitLab)
- Lint, typecheck, build automatiques sur chaque MR, push sur main/develop
- Déploiement production auto sur Vercel (branche main)
- Voir `.gitlab-ci.yml` pour la config complète

## 💡 Bonnes pratiques
- Utiliser les icônes centralisées
- Séparer la logique métier dans `features/`
- Ajouter des tests pour chaque composant critique
- Respecter la structure des dossiers pour la maintenabilité

## 📚 Technologies principales
- Next.js 16 (App Router)
- TypeScript
- Vitest (tests unitaires)
- Playwright (tests e2e)
- CSS custom properties

## ✉️ Contact & Contrib
Pour toute question ou contribution, ouvrir une issue ou une merge request sur le dépôt GitLab.
