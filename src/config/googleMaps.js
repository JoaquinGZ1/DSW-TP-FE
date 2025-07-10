// Configuración para Google Maps API
export const GOOGLE_MAPS_CONFIG = {
  // Reemplaza con tu API key real de Google Maps
  // Puedes obtenerla en: https://console.cloud.google.com/apis/credentials
  API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY',
  
  // Configuración por defecto del mapa
  DEFAULT_ZOOM: 15,
  DEFAULT_MAP_TYPE: 'roadmap',
  
  // Estilos del mapa (opcional)
  MAP_STYLES: []
};

// Función para verificar si la API key está configurada
export const isGoogleMapsConfigured = () => {
  const apiKey = GOOGLE_MAPS_CONFIG.API_KEY;
  console.log('API Key verificada:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No configurada'); // Debug
  return apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.trim() !== '';
};

// Función para obtener la URL del script de Google Maps
export const getGoogleMapsScriptUrl = () => {
  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=places`;
};
