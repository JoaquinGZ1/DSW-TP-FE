import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  // Obtener el rol del usuario desde localStorage
  const role = localStorage.getItem('role');

  return (
    <nav className="navbar">
      {/* Logo en la esquina superior izquierda */}
      <div className="navbar-logo">
        <Link to="/"> {/* Cambiar <a href="/"> a <Link to="/"> */}
          <img src="/gragas.png" alt="Logo" className="logo" style={{ width: '128px', height: '128px' }} />
        </Link>
      </div>

      <div className="navbar-buttons">
        {/* Botón para Eventos siempre visible */}
        <Link to="/" className="navbar-button">Eventos</Link>

        {/* Si el rol es 'usuario', mostrar 'Entradas' y 'Perfil' */}
        {role === 'usuario' && (
          <>
            <Link to="/entrada" className="navbar-button">Entradas</Link>
            <Link to="/usuario" className="navbar-button">Perfil</Link>
          </>
        )}

        {/* Si el rol es 'organizador', mostrar solo 'Eventos' y 'Perfil' */}
        {role === 'organizador' && (
          <>
            <Link to="/usuario" className="navbar-button">Perfil</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
