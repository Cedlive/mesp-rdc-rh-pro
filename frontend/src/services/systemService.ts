
import ApiService from './api';

export interface SystemStatus {
  version: string;
  dbStatus: 'local' | 'cloud' | 'syncing' | 'error';
  lastSync: string;
  pendingUpdates: boolean;
}

const SystemService = {
  // Vérifie la version (simulé pour l'instant via l'endpoint root)
  checkVersion: async () => {
    try {
        const response = await ApiService.get<{ version: string }>('/');
        // Simulation d'une version distante plus récente
        const remoteVersion = "1.2.0"; 
        return {
            current: response.data.version,
            remote: remoteVersion,
            hasUpdate: response.data.version !== remoteVersion
        };
    } catch (e) {
        return { current: '1.0.0', remote: '1.0.0', hasUpdate: false };
    }
  },

  // Simule une synchronisation DB
  syncDatabase: async (target: 'cloud' | 'local') => {
      // Simulation d'un délai réseau
      return new Promise<{ success: boolean; message: string }>((resolve) => {
          setTimeout(() => {
              resolve({ 
                  success: true, 
                  message: target === 'cloud' 
                    ? 'Synchronisation vers le Cloud (Azure SQL) réussie.' 
                    : 'Copie locale mise à jour depuis le Cloud.' 
              });
          }, 2500);
      });
  },

  // Simule une mise à jour OTA
  performUpdate: async () => {
      return new Promise<{ success: boolean }>((resolve) => {
          setTimeout(() => resolve({ success: true }), 4000);
      });
  }
};

export default SystemService;
