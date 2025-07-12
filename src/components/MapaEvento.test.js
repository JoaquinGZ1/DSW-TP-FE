import React, { useEffect, useRef, useState } from 'react';
import './MapaEvento.css';

const MapaEvento = ({ direccion, altura = '300px', ancho = '100%' }) => {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('Iniciando...');

  useEffect(() => {
    const testMap = async () => {
      if (!direccion) {
        setStatus('Sin dirección');
        return;
      }

      setStatus('Probando geocodificación...');
      
      try {
        // Test simple de geocodificación
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`);
        const data = await response.json();
        
        console.log('Test de geocodificación:', { direccion, data });
        
        if (data && data.length > 0) {
          setStatus(`Coordenadas: ${data[0].lat}, ${data[0].lon}`);
        } else {
          setStatus('No se encontraron coordenadas');
        }

        // Test simple de iframe como fallback
        setTimeout(() => {
          if (mapRef.current) {
            const lat = data.length > 0 ? data[0].lat : -34.6118;
            const lon = data.length > 0 ? data[0].lon : -58.3960;
            
            mapRef.current.innerHTML = `
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}"
                style="width: 100%; height: 100%; border: none; border-radius: 8px;"
                title="Mapa de ${direccion}"
              ></iframe>
            `;
            setStatus('Mapa cargado con iframe');
          }
        }, 1000);

      } catch (error) {
        console.error('Error en test:', error);
        setStatus(`Error: ${error.message}`);
        
        // Fallback visual
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="mapa-fallback">
              <div class="mapa-fallback-content">
                <h4>📍 Ubicación</h4>
                <p>${direccion}</p>
                <small>Mapa no disponible temporalmente</small>
              </div>
            </div>
          `;
        }
      }
    };

    testMap();
  }, [direccion]);

  if (!direccion) {
    return (
      <div className="mapa-evento-container">
        <div className="mapa-fallback">
          <div className="mapa-fallback-content">
            <h4>📍 Ubicación</h4>
            <p>No se especificó ubicación</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-evento-container">
      <div className="debug-info" style={{ padding: '5px', fontSize: '12px', background: '#f0f0f0' }}>
        Estado: {status}
      </div>
      <div 
        ref={mapRef}
        className="mapa-evento"
        style={{ height: altura, width: ancho }}
      >
        <div className="mapa-loading">
          <div className="mapa-spinner"></div>
          <p>Inicializando mapa para: {direccion}</p>
        </div>
      </div>
    </div>
  );
};

export default MapaEvento;
