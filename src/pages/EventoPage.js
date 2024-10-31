import React from 'react';
import { Link } from 'react-router-dom';
import './EventoPage.css'; // Si necesitas estilos específicos para esta página

function EventoPage() {
  return (
    <div className="eventos-page">
      <h2>Opciones de Eventos</h2>
      <div className="event-buttons">
        <Link to="/" className="event-button">Ver Eventos</Link>
        <Link to="/EventoCreate.js" className="event-button">Crear Evento</Link>
        <Link to="/modificar-evento" className="event-button">Modificar Evento</Link>
        <Link to="/eliminar-evento" className="event-button">Eliminar Evento</Link>
      </div>
    </div>
  );
}

export default EventoPage;
