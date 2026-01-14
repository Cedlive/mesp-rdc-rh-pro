
# Guide d'Installation MESP-RDC Frontend

Ce dossier contient le frontend React de l'application RH.

## Installation

1. Assurez-vous d'avoir Node.js installé.
2. Ouvrez ce dossier `frontend` dans votre terminal.
3. Lancez la commande :
   ```bash
   npm install
   ```

## Structure des dossiers (à respecter)

Déplacez les fichiers téléchargés selon cette structure :

```
frontend/
├── public/
│   └── (favicon, images...)
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx  (anciennement index.tsx)
│   ├── types.ts
│   └── constants.ts
├── index.html (doit pointer vers /src/main.tsx)
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Lancer le projet

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.
