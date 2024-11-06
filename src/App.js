import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import EventoList from './pages/EventoList.js';
import EventoPage from './pages/EventoPage.js';
import EntradaPage from './pages/EntradaPage.js';
import UsuarioPage from './pages/UsuarioPage.js';
import EventoCreate from './pages/EventoCreate.js';
import LoginUsuario from './pages/LoginUsuario.js';
import LoginOrganizador from './pages/LoginOrganizador.js';
import RegisterUsuario from './pages/RegisterUsuario.js';
import SeleccionLogin from './pages/SeleccionLogin.js'; // Asegúrate de importar el componente

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado leyendo el token desde el localStorage
    const token = localStorage.getItem('Token');
    console.log('Token desde localStorage:', token);  // Para verificar si está bien recuperado
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Si no hay token, el usuario no está autenticado
    }
  }, []); // Se ejecuta una vez al montar el componente

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Si está autenticado, muestra las rutas principales */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<EventoList />} />
              <Route path="/eventos" element={<EventoPage />} />
              <Route path="/entrada" element={<EntradaPage />} />
              <Route path="/usuario" element={<UsuarioPage />} />
              <Route path="/EventoCreate" element={<EventoCreate />} />
            </>
          ) : (
            // Si no está autenticado, redirige a la página de selección de login
            <Route path="*" element={<SeleccionLogin/>} />
          )}

          {/* Rutas para login */}
          <Route path="/seleccion-login" element={<SeleccionLogin />} />
          <Route path="/login-usuario" element={<LoginUsuario setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login-organizador" element={<LoginOrganizador />} />
          <Route path="/register" element={<RegisterUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
