import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.utsho.culinarycanvas',
  appName: 'Culinary Canvas',
  webDir: 'public',
  server: {
    url: 'https://the-culinary-canvas.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#F7FBE7',
    }
  }
};

export default config;