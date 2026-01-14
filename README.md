# MESP-RDC ERP Suite

Suite logicielle de gestion des ressources humaines, paie et communication pour la MESP-RDC.

## Architecture

Ce projet est structuré en **Monorepo** :
*   **Root** : Configuration globale et scripts d'orchestration.
*   **Backend** (`/backend`) : API Node.js/Express avec TypeScript.
*   **Frontend** (`/frontend`) : Interface React avec Vite, TailwindCSS et TypeScript.

## Prérequis

*   Node.js (v18+)
*   MongoDB (Doit être installé et en cours d'exécution sur le port 27017)
*   Docker (Optionnel)

## Installation Rapide (VS Code)

1.  Ouvrez ce dossier racine dans VS Code.
2.  **Démarrez votre service MongoDB** (ex: `net start MongoDB` sur Windows ou via MongoDB Compass).
3.  Ouvrez un terminal intégré (`Ctrl + ù` ou `Terminal > New Terminal`).
4.  Installez toutes les dépendances :
    ```bash
    npm run install:all
    ```

## Lancement

Pour lancer l'application complète en mode développement (Frontend + Backend) :

```bash
npm run dev
```

*   **Frontend** : [http://localhost:3000](http://localhost:3000)
*   **Backend** : [http://localhost:5001](http://localhost:5001)

## Structure des Dossiers

*   `backend/src/` : Contient toute la logique métier serveur.
*   `frontend/src/` : Contient les composants React, Pages et la logique UI.
*   `docker-compose.yml` : Permet de lancer une stack de production locale.

## Déploiement Docker

```bash
docker-compose up --build
```