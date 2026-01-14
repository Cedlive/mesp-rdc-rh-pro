
// backend/src/config/database.ts
import dotenv from 'dotenv';

dotenv.config();

// Configuration simulée pour PostgreSQL ou MongoDB
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mesp_admin',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'mesp_hr_db',
  port: parseInt(process.env.DB_PORT || '5432'),
};

export const connectDB = async () => {
  console.log(`[Database] Tentative de connexion à ${dbConfig.host}:${dbConfig.port}...`);
  // Ici, on utiliserait pg-pool ou mongoose.connect()
  // Pour le prototype, on simule un succès immédiat.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[Database] Connexion établie avec succès (Mock).');
      resolve(true);
    }, 500);
  });
};
