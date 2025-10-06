import React, { useEffect, useRef, useState } from 'react';
import './MapaEvento.css';

const MapaEvento = ({ direccion, altura = '300px', ancho = '100%' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!direccion || !mapRef.current || !isMounted) return;

      try {
        setLoading(true);
        setError(null);

        // Limpiar contenido previo
        if (mapRef.current) {
          mapRef.current.innerHTML = '<div class="mapa-loading"><div class="mapa-spinner"></div><p>Inicializando mapa...</p></div>';
        }

        // Geocodificar la dirección
        console.log('Geocodificando dirección:', direccion);
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
        
        const response = await fetch(geocodeUrl);
        if (!response.ok) {
          throw new Error(`Error en geocodificación: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos de geocodificación:', data);

        let lat = -34.6118; // Buenos Aires por defecto
        let lon = -58.3960;

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
          console.log('Coordenadas encontradas:', { lat, lon });
        } else {
          console.log('Usando coordenadas por defecto (Buenos Aires)');
        }

        // Verificar si Leaflet está disponible
        if (typeof window.L === 'undefined') {
          console.log('Leaflet no disponible, cargando...');
          await loadLeaflet();
        }

        if (!isMounted || !mapRef.current) return;

        // Limpiar mapa anterior
        if (mapInstance.current) {
          try {
            mapInstance.current.remove();
          } catch (e) {
            console.warn('Error al limpiar mapa anterior:', e);
          }
          mapInstance.current = null;
        }

        // Limpiar el contenedor
        mapRef.current.innerHTML = '';

        console.log('Creando mapa con Leaflet...');
        
        // Crear el mapa
        mapInstance.current = window.L.map(mapRef.current, {
          center: [lat, lon],
          zoom: 15,
          zoomControl: true,
          attributionControl: true
        });

        // Agregar capa de tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(mapInstance.current);

        // Agregar marcador
        window.L.marker([lat, lon])
          .addTo(mapInstance.current)
          .bindPopup(`📍 ${direccion}`)
          .openPopup();

        console.log('Mapa creado exitosamente');
        setLoading(false);

      } catch (error) {
        console.error('Error al inicializar mapa:', error);
        setError(error.message);
        setLoading(false);
        
        // Mostrar fallback
        if (mapRef.current && isMounted) {
          mapRef.current.innerHTML = `
            <div class="mapa-fallback">
              <div class="mapa-fallback-content">
                <h4>📍 Ubicación</h4>
                <p>${direccion}</p>
                <small>Mapa no disponible: ${error.message}</small>
              </div>
            </div>
          `;
        }
      }
    };

    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        // Verificar si ya están los elementos
        if (document.querySelector('link[href*="leaflet.css"]') && 
            document.querySelector('script[src*="leaflet.js"]')) {
          
          // Esperar a que Leaflet esté disponible
          const checkLeaflet = () => {
            if (window.L) {
              resolve();
            } else {
              setTimeout(checkLeaflet, 100);
            }
          };
          checkLeaflet();
          return;
        }

        // Cargar CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.crossOrigin = '';
          document.head.appendChild(leafletCSS);
        }

        // Cargar JS
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const leafletJS = document.createElement('script');
          leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletJS.crossOrigin = '';
          
          leafletJS.onload = () => {
            console.log('Leaflet cargado exitosamente');
            resolve();
          };
          
          leafletJS.onerror = () => {
            reject(new Error('Error al cargar Leaflet'));
          };
          
          document.head.appendChild(leafletJS);
        }

        // Timeout de seguridad
        setTimeout(() => {
          if (!window.L) {
            reject(new Error('Timeout al cargar Leaflet'));
          }
        }, 10000);
      });
    };

    // Inicializar el mapa
    initMap();

    // Cleanup
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          console.warn('Error en cleanup:', e);
        }
        mapInstance.current = null;
      }
    };
  }, [direccion]);

  if (!direccion) {
    return (
      <div className="mapa-evento no-direccion">
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
      <div 
        ref={mapRef}
        className="mapa-evento"
        style={{ height: altura, width: ancho }}
      >
        {loading && (
          <div className="mapa-loading">
            <div className="mapa-spinner"></div>
            <p>Cargando mapa...</p>
          </div>
        )}
        {error && (
          <div className="mapa-fallback">
            <div className="mapa-fallback-content">
              <h4>📍 Ubicación</h4>
              <p>{direccion}</p>
              <small>Error: {error}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaEvento;
