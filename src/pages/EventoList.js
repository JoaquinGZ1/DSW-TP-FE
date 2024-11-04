import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/eventos'); // Ruta relativa
        setEventos(response.data.data); // Verifica que 'data' sea correcto
      } catch (error) {
        console.error("Error fetching eventos:", error);
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
          <li key={evento.id}>{evento.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventosPage;

/*import React, { useEffect, useState } from 'react';
import { getEventos } from './api'; // Asegúrate de que esta ruta coincida con la ubicación de tus funciones de API

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true); // Inicia la carga
        const data = await getEventos(); // Llama a la función para obtener los eventos
        setEventos(data); // Asigna los eventos obtenidos al estado
      } catch (error) {
        console.error('Error al obtener eventos:', error);
        setError(error.message);
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    fetchEventos();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error al obtener eventos: {error}</p>;

  return (
    <div>
      <h1>Lista de Eventos</h1>
      {eventos.length > 0 ? (
        <ul>
          {eventos.map((evento) => (
            <li key={evento.id}>{evento.name}</li> // Cambia `name` por el campo que quieres mostrar
          ))}
        </ul>
      ) : (
        <p>No hay eventos disponibles.</p>
      )}
    </div>
  );
};

export default EventosPage;*/

