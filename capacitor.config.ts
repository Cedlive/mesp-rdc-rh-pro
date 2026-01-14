import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cd.mesp.hrpro',
  appName: 'MESP-RDC Pro',
  webDir: 'frontend/dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#0f172a",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#3b82f6"
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;