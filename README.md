# Frontend CIN

## Démarrage rapide

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Structure
- `src/components/icons/` : icônes centralisées
- `src/features/appointment/lib/validation.ts` : logique de validation extraite
- `src/features/` : logique métier par fonctionnalité

## Variables d'environnement
- Crée un fichier `.env.local` à partir de `.env.example`.
- Ne jamais mettre de secrets dans le frontend.

## Tests
- Lancer tous les tests :
   ```bash
   npm run test
   ```

## Bonnes pratiques
- Utiliser les icônes centralisées
- Séparer la logique métier
- Ajouter des tests pour chaque composant critique
