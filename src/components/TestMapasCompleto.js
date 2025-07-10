import React from 'react';
import MapaEventoMejorado from '../components/MapaEventoMejorado';

const TestMapasCompleto = () => {
  const direccionesDePrueba = [
    "Buenos Aires, Argentina",
    "Córdoba, Argentina", 
    "Rosario, Santa Fe, Argentina",
    "La Plata, Buenos Aires, Argentina",
    "Mendoza, Argentina"
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>🗺️ Prueba de Mapas con Geocodificación</h1>
      
      {direccionesDePrueba.map((direccion, index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <h3>📍 {direccion}</h3>
          <MapaEventoMejorado direccion={direccion} />
        </div>
      ))}
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>ℹ️ Información</h3>
        <p>• Los mapas deben mostrar cada ubicación específica</p>
        <p>• Si una dirección no se encuentra, se mostrará Buenos Aires por defecto</p>
        <p>• Cada mapa tiene geocodificación automática usando Nominatim</p>
        <p>• Haz clic en los marcadores para ver más información</p>
      </div>
    </div>
  );
};

export default TestMapasCompleto;
