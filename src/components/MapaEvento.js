import React, { useEffect, useRef, useState } from 'react';
import './MapaEvento.css';

const MapaEvento = ({ direccion, altura = '300px', ancho = '100%' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [mapType, setMapType] = useState('loading'); // 'loading', 'leaflet', 'iframe', 'fallback'

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!direccion || !isMounted) return;

      try {
        setStatus('loading');
        setError(null);
        setMapType('loading');

        // Limpiar mapa anterior si existe
        if (mapInstance.current) {
          try {
            mapInstance.current.remove();
          } catch (e) {
            console.warn('Error al limpiar mapa anterior:', e);
          }
          mapInstance.current = null;
        }

        // Geocodificar la dirección
        console.log('🌍 Geocodificando:', direccion);
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
        
        const response = await fetch(geocodeUrl, {
          headers: {
            'User-Agent': 'WeventApp/1.0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error de geocodificación: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📍 Resultado geocodificación:', data);

        // Coordenadas por defecto (Buenos Aires)
        let lat = -34.6118;
        let lon = -58.3960;
        let foundLocation = false;

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
          foundLocation = true;
          console.log('✅ Coordenadas encontradas:', { lat, lon });
        } else {
          console.log('⚠️ Usando coordenadas por defecto');
        }

        if (!isMounted) return;

        // Guardar coordenadas para el iframe fallback
        setCoordinates({ lat, lon, foundLocation });

        // Intentar cargar Leaflet primero
        if (await loadLeaflet()) {
          // Esperar un poco para asegurar que el DOM esté listo
          setTimeout(() => {
            if (isMounted) {
              createLeafletMap(lat, lon, direccion, foundLocation);
            }
          }, 100);
        } else {
          // Fallback a iframe
          setMapType('iframe');
        }

        setStatus('loaded');

      } catch (error) {
        console.error('❌ Error en mapa:', error);
        setError(error.message);
        setStatus('error');
        setMapType('fallback');
      }
    };

    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) {
          resolve(true);
          return;
        }

        // Cargar CSS si no existe
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          css.crossOrigin = '';
          document.head.appendChild(css);
        }

        // Cargar JS si no existe
        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.crossOrigin = '';
          
          script.onload = () => {
            console.log('📦 Leaflet cargado');
            resolve(true);
          };
          
          script.onerror = () => {
            console.log('❌ Error cargando Leaflet');
            resolve(false);
          };
          
          document.head.appendChild(script);

          // Timeout de 5 segundos
          setTimeout(() => {
            if (!window.L) {
              console.log('⏰ Timeout Leaflet');
              resolve(false);
            }
          }, 5000);
        } else {
          // Script existe, esperar a que cargue
          let attempts = 0;
          const checkLeaflet = () => {
            if (window.L) {
              resolve(true);
            } else if (attempts++ < 50) {
              setTimeout(checkLeaflet, 100);
            } else {
              resolve(false);
            }
          };
          checkLeaflet();
        }
      });
    };

    const createLeafletMap = (lat, lon, direccion, foundLocation) => {
      if (!window.L || !mapRef.current) return;

      try {
        // Crear mapa - NO manipular innerHTML, dejar que React controle el DOM
        mapInstance.current = window.L.map(mapRef.current, {
          center: [lat, lon],
          zoom: foundLocation ? 15 : 13,
          zoomControl: true,
          attributionControl: true
        });

        // Agregar tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapInstance.current);

        // Agregar marcador
        const marker = window.L.marker([lat, lon]).addTo(mapInstance.current);
        
        const popupContent = foundLocation 
          ? `📍 ${direccion}`
          : `📍 ${direccion}<br><small>Ubicación aproximada</small>`;
          
        marker.bindPopup(popupContent).openPopup();

        setMapType('leaflet');
        console.log('🗺️ Mapa Leaflet creado exitosamente');

      } catch (error) {
        console.error('Error creando mapa Leaflet:', error);
        setMapType('iframe');
      }
    };

    // Inicializar
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

  const renderMapContent = () => {
    if (mapType === 'loading') {
      return (
        <div className="mapa-loading">
          <div className="mapa-spinner"></div>
          <p>Cargando mapa...</p>
        </div>
      );
    }

    if (mapType === 'iframe' && coordinates) {
      const { lat, lon } = coordinates;
      const bbox = `${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}`;
      const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
      
      return (
        <iframe
          src={iframeSrc}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
          title={`Mapa de ${direccion}`}
          loading="lazy"
        />
      );
    }

    if (mapType === 'fallback' || status === 'error') {
      return (
        <div className="mapa-fallback">
          <div className="mapa-fallback-content">
            <h4>📍 Ubicación</h4>
            <p>{direccion}</p>
            <small>{error ? `Error: ${error}` : 'Mapa no disponible'}</small>
          </div>
        </div>
      );
    }

    // Para leaflet, el div debe estar vacío para que Leaflet lo maneje
    return null;
  };

  return (
    <div className="mapa-evento-container">
      <div 
        ref={mapRef}
        className="mapa-evento"
        style={{ height: altura, width: ancho }}
      >
        {renderMapContent()}
      </div>
    </div>
  );
};

export default MapaEvento;
