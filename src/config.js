// src/config.js - Configuración centralizada de la API

// Detectar automáticamente: producción usa Railway, desarrollo usa localhost
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dsw-tp-be-production.up.railway.app' 
    : 'http://localhost:4000');

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
