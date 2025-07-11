import React, { useEffect, useRef, useState } from 'react';
import './MapaEvento.css';

const MapaEvento = ({ direccion, altura = '300px', ancho = '100%' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Función para inicializar el mapa con OpenStreetMap
    const initMap = async () => {
      if (!direccion || !mapRef.current || !isMounted) return;

      try {
        // Verificar nuevamente que el ref existe y el componente está montado
        if (!mapRef.current || !isMounted) return;

        // Geocodificar la dirección usando Nominatim (OpenStreetMap)
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        let lat = -34.6118; // Buenos Aires por defecto
        let lon = -58.3960;

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
        }

        // Crear el mapa usando Leaflet
        if (window.L && mapRef.current && isMounted) {
          // Si ya existe un mapa, eliminarlo
          if (mapInstance.current) {
            mapInstance.current.remove();
          }

          // Verificar una vez más que el ref existe y el componente está montado
          if (!mapRef.current || !isMounted) return;

          // Crear nuevo mapa
          mapInstance.current = window.L.map(mapRef.current).setView([lat, lon], 15);

          // Agregar tiles de OpenStreetMap
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance.current);

          // Agregar marcador
          window.L.marker([lat, lon])
            .addTo(mapInstance.current)
            .bindPopup(direccion)
            .openPopup();

        } else {
          // Fallback: mostrar iframe de OpenStreetMap
          if (mapRef.current && isMounted) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            
            mapRef.current.innerHTML = '';
            mapRef.current.appendChild(iframe);
          }
        }

      } catch (error) {
        console.error('Error al cargar el mapa:', error);
        
        // Fallback en caso de error - verificar que el ref todavía existe y el componente está montado
        if (mapRef.current && isMounted) {
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

    // Cargar Leaflet si no está disponible
    if (!window.L) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJS.onload = initMap;
      document.head.appendChild(leafletJS);
    } else {
      initMap();
    }

    // Cleanup function
    return () => {
      setIsMounted(false);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [direccion, isMounted]);

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
        <div className="mapa-loading">
          <div className="mapa-spinner"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    </div>
  );
};

export default MapaEvento;
