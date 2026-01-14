
# MESP-RDC HR Suite - Documentation Technique

Bienvenue dans la suite logicielle RH professionnelle de la MESP-RDC. Cette application est conçue pour être évolutive, sécurisée et connectable à un écosystème d'entreprise (Backend, Power BI, Azure AD).

## 🛠 Architecture

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS.
- **State Management** : React Hooks (Local) -> Redux Toolkit ou Context API (recommandé pour l'évolution).
- **API Client** : Axios (configuré dans `src/services/api.ts`).
- **Charts** : Recharts (Léger et performant).
- **BI** : Power BI Client React (Pré-configuré).

## 🚀 Installation Rapide (VS Code)

1. **Prérequis** : Node.js v18+, Docker (Optionnel).
2. **Installation** :
   ```bash
   npm install
   ```
3. **Configuration** :
   Copiez le fichier d'exemple pour créer votre configuration locale.
   ```bash
   cp .env.example .env
   ```
4. **Lancement Développement** :
   ```bash
   npm run dev
   ```
   Accédez à `http://localhost:5173`.

## 🐳 Déploiement Docker (Production)

Pour simuler un environnement de production ou déployer sur serveur :

```bash
docker-compose up --build -d
```
L'application sera accessible sur `http://localhost:80`.

## 🔗 Intégration Backend (Node/Python)

L'application est actuellement en mode "Mock Data" (Données fictives) pour la démonstration UI. Pour connecter votre vrai backend :

1. Ouvrez `src/services/api.ts`.
2. Assurez-vous que votre backend tourne sur le port défini dans `.env` (`VITE_API_BASE_URL`).
3. Dans vos pages (ex: `pages/Employees.tsx`), remplacez l'import de `MOCK_EMPLOYEES` par un appel API :

```typescript
// Avant
import { MOCK_EMPLOYEES } from '../constants';
// Après
import ApiService from '../services/api';
// ... dans le composant
useEffect(() => {
  ApiService.get('/employees').then(res => setEmployees(res.data));
}, []);
```

## 📊 Intégration Power BI

Pour afficher les rapports Power BI Desktop publiés sur le service web :

1. Publiez votre rapport `.pbix` sur Power BI Service.
2. Obtenez le `Report ID` et le `Group ID`.
3. Configurez votre Backend pour générer un `Embed Token` (nécessaire pour la sécurité).
4. Utilisez le composant `src/components/PowerBIEmbed.tsx` dans la page `Analytics.tsx`.

## 📁 Structure du Projet

```
/src
  /components    # Composants réutilisables (UI, Layout, PowerBI)
  /pages         # Pages principales (Routes)
  /services      # Logique métier & Appels API (Axios)
  /types         # Définitions TypeScript (Interfaces)
  /constants     # Données Mock (à remplacer par API)
```

---
© 2024 Direction Informatique MESP-RDC
