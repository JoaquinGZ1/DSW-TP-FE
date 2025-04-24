import { useEffect, useRef } from 'react';

const MapaEvento = ({ direccion }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!direccion) return;

    // Cargar el script de Google Maps si aún no está cargado
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: direccion }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: results[0].geometry.location,
          });

          new window.google.maps.Marker({
            map,
            position: results[0].geometry.location,
          });
        } else {
          console.error('No se pudo geocodificar la dirección:', status);
        }
      });
    }
  }, [direccion]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '300px', marginTop: '1rem' }}
    />
  );
};

export default MapaEvento;
