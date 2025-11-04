// src/config.js - Configuración centralizada de la API

/**
 * Configuración automática del backend basada en el entorno
 * - Desarrollo: usa localhost:4000
 * - Producción: usa Railway
 */

// Detección del entorno
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// URL del backend según el entorno
const API_URL = process.env.REACT_APP_API_URL || 
  (isProduction 
    ? 'https://dsw-tp-be-production.up.railway.app'  // Producción (Railway)
    : 'http://localhost:4000'                         // Desarrollo (Local)
  );

console.log(`🔧 Entorno: ${process.env.NODE_ENV}`);
console.log(`🌐 API URL: ${API_URL}`);

export const config = {
  apiUrl: API_URL,
  isDevelopment,
  isProduction,
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
