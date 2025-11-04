// src/config.js - Configuración centralizada de la API

const API_URL = process.env.REACT_APP_API_URL || 'https://dsw-tp-be-production.up.railway.app';

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
