import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapaEvento from './MapaEvento'; // Asegúrate de importar esto si quieres mostrar el mapa
import './EventoList.css'; // Reutilizamos el mismo CSS

function EntradasUsuario() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('user'));
  const usuarioId = usuario?.id;

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    const fetchEntradas = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/usuarios/${usuarioId}/entradas`);
        setEntradas(response.data.data);
      } catch (error) {
        console.error('Error al obtener entradas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, [usuarioId, navigate]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="evento-list-container">
      <h1>Mis Entradas</h1>
      {entradas.length > 0 ? (
        <ul>
          {entradas.map((entrada, index) => {
            const evento = entrada.evento;
            const fecha = new Date(entrada.date);
            const fechaEvento = evento?.date ? new Date(evento.date) : null;

            return (
              <li key={entrada.code || `entrada-${index}`} className="evento-card">
                <div className="evento-header">
                  {evento?.photo && (
                    <img
                      src={`http://localhost:4000/${evento.photo}`}
                      alt={evento.name}
                    />
                  )}
                  <h2>{evento?.name || 'Evento no disponible'}</h2>
                </div>

                <div className="evento-details">
                  {/* Sección de fechas - bien separadas */}
                  <div className="fecha-section">
                    <p><strong>📅 Fecha del Evento:</strong> {fechaEvento ? (
                      `${fechaEvento.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} a las ${fechaEvento.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    ) : 'Fecha no disponible'}</p>
                    
                    <p><strong>🛒 Fecha de Compra de la Entrada:</strong> {!isNaN(fecha.getTime()) ? (
                      `${fecha.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} a las ${fecha.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    ) : 'Fecha no disponible'}</p>
                  </div>

                  {/* Información de la entrada */}
                  <div className="entrada-info">
                    <p><strong>🎟️ Tipo de Entrada:</strong> {entrada.tipoEntrada?.name || 'No disponible'}</p>
                    <p><strong>✅ Estado:</strong> {entrada.status}</p>
                  </div>

                  {/* Información del evento */}
                  <div className="evento-info">
                    <p><strong>📝 Descripción:</strong> {evento?.description || 'No disponible'}</p>
                    <p><strong>🏷️ Categoría:</strong> {evento?.eventoCategoria?.name || 'Sin categoría'}</p>
                    <p><strong>📍 Ubicación:</strong> {evento?.ubicacion || 'No especificada'}</p>
                  </div>
                  
                  {evento?.ubicacion && <MapaEvento direccion={evento.ubicacion} />}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tienes entradas registradas.</p>
      )}
    </div>
  );
}

export default EntradasUsuario;
