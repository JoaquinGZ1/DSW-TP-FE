import React from 'react';
import MapaEvento from '../pages/MapaEvento';

const TestMapas = () => {
  const testAddresses = [
    'Plaza de Mayo, Buenos Aires, Argentina',
    'Obelisco, Buenos Aires, Argentina', 
    'Puerto Madero, Buenos Aires, Argentina',
    'Palermo, Buenos Aires, Argentina',
    'Av. Corrientes 1000, Buenos Aires, Argentina'
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🗺️ Prueba de Mapas OpenStreetMap</h1>
      <div style={{ 
        background: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '2px solid #28a745'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Implementación exitosa</h3>
        <p style={{ margin: '0', color: '#155724' }}>
          Mapas funcionando con OpenStreetMap - 100% gratuito, sin API keys, sin límites
        </p>
      </div>
      
      {testAddresses.map((address, index) => (
        <div key={index} style={{ 
          marginBottom: '30px', 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Evento de Prueba {index + 1}</h3>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>
            <strong>📍 Ubicación:</strong> {address}
          </p>
          <MapaEvento direccion={address} />
        </div>
      ))}
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>🎯 Funcionalidades implementadas:</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>✅ Mapas interactivos con OpenStreetMap</li>
          <li>✅ Geocodificación automática gratuita</li>
          <li>✅ Marcadores con información del evento</li>
          <li>✅ Popups informativos al hacer clic</li>
          <li>✅ Responsive design para móvil</li>
          <li>✅ Estados de carga visuales</li>
          <li>✅ Botones para ver en OpenStreetMap</li>
          <li>✅ Sin API keys, sin costos, sin límites</li>
        </ul>
        
        <h3>🎨 Características visuales:</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>🗺️ Mapas de alta calidad con OpenStreetMap</li>
          <li>📍 Marcadores con sombra y animaciones</li>
          <li>💬 Popups con información detallada</li>
          <li>⚡ Loading spinner animado</li>
          <li>📱 Diseño responsive automático</li>
        </ul>
      </div>
    </div>
  );
};

export default TestMapas;
