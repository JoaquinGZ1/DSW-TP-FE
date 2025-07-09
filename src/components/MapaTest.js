import React from 'react';
import MapaEvento from '../pages/MapaEvento';
import './MapaTest.css';

const MapaTest = () => {
  const testAddresses = [
    'Av. Corrientes 1000, Buenos Aires, Argentina',
    'Plaza San Martín, Buenos Aires, Argentina',
    'Obelisco, Buenos Aires, Argentina',
    'Puerto Madero, Buenos Aires, Argentina',
    'Av. Santa Fe 1500, Buenos Aires, Argentina'
  ];

  return (
    <div className="mapa-test-container">
      <h1>Prueba de Mapas - Eventos</h1>
      <p>Esta página muestra cómo se verán los mapas en diferentes ubicaciones:</p>
      
      {testAddresses.map((address, index) => (
        <div key={index} className="mapa-test-item">
          <h3>Evento {index + 1}</h3>
          <p><strong>Ubicación:</strong> {address}</p>
          <MapaEvento direccion={address} />
        </div>
      ))}
      
      <div className="mapa-test-info">
        <h3>ℹ️ Información</h3>
        <p>Si no ves los mapas:</p>
        <ul>
          <li>Verifica que hayas configurado tu API key de Google Maps en el archivo <code>.env</code></li>
          <li>Asegúrate de que la API key sea válida y tenga permisos para JavaScript API</li>
          <li>Reinicia el servidor después de configurar la API key</li>
        </ul>
      </div>
    </div>
  );
};

export default MapaTest;
