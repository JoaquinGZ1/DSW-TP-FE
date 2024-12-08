import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventoList.css';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para el orden de fecha

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/eventos');
        setEventos(response.data.data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Función para ordenar eventos según la fecha
  const sortEventosByDate = (order) => {
    const sortedEventos = [...eventos].sort((a, b) => {
      const dateA = new Date(a.date); // Convierte a objeto Date
      const dateB = new Date(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setEventos(sortedEventos);
  };

  // Cambiar el orden cuando se selecciona una opción
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortEventosByDate(event.target.value);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Lista de Eventos</h1>

      {/* Dropdown para seleccionar el orden */}
      <div className="sort-container">
        <label htmlFor="sortOrder">Ordenar por fecha: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      <ul>
        {eventos.map(evento => (
          <li key={evento.id} style={{ marginBottom: '20px' }}>
            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              {evento.photo && (
                <img
src={`http://localhost:4000/uploads/${evento.photo}`}
                alt={evento.name}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <h2>{evento.name}</h2>
              <p><strong>Descripción:</strong> {evento.description}</p>
              <p><strong>Fecha:</strong> {new Date(evento.date).toLocaleString('es-ES', { hour12: false })}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventosPage;
