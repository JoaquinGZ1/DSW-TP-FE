import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import EventoList from './pages/EventoList.js';
import EventoPage from './pages/EventoPage.js';
import EntradaPage from './pages/EntradaPage.js';
import UsuarioPage from './pages/UsuarioPage.js';
import EventoCreate from './pages/EventoCreate.js';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/login';
import RegisterPage from './pages/RegisterPage';  // Importa RegisterPage

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Ruta para el registro */}

          {/* Rutas protegidas para organizadores */}
          <Route
            path="/eventos/crear"
            element={
              <PrivateRoute requiredRole="organizador">
                <EventoCreate />
              </PrivateRoute>
            }
          />

          {/* Rutas accesibles para ambos roles */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <EventoList />
              </PrivateRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <PrivateRoute>
                <EventoPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/entrada"
            element={
              <PrivateRoute>
                <EntradaPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuario"
            element={
              <PrivateRoute>
                <UsuarioPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
