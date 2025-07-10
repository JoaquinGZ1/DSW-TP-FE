import React, { useEffect, useState } from 'react';

const MapaDiagnostico = () => {
  const [diagnostico, setDiagnostico] = useState({});

  useEffect(() => {
    const info = {
      apiKeyConfigured: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY && process.env.REACT_APP_GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE',
      apiKeyValue: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 
        (process.env.REACT_APP_GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE' ? 
          'Placeholder (no configurada)' : 
          `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY.substring(0, 10)}...`) : 
        'No definida',
      googleAvailable: !!window.google,
      googleMapsAvailable: !!(window.google && window.google.maps),
      scriptExists: !!document.querySelector('script[src*="maps.googleapis.com"]'),
      userAgent: navigator.userAgent,
      location: window.location.href,
    };
    
    setDiagnostico(info);
    console.log('🔍 Diagnóstico completo de Google Maps:', info);
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '20px 0',
      fontFamily: 'monospace',
      fontSize: '14px'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>🔍 Diagnóstico de Google Maps</h3>
      <div style={{ display: 'grid', gap: '8px' }}>
        <div>
          <strong>API Key configurada:</strong> 
          <span style={{ color: diagnostico.apiKeyConfigured ? 'green' : 'red', marginLeft: '10px' }}>
            {diagnostico.apiKeyConfigured ? '✅ Sí' : '❌ No'}
          </span>
        </div>
        <div>
          <strong>Valor API Key:</strong> 
          <span style={{ marginLeft: '10px', color: '#666' }}>
            {diagnostico.apiKeyValue}
          </span>
        </div>
        <div>
          <strong>Google disponible:</strong> 
          <span style={{ color: diagnostico.googleAvailable ? 'green' : 'orange', marginLeft: '10px' }}>
            {diagnostico.googleAvailable ? '✅ Sí' : '⚠️ No'}
          </span>
        </div>
        <div>
          <strong>Google Maps disponible:</strong> 
          <span style={{ color: diagnostico.googleMapsAvailable ? 'green' : 'orange', marginLeft: '10px' }}>
            {diagnostico.googleMapsAvailable ? '✅ Sí' : '⚠️ No'}
          </span>
        </div>
        <div>
          <strong>Script cargado:</strong> 
          <span style={{ color: diagnostico.scriptExists ? 'green' : 'orange', marginLeft: '10px' }}>
            {diagnostico.scriptExists ? '✅ Sí' : '⚠️ No'}
          </span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <strong>URL:</strong> {diagnostico.location}
        </div>
      </div>
      
      {!diagnostico.apiKeyConfigured && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          color: '#856404'
        }}>
          <strong>⚠️ API Key no configurada</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
            Para configurar tu API key:
            <br />1. Edita el archivo <code>.env</code>
            <br />2. Reemplaza <code>YOUR_API_KEY_HERE</code> con tu API key real
            <br />3. Reinicia el servidor con <code>npm start</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapaDiagnostico;
