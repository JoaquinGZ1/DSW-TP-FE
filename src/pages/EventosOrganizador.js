import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EventosOrganizador.css';

function EventosOrganizador() {
  const [eventos, setEventos] = useState([]); // Almacenamos los eventos
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Obtener el ID del organizador desde localStorage y verifica si existe
  const organizador = JSON.parse(localStorage.getItem('organizador'));
  const organizadorId = organizador?.id;
  console.log('organizadorId:', organizadorId);

  useEffect(() => {
    // Si no hay organizadorId, redirigir a la página de inicio y salir del efecto
    if (!organizadorId) {
      navigate('/');
      return;
    }

    // Función para obtener los eventos del organizador
    const fetchEventos = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/organizadores/${organizadorId}/eventos`);
        console.log('Respuesta de eventos:', response.data); // Verifica la respuesta

        // Asumiendo que los eventos están dentro de response.data.data
        setEventos(response.data.data); // Guardar los eventos en el estado
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    // Llama a la función para obtener eventos
    fetchEventos();
  }, [organizadorId, navigate]);

  // Función para eliminar un evento
const eliminarEvento = async (id) => {
  const confirmacion = prompt(
    'Para confirmar la eliminación, escribe la palabra "ELIMINAR":'
  );  

  if (confirmacion === 'ELIMINAR') {
    try {
      await axios.delete(`http://localhost:4000/api/eventos/${id}`);
      // Agregar un retraso antes de recargar la página
      setTimeout(() => {
        window.location.reload(); // Recargar la página después de mostrar el mensaje
      }, 500); // Espera 500 ms para que la alerta sea visible
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      alert('Hubo un problema al eliminar el evento.');
    }
  } else {
    alert('Eliminación cancelada. Escribiste incorrectamente o cancelaste la operación.');
  }
};


  // Muestra "Cargando..." mientras se obtienen los datos
  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Mis Eventos</h1>
      {eventos.length > 0 ? (
        <ul className="eventos-list">
          {eventos.map((evento) => {
            const fecha = new Date(evento.date);
            return (
              <li key={evento.id} className="evento-item">
                <div className="evento-info">
                  <h2>{evento.name}</h2>
                  <p>{evento.description}</p>
                  <p>Fecha: {fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p>Hora: {fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarEvento(evento.id)}
                >
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tienes eventos creados.</p>
      )}
    </div>
  );
}

export default EventosOrganizador;
