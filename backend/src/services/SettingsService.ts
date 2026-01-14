
import { logger } from '../utils/logger';

// Interface de configuration
export interface CompanySettings {
  companyName: string;
  address: string;
  contactEmail: string;
  logoUrl: string | null; // Stocké en Base64 ou URL
  theme: {
    primaryColor: string;
    enableDarkMode: boolean;
  };
  features: {
    enableChat: boolean;
    enableGeolocation: boolean;
  };
}

// Configuration par défaut (Singleton Pattern simulé en mémoire)
let currentSettings: CompanySettings = {
  companyName: 'MESP-RDC',
  address: 'Kinshasa, Gombe',
  contactEmail: 'contact@mesp-rdc.cd',
  logoUrl: null,
  theme: {
    primaryColor: 'blue',
    enableDarkMode: false
  },
  features: {
    enableChat: true,
    enableGeolocation: false
  }
};

export class SettingsService {
  
  async getSettings(): Promise<CompanySettings> {
    return currentSettings;
  }

  async updateSettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    // Fusion profonde simplifiée
    currentSettings = {
      ...currentSettings,
      ...data,
      theme: { ...currentSettings.theme, ...data.theme },
      features: { ...currentSettings.features, ...data.features }
    };
    
    logger.info('Paramètres globaux mis à jour par un administrateur');
    return currentSettings;
  }

  async uploadLogo(base64Image: string): Promise<string> {
    // En production, ici on uploaderait sur AWS S3 ou un volume Docker
    // Pour l'instant, on stocke la chaîne Base64 (attention à la taille en BDD réelle)
    currentSettings.logoUrl = base64Image;
    return base64Image;
  }
}
