// Configuración para Google Maps API
export const GOOGLE_MAPS_CONFIG = {
  // Reemplaza con tu API key real de Google Maps
  // Puedes obtenerla en: https://console.cloud.google.com/apis/credentials
  API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY',
  
  // Configuración por defecto del mapa
  DEFAULT_ZOOM: 15,
  DEFAULT_MAP_TYPE: 'roadmap',
  
  // Estilos del mapa (opcional)
  MAP_STYLES: [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "weight": "2.00"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#9c9c9c"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    }
  ]
};

// Función para verificar si la API key está configurada
export const isGoogleMapsConfigured = () => {
  return GOOGLE_MAPS_CONFIG.API_KEY && GOOGLE_MAPS_CONFIG.API_KEY !== 'YOUR_API_KEY';
};

// Función para obtener la URL del script de Google Maps
export const getGoogleMapsScriptUrl = () => {
  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=places`;
};
