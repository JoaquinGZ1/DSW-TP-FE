import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaEvento.css';

// Configurar los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapaEventoOSM = ({ direccion }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MapaEventoOSM - Iniciando con dirección:', direccion);

    if (!direccion) {
      setError('No se proporcionó una dirección');
      setLoading(false);
      return;
    }

    // Función para geocodificar usando Nominatim (OpenStreetMap)
    const geocodeAddress = async (address) => {
      try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
        );
        
        if (!response.ok) {
          throw new Error('Error en la búsqueda de ubicación');
        }

        const data = await response.json();
        console.log('Resultado geocoding OSM:', data);

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          
          setPosition({
            lat,
            lng: lon,
            displayName: result.display_name,
            address: result.address || {}
          });
          setLoading(false);
        } else {
          setError('No se encontró la ubicación');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en geocoding:', error);
        setError('Error al buscar la ubicación');
        setLoading(false);
      }
    };

    // Ejecutar geocodificación
    geocodeAddress(direccion);
  }, [direccion]);

  if (loading) {
    return (
      <div className="mapa-loading">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Cargando mapa...</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            Dirección: {direccion}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#999' }}>
            Usando OpenStreetMap (Gratuito)
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mapa-error">
        <div style={{ textAlign: 'center' }}>
          <p>🗺️ {error}</p>
          <p style={{ fontSize: '0.9rem' }}>Dirección: {direccion}</p>
          <button
            onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(direccion)}`, '_blank')}
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
            Ver en OpenStreetMap
          </button>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="mapa-error">
        <div style={{ textAlign: 'center' }}>
          <p>🗺️ No se pudo determinar la ubicación</p>
          <p style={{ fontSize: '0.9rem' }}>Dirección: {direccion}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-evento-container">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                📍 Ubicación del Evento
              </h4>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>
                <strong>Dirección:</strong> {direccion}
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>
                <strong>Coordenadas:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
              {position.displayName && (
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>
                  {position.displayName}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaEventoOSM;
