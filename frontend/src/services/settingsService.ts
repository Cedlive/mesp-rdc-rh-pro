import ApiService from './api';

export interface CompanySettings {
  companyName: string;
  logoUrl: string | null;
  theme: {
    primaryColor: string;
  };
}

const SettingsService = {
  getSettings: () => ApiService.get<CompanySettings>('/settings'),
  
  updateSettings: (data: Partial<CompanySettings>) => ApiService.patch<CompanySettings>('/settings', data),
  
  // Fonction utilitaire pour convertir un fichier en Base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
};

export default SettingsService;