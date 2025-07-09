import React from 'react';

// Componente fallback para mostrar cuando Google Maps no está disponible
const MapaFallback = ({ direccion }) => {
  const handleOpenInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      width: '100%',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      marginTop: '1rem',
      color: '#6c757d',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🗺️</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Ubicación del Evento</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>
        <strong>Dirección:</strong> {direccion}
      </p>
      <button
        onClick={handleOpenInGoogleMaps}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Ver en Google Maps
      </button>
    </div>
  );
};

export default MapaFallback;
