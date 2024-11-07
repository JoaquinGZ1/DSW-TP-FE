import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import EventoList from './pages/EventoList.js';
import EventoPage from './pages/EventoPage.js';
import EntradaPage from './pages/EntradaPage.js';
import UsuarioPage from './pages/UsuarioPage.js';
import EventoCreate from './pages/EventoCreate.js';
import LoginUsuario from './pages/LoginUsuario.js';
import LoginOrganizador from './pages/LoginOrganizador.js';
import RegisterUsuario from './pages/RegisterUsuario.js';
import SeleccionLogin from './pages/SeleccionLogin.js';
import ModificarUsuarioPage from './pages/ModificarUsuarioPage.js';
import RegisterOrganizador from './pages/RegisterOrganizador.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado leyendo el token desde el localStorage
    const token = localStorage.getItem('Token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
              <Route path="/modificar-Usuario" element={<ModificarUsuarioPage />} />
            </>
          ) : (
            // Si no está autenticado, redirige a la página de selección de login
            <Route path="*" element={<Navigate to="/seleccion-login" replace />} />
          )}

          {/* Rutas para login */}
          <Route path="/seleccion-login" element={<SeleccionLogin />} />
          <Route path="/login-usuario" element={<LoginUsuario setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login-organizador" element={<LoginOrganizador  setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/registerUsuario" element={<RegisterUsuario />} />
          <Route path="/registerOrganizador" element={<RegisterOrganizador />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
