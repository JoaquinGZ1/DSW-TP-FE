import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaEvento.css';

// Fix para los iconos de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurar iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapaEventoMejorado = ({ direccion }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState('');

  // Coordenadas por defecto para Buenos Aires
  const defaultPosition = [-34.6037, -58.3816];

  useEffect(() => {
    if (!direccion) {
      setError('No se proporcionó una dirección');
      setLoading(false);
      return;
    }

    const geocodeAddress = async (address) => {
      try {
        setLoading(true);
        setError(null);
        
        const encodedAddress = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1&countrycodes=ar`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error en la búsqueda de ubicación');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            setPosition([lat, lon]);
            setDisplayName(result.display_name || address);
          } else {
            throw new Error('Coordenadas inválidas');
          }
        } else {
          // Si no encuentra la dirección, usar coordenadas por defecto
          setPosition(defaultPosition);
          setDisplayName(address);
        }
      } catch (err) {
        console.error('Error en geocodificación:', err);
        setError(err.message);
        // En caso de error, usar coordenadas por defecto
        setPosition(defaultPosition);
        setDisplayName(address);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      geocodeAddress(direccion);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [direccion]); // defaultPosition is stable, no need to include it

  if (loading) {
    return (
      <div className="mapa-evento-container">
        <div className="mapa-loading">
          <div className="loading-spinner"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error && !position) {
    return (
      <div className="mapa-evento-container">
        <div className="mapa-error">
          <p>No se pudo cargar el mapa</p>
          <p className="error-detail">{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const currentPosition = position || defaultPosition;

  return (
    <div className="mapa-evento-container">
      <MapContainer 
        center={currentPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={currentPosition}>
          <Popup>
            <div>
              <strong>📍 Ubicación:</strong><br />
              {displayName || direccion}
              <br />
              <small>
                Coordenadas: {currentPosition[0].toFixed(4)}, {currentPosition[1].toFixed(4)}
              </small>
              <br />
              <a 
                href={`https://www.openstreetmap.org/?mlat=${currentPosition[0]}&mlon=${currentPosition[1]}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0066cc', textDecoration: 'none' }}
              >
                Ver en OpenStreetMap →
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaEventoMejorado;
