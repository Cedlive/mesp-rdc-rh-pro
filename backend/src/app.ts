
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

// --- CONFIGURATION MESP DATABASE ---
// On utilise 127.0.0.1 pour éviter les problèmes de résolution DNS 'localhost' sur certains systèmes
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mesp_hr_db';

console.log('📡 Tentative de connexion au noyau Data MESP...');

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 NUCLEUS DATA : Connecté à MongoDB avec succès.'))
  .catch(err => {
    console.error('⚠️ ALERTE DATABASE : Connexion MongoDB échouée (ECONNREFUSED).');
    console.info('💡 SOLUTION : Assurez-vous que le service MongoDB est lancé (net start MongoDB ou mongod).');
    console.info('🛠️ Le logiciel continue de fonctionner en mode dégradé (Mock Data).');
  });

// --- MIDDLEWARES GLOBAUX ---
app.use(cors());
app.use(helmet({ 
    contentSecurityPolicy: false // Permet le chargement des cartes Leaflet et des avatars externes
}));
app.use(express.json({ limit: '50mb' }) as any);
app.use(morgan('dev'));

// --- LOGICIEL HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    version: '4.7.2-stable'
  });
});

// --- ROUTES API ---
app.use('/api/v1', routes);

// --- GESTION DES ERREURS ---
app.use(errorHandler as any);

export default app;
