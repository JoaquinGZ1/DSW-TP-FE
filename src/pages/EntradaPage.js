import React from 'react';
import { Link } from 'react-router-dom';
import './EntradaPage.css'; // Si necesitas estilos específicos para esta página

function EntradaPage() {
  return (
    <div className="e ntrada-page">
      <h2>Opciones de Entradas</h2>
      <div className="event-buttons">
        <Link to="/ver-Entradas" className="event-button">Ver Entradas</Link>
        <Link to="/crear-Entrada" className="event-button">Crear Entrada</Link>
        <Link to="/modificar-Entrada" className="event-button">Modificar Entrada</Link>
        <Link to="/eliminar-Entrada" className="event-button">Eliminar Entrada</Link>
      </div>
    </div>
  );
}

export default EntradaPage;
