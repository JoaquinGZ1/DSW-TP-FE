import React, { useState } from 'react';
import config from '../config';

/**
 * Componente de diagnóstico para verificar configuración en producción
 * Solo visible en desarrollo o cuando hay problemas
 */
function DiagnosticoAPI() {
  const [info] = useState({
    nodeEnv: process.env.NODE_ENV,
    reactAppApiUrl: process.env.REACT_APP_API_URL,
    configApiUrl: config.apiUrl,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
    origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
  });

  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/categorias`);
      if (response.ok) {
        const data = await response.json();
        setTestResult({ success: true, message: 'Conexión exitosa', data });
      } else {
        setTestResult({ success: false, message: `Error: ${response.status}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  // Solo mostrar si estamos en localhost o si config.apiUrl es localhost
  const shouldShow = info.hostname.includes('localhost') || info.configApiUrl.includes('localhost');

  if (!shouldShow && info.isProduction) {
    return null; // No mostrar en producción si todo está bien
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: info.configApiUrl.includes('localhost') && info.isProduction ? '#ff4444' : '#333',
      color: 'white',
      padding: '15px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto',
      borderTop: '3px solid ' + (info.configApiUrl.includes('localhost') && info.isProduction ? '#ff0000' : '#4CAF50')
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>🔧 Diagnóstico de API</strong>
        <button 
          onClick={testConnection}
          disabled={testing}
          style={{
            padding: '5px 10px',
            cursor: testing ? 'not-allowed' : 'pointer',
            background: '#4CAF50',
            border: 'none',
            color: 'white',
            borderRadius: '3px'
          }}
        >
          {testing ? 'Probando...' : 'Probar Conexión'}
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>NODE_ENV:</td>
            <td style={{ padding: '5px' }}>{info.nodeEnv || 'undefined'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>REACT_APP_API_URL:</td>
            <td style={{ padding: '5px' }}>{info.reactAppApiUrl || 'undefined'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>config.apiUrl:</td>
            <td style={{ padding: '5px', color: info.configApiUrl.includes('localhost') ? '#ff6666' : '#66ff66' }}>
              {info.configApiUrl}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>Hostname:</td>
            <td style={{ padding: '5px' }}>{info.hostname}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>isDevelopment:</td>
            <td style={{ padding: '5px' }}>{String(info.isDevelopment)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <td style={{ padding: '5px', fontWeight: 'bold' }}>isProduction:</td>
            <td style={{ padding: '5px' }}>{String(info.isProduction)}</td>
          </tr>
        </tbody>
      </table>

      {testResult && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: testResult.success ? '#2e7d32' : '#c62828',
          borderRadius: '3px'
        }}>
          {testResult.success ? '✅' : '❌'} {testResult.message}
        </div>
      )}

      {info.configApiUrl.includes('localhost') && info.isProduction && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: '#ff0000',
          borderRadius: '3px',
          fontWeight: 'bold'
        }}>
          ⚠️ ERROR: En producción pero usando localhost. 
          Verifica REACT_APP_API_URL en Vercel.
        </div>
      )}
    </div>
  );
}

export default DiagnosticoAPI;
