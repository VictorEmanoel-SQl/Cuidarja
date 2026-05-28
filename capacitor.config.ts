import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cuidarja.app',
  appName: 'Cuidar Já',
  webDir: 'web', 
  server: {

    url: 'http://172.16.6.107:5500', 
    cleartext: true
  }
};

export default config;
