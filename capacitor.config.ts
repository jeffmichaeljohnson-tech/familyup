import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.familyup.app',
  appName: 'FamilyUp',
  webDir: 'dist',
  server: {
    // Allow loading local content
    allowNavigation: ['*'],
    // Enable live reload for development
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  ios: {
    // iOS-specific configuration
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    // Allow inline media playback
    allowsInlineMediaPlayback: true,
    // Suppress incremental rendering (better for complex animations)
    suppressesIncrementalRendering: false,
    // Handle keyboard appearance
    preferredContentMode: 'mobile',
  },
  plugins: {
    // Configure SplashScreen
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#3b82f6',
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Keyboard configuration
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
