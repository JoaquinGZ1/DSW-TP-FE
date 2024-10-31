import React from 'react';
import { Link } from 'react-router-dom';
import './UsuarioPage.css';

function UsuarioPage() {
  return (
    <div className="usuario-page">
      <h2>Opciones de Usuarios</h2>
      <div className="event-buttons">
        <Link to="/ver-Usuarios" className="event-button">Ver Usuarios</Link>
        <Link to="/crear-Usuario" className="event-button">Crear Usuario</Link>
        <Link to="/modificar-Usuario" className="event-button">Modificar Usuario</Link>
        <Link to="/eliminar-Usuario" className="event-button">Eliminar Usuario</Link>
      </div>
    </div>
  );
}

export default UsuarioPage;
