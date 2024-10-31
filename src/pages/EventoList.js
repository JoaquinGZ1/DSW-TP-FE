import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/eventos'); // Cambia la URL según tu configuración
        setEventos(response.data.data); // Ajusta la propiedad según tu respuesta
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Lista de Eventos</h1>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>{evento.name}</li> // Cambia 'nombre' por el campo que desees mostrar
        ))}
      </ul>
    </div>
  );
};

export default EventosPage;
