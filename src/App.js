import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.js';
import EventoList from './pages/EventoList.js';
import EventoPage from './pages/EventoPage.js'; // Nueva página para botones de eventos
import EntradaPage from './pages/EntradaPage.js'; // Nueva página para botones de entradas
import UsuarioPage from './pages/UsuarioPage.js'; // Nueva página para botones de usuarios
import EventoCreate from './pages/EventoCreate.js'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<EventoList />} />
          <Route path="/eventos" element={<EventoPage />} />
          <Route path="/entrada" element={<EntradaPage />} />
          <Route path="/usuario" element={<UsuarioPage />} />
          <Route path="/EventoCreate.js" element={<EventoCreate />} />
          {/* Agrega otras rutas si es necesario */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
