import { useEffect, useRef, useState } from 'react';
import './MapaEvento.css';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured, getGoogleMapsScriptUrl } from '../config/googleMaps';
import MapaFallback from '../components/MapaFallback';

const MapaEvento = ({ direccion }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!direccion) {
      setError('No se proporcionó una dirección');
      setLoading(false);
      return;
    }

    // Verificar si la API key está configurada
    if (!isGoogleMapsConfigured()) {
      setError('Google Maps API key no configurada');
      setLoading(false);
      return;
    }

    // Cargar el script de Google Maps si aún no está cargado
    if (!window.google) {
      const script = document.createElement('script');
      script.src = getGoogleMapsScriptUrl();
      script.async = true;
      script.onload = () => initMap();
      script.onerror = () => {
        setError('Error al cargar Google Maps');
        setLoading(false);
      };
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: direccion }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: GOOGLE_MAPS_CONFIG.DEFAULT_ZOOM,
            center: results[0].geometry.location,
            mapTypeId: GOOGLE_MAPS_CONFIG.DEFAULT_MAP_TYPE,
            styles: GOOGLE_MAPS_CONFIG.MAP_STYLES,
          });

          // Crear marcador con info window
          const marker = new window.google.maps.Marker({
            map,
            position: results[0].geometry.location,
            title: direccion,
            animation: window.google.maps.Animation.DROP,
          });

          // Crear info window con información del evento
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="info-window-content">
                <h3>📍 Ubicación del Evento</h3>
                <p><strong>Dirección:</strong> ${direccion}</p>
                <p><strong>Coordenadas:</strong> ${results[0].geometry.location.lat().toFixed(6)}, ${results[0].geometry.location.lng().toFixed(6)}</p>
                <p><strong>Tipo:</strong> ${results[0].types[0] || 'Ubicación'}</p>
              </div>
            `,
          });

          // Mostrar info window al hacer clic en el marcador
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Abrir info window automáticamente después de 1 segundo
          setTimeout(() => {
            infoWindow.open(map, marker);
          }, 1000);

          setLoading(false);
        } else {
          console.error('No se pudo geocodificar la dirección:', status);
          setError(`No se pudo encontrar la ubicación: ${status}`);
          setLoading(false);
        }
      });
    }
  }, [direccion]);

  if (loading) {
    return (
      <div className="mapa-loading">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Si la API key no está configurada, mostrar el fallback
    if (error.includes('API key') || error.includes('cargar Google Maps')) {
      return <MapaFallback direccion={direccion} />;
    }
    
    return (
      <div className="mapa-error">
        <div style={{ textAlign: 'center' }}>
          <p>🗺️ {error}</p>
          <p style={{ fontSize: '0.9rem' }}>Dirección: {direccion}</p>
          <button
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`, '_blank')}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ver en Google Maps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="mapa-evento-container"
    />
  );
};

export default MapaEvento;
