import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import EventoList from './pages/EventoList.js';
import EntradaPage from './pages/EntradaPage.js'; // Verifica que este archivo exista en 'pages'
import UsuarioPage from './pages/UsuarioPage.js';
import EventoCreate from './pages/EventoCreate.js';
import LoginUsuario from './pages/LoginUsuario.js';
import LoginOrganizador from './pages/LoginOrganizador.js';
import RegisterUsuario from './pages/RegisterUsuario.js';
import SeleccionLogin from './pages/SeleccionLogin.js';
import ModificarUsuarioPage from './pages/ModificarUsuarioPage.js';
import RegisterOrganizador from './pages/RegisterOrganizador.js';
import OrganizadorPage from './pages/OrganizadorPage.js';
import ModificarOrganizadorPage from './pages/ModificarOrganizadorPage.js'; // Elimina el punto y coma extra
import NavbarLogin from './components/NavbarLogin.js';
import EventosOrganizador from './pages/EventosOrganizador.js';
import CategoriaPage from './pages/CategoriaPage.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('Token'));

  useEffect(() => {
    // Verificar si el usuario está autenticado leyendo el token desde el localStorage en cada renderizado
    const token = localStorage.getItem('Token');
    setIsAuthenticated(!!token); // Actualiza isAuthenticated basado en la existencia del token
  }, []);


  return (
    <Router>
      {isAuthenticated ? <Navbar /> : <NavbarLogin />}
      <div className="main-content">
        <Routes>
          {/* Si está autenticado, muestra las rutas principales */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<EventoList />} />
              <Route path="/entrada" element={<EntradaPage />} />
              <Route path="/usuario" element={<UsuarioPage />} />
              <Route path="/EventoCreate" element={<EventoCreate />} />
              <Route path="/modificar-Usuario" element={<ModificarUsuarioPage />} />
              <Route path="/organizador" element={<OrganizadorPage/>} />
              <Route path="/categorias" element={<CategoriaPage />} />
              <Route path="/modificar-organizador" element={<ModificarOrganizadorPage />} />
              <Route path="/EventosOrganizador" element={<EventosOrganizador />} />
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
