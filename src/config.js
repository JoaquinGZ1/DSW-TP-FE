// src/config.js - Configuración centralizada de la API

// Usar Railway en producción, localhost en desarrollo
// En producción (Vercel), process.env.NODE_ENV siempre es 'production'
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocalhost 
  ? 'http://localhost:4000'
  : 'https://dsw-tp-be-production.up.railway.app';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    eventos: `${API_URL}/api/eventos`,
    usuarios: `${API_URL}/api/usuarios`,
    organizadores: `${API_URL}/api/organizadores`,
    categorias: `${API_URL}/api/categorias`,
    entradas: `${API_URL}/api/entrada`,
    tiposEntradas: `${API_URL}/api/tiposEntradas`,
  }
};

export default config;
