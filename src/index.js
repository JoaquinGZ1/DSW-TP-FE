import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';  // Importa el AuthProvider
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolvemos App en AuthProvider para que el contexto de autenticación esté disponible */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Si quieres empezar a medir el rendimiento de la app, puedes pasar una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o enviarlos a un endpoint de analíticas. Aprende más en: https://bit.ly/CRA-vitals
reportWebVitals();
