
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 SERVEUR NUCLEUS MESP-RDC ACTIF
  📡 API: http://localhost:${PORT}/api/v1
  🛠  Mode: ${process.env.NODE_ENV || 'development'}
  ==========================================
  `);
});

server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Erreur : Le port ${PORT} est déjà utilisé.`);
    (process as any).exit(1);
  }
});
