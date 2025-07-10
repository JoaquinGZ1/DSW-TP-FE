import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapaSimple = ({ direccion = "Buenos Aires, Argentina" }) => {
  // Coordenadas por defecto para Buenos Aires
  const position = [-34.6037, -58.3816];

  return (
    <div style={{ height: '300px', width: '100%', border: '1px solid #ccc', borderRadius: '8px' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div>
              <strong>Ubicación:</strong><br />
              {direccion}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaSimple;
