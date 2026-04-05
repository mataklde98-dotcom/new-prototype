import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sostudy.app',
  appName: 'SoStudy',
  webDir: 'dist',
  
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },

  // iOS-spezifische Konfiguration
  ios: {
    contentInset: 'always',
    scrollEnabled: false, // Verhindert Zoom beim Scrollen
  },

  // Android-spezifische Konfiguration
  android: {
    allowMixedContent: true,
  },

  // Plugins Konfiguration
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
