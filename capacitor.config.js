/**  @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.cuidarja.app',
  appName: 'CuidarJá',
  webDir: 'dist', 
  server: {

    url: process.env.VITE_SERVER_URL || 'http://localhost:3000',
    cleartext: process.env.NODE_ENV !== 'production'
  }
};

export default config;
