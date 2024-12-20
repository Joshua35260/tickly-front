import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cloud.tickly.app',
  appName: 'tickly',
  webDir: 'dist/tickly-front/browser',
  server: {
    url: 'https://tickly.cloud',
  },
};

export default config;
