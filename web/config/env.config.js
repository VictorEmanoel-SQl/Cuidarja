const ENV = {
  mode: import.meta.env.MODE || 'development',
  
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
  
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  
  oneSignalAppId: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  
  apiKey: import.meta.env.VITE_API_KEY || '',
  
  debug: import.meta.env.VITE_DEBUG === 'true' || true,
};

if (!ENV.serverUrl) {
  console.warn('⚠️ SERVER_URL não configurada. Usando localhost:3000');
}

export default ENV;
