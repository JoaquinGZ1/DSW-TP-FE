

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
            {/* Logo en la esquina superior izquierda */}
      <div className="navbar-logo">
      <a  href="/">
        <img src="/gragas.png" alt="Logo" className="logo" style={{ width: '128px', height: '128px' }} /> {/* Cambia el path a tu logo */}
      </a>
      </div>
      <div className="navbar-buttons">
        <Link to="/eventos" className="navbar-button">Evento</Link>
        <Link to="/entrada" className="navbar-button">Entrada</Link>
        <Link to="/usuario" className="navbar-button">Usuario</Link>
      </div>
    </nav>
  );
}

export default Navbar;
