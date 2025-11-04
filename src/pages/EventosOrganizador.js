import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapaEvento from '../components/MapaEvento';
import './EventosOrganizador.css';
import config from '../config';

function EventosOrganizador() {
  const [eventos, setEventos] = useState([]); // Almacenamos los eventos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [expandedEventos, setExpandedEventos] = useState(new Set()); // Eventos expandidos
  const [deletingEventos, setDeletingEventos] = useState(new Set()); // Eventos en proceso de eliminación
  const navigate = useNavigate();

  // Obtener el ID del organizador desde localStorage y verifica si existe
  const organizador = JSON.parse(localStorage.getItem('organizador'));
  const organizadorId = organizador?.id;

  useEffect(() => {
    // Si no hay organizadorId, redirigir a la página de inicio y salir del efecto
    if (!organizadorId) {
      navigate('/');
      return;
    }

    // Función para obtener los eventos del organizador
    const fetchEventos = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/organizadores/${organizadorId}/eventos`);
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

  // Helper para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Helper para formatear hora
  const formatearHora = (fecha) => {
    if (!fecha) return 'Hora no disponible';
    try {
      const date = new Date(fecha);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Hora inválida';
    }
  };

  // Helper para formatear cupos
  const formatearCupos = (cupos) => {
    if (!cupos || cupos === 0) return 'Sin límite';
    return `${cupos} personas`;
  };

  // Helper para formatear categoría
  const formatearCategoria = (eventoCategoria) => {
    if (!eventoCategoria || !eventoCategoria.name) return 'Sin categoría';
    return eventoCategoria.name;
  };

  // Helper para formatear ubicación
  const formatearUbicacion = (ubicacion) => {
    if (!ubicacion) return 'Ubicación no especificada';
    return ubicacion.length > 50 ? ubicacion.substring(0, 50) + '...' : ubicacion;
  };

  // Helper para formatear descripción
  const formatearDescripcion = (descripcion) => {
    if (!descripcion) return 'Sin descripción disponible';
    return descripcion;
  };

  // Helper para determinar el estado del evento
  const getEstadoEvento = (fechaEvento) => {
    if (!fechaEvento) return { estado: 'Sin fecha', clase: 'sin-fecha' };
    
    const ahora = new Date();
    const fechaEventoDate = new Date(fechaEvento);
    
    if (fechaEventoDate > ahora) {
      return { estado: 'Activo', clase: 'activo' };
    } else {
      return { estado: 'Finalizado', clase: 'finalizado' };
    }
  };

  // Función para alternar la expansión de un evento
  const toggleExpansion = (eventoId) => {
    setExpandedEventos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventoId)) {
        newSet.delete(eventoId);
      } else {
        newSet.clear(); // Solo un evento expandido a la vez
        newSet.add(eventoId);
      }
      return newSet;
    });
  };

  // Función para eliminar un evento
  const eliminarEvento = async (eventoId) => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.'
    );

    if (confirmacion) {
      setDeletingEventos(prev => new Set(prev).add(eventoId));
      
      try {
        console.log('Intentando eliminar evento...');
        const response = await axios.delete(`${config.apiUrl}/api/eventos/${eventoId}`);
        console.log('Respuesta del servidor:', response);
        
        // Actualizar la lista local eliminando el evento
        setEventos(prev => prev.filter(evento => evento.id !== eventoId));
        console.log('Evento eliminado exitosamente');
        
      } catch (error) {
        console.error('Error al eliminar el evento:', error);
        alert('Hubo un problema al eliminar el evento. Por favor, inténtalo de nuevo.');
      } finally {
        setDeletingEventos(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventoId);
          return newSet;
        });
      }
    }
  };

 


  // Muestra "Cargando..." mientras se obtienen los datos
  if (loading) {
    return (
      <div className="eventos-organizador-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando tus eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="eventos-organizador-container">
      <h1 className="page-title">
        <span className="title-icon">🎯</span>
        Mis Eventos
      </h1>
      
      {eventos.length > 0 ? (
        <div className="eventos-grid">
          {eventos.map((evento) => {
            const isExpanded = expandedEventos.has(evento.id);
            const isDeleting = deletingEventos.has(evento.id);
            const estadoEvento = getEstadoEvento(evento.date);
            
            return (
              <div key={evento.id} className="evento-card">
                <div 
                  className="evento-header"
                  onClick={() => toggleExpansion(evento.id)}
                >
                  {/* Área de imagen */}
                  <div className="evento-image-area">
                    {evento.photo ? (
                      <img 
                        src={`${config.apiUrl}/${evento.photo}`} 
                        alt={evento.name || 'Evento'}
                        className="evento-image"
                        onLoad={() => {
                          console.log('Imagen cargada correctamente:', evento.photo);
                        }}
                        onError={(e) => {
                          console.log('Error cargando imagen:', evento.photo);
                          console.log('URL completa:', `${config.apiUrl}/${evento.photo}`);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="evento-placeholder" 
                      style={{
                        display: evento.photo ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        border: '2px dashed #ddd',
                        color: '#999'
                      }}
                    >
                      <span>📅 Sin imagen</span>
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="evento-info-basic">
                    <div className="evento-title-row">
                      <h3 className="evento-title">{evento.name || 'Evento sin título'}</h3>
                      <span className={`evento-estado ${estadoEvento.clase}`}>
                        {estadoEvento.estado === 'Activo' && <span className="estado-icon">✅</span>}
                        {estadoEvento.estado === 'Finalizado' && <span className="estado-icon">⏰</span>}
                        {estadoEvento.estado === 'Sin fecha' && <span className="estado-icon">❓</span>}
                        {estadoEvento.estado}
                      </span>
                    </div>
                    
                    <div className="evento-info-completa">
                      <div className="info-row">
                        <span className="info-icon">📅</span>
                        <span className="info-text">{formatearFecha(evento.date)} • {formatearHora(evento.date)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">🎫</span>
                        <span className="info-text">{formatearCupos(evento.cupos)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">🏷️</span>
                        <span className="info-text">{formatearCategoria(evento.eventoCategoria)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{formatearUbicacion(evento.ubicacion)}</span>
                      </div>
                    </div>

                    <div className="expand-indicator">
                      <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span className="expand-text">
                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {isExpanded && (
                  <div className="evento-details">
                    <div className="evento-description">
                      <h4>📝 Descripción</h4>
                      <p>{formatearDescripcion(evento.description)}</p>
                    </div>

                    {/* Mapa de ubicación */}
                    {evento.ubicacion && (
                      <div className="evento-mapa">
                        <h4>🗺️ Ubicación en el mapa</h4>
                        <div className="mapa-container">
                          <MapaEvento direccion={evento.ubicacion} />
                        </div>
                      </div>
                    )}

                    <div className="evento-actions">
                      <button
                        className={`btn-eliminar ${isDeleting ? 'deleting' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarEvento(evento.id);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <span className="loading-spinner-small"></span>
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <span className="delete-icon">🗑️</span>
                            Eliminar Evento
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-eventos">
          <div className="no-eventos-icon">📅</div>
          <h3>No tienes eventos creados</h3>
          <p>¡Crea tu primer evento y comienza a gestionar tus actividades!</p>
        </div>
      )}
    </div>
  );
}

export default EventosOrganizador;
