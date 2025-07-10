import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import MapaEventoMejorado from '../components/MapaEventoMejorado'; // Versión con geocodificación
import './EventoList.css';





const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para el orden de fecha
  const [eventoAbierto, setEventoAbierto] = useState(null); // Estado para el acordeón
  const [loadingEntrada, setLoadingEntrada] = useState({}); // Loading state para cada botón

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const [eventosRes, categoriasRes] = await Promise.all([
        axios.get('http://localhost:4000/api/eventos'),
        axios.get('http://localhost:4000/api/categorias')
      ]);
      setEventos(eventosRes.data.data);
      setCategorias(categoriasRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener entrada mejorada
  const handleObtenerEntrada = async (evento) => {
    try {
      setLoadingEntrada(prev => ({ ...prev, [evento.id]: true }));
      
      const usuario = JSON.parse(localStorage.getItem('user'));

      const entradaData = {
        status: 'comprada',
        tipoEntrada: 1,
        usuario: usuario.id,
        evento: evento.id,
      };

      console.log('Usuario al obtener entrada:', usuario);
      console.log('Datos que se van a enviar:', entradaData);

      await axios.post('http://localhost:4000/api/entrada', entradaData);

      alert('¡Entrada obtenida con éxito! 🎉');
      
      // Opcional: Actualizar la lista de eventos para reflejar cambios
      await fetchEventos();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Ya tienes una entrada para este evento 🎟️');
      } else {
        console.error("Error al obtener entrada:", error);
        alert('Ocurrió un error al obtener la entrada. Por favor intenta nuevamente.');
      }
    } finally {
      setLoadingEntrada(prev => ({ ...prev, [evento.id]: false }));
    }
  };

  // Función para ordenar eventos según la fecha
  const sortEventosByDate = (order) => {
    const sortedEventos = [...eventos].sort((a, b) => {
      const dateA = new Date(a.date);
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

  // Función para filtrar eventos
  const eventosFiltrados = categoriaSeleccionada
    ? eventos.filter(evento => evento.eventoCategoria?.id === parseInt(categoriaSeleccionada))
    : eventos;

  // Alternar la visibilidad del detalle del evento
  const toggleEvento = (id) => {
    // Si el evento que se hace clic es el mismo que está abierto, se cierra, si no se abre
    setEventoAbierto(eventoAbierto === id ? null : id);
  };

  // Helpers para formatear información
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerEstadoEvento = (fecha) => {
    if (!fecha) return { estado: 'sin-fecha', texto: 'Sin fecha' };
    
    const ahora = new Date();
    const fechaEvento = new Date(fecha);
    const diferencia = fechaEvento - ahora;
    
    if (diferencia > 0) {
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      if (dias === 1) {
        return { estado: 'proximo', texto: 'Mañana' };
      } else if (dias <= 7) {
        return { estado: 'proximo', texto: `En ${dias} días` };
      } else {
        return { estado: 'futuro', texto: 'Próximamente' };
      }
    } else {
      return { estado: 'pasado', texto: 'Finalizado' };
    }
  };

  const obtenerInfoEvento = (evento) => {
    const estadoEvento = obtenerEstadoEvento(evento.date);
    
    return {
      nombre: evento.name || 'Evento sin nombre',
      descripcion: evento.description || 'Sin descripción disponible',
      categoria: evento.eventoCategoria?.name || 'Sin categoría',
      cupos: evento.cupos || 'No disponible',
      organizador: evento.organizador?.nickname || 'No disponible',
      ubicacion: evento.ubicacion || 'Sin ubicación',
      fecha: evento.date || null,
      foto: evento.photo ? `http://localhost:4000/${evento.photo}` : null,
      estado: estadoEvento
    };
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="evento-list-container">
      <h1>🎉 Eventos Disponibles</h1>
    
      <div className="filters-container">
        <div className="sort-container">
          <label htmlFor="sortOrder">📅 Ordenar por fecha: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="asc">Más próximos primero</option>
            <option value="desc">Más lejanos primero</option>
          </select>
        </div>

        <div className="category-filter">
          <label htmlFor="categoria">🏷️ Filtrar por categoría: </label>
          <select
            id="categoria"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <div className="no-eventos">
          <span className="emoji">🎭</span>
          <h3>No hay eventos disponibles</h3>
          <p>¡Pronto habrá nuevos eventos emocionantes!</p>
        </div>
      ) : (
        <ul>
          {eventosFiltrados.map(evento => {
            const infoEvento = obtenerInfoEvento(evento);
            
            return (
              <li key={evento.id} className="evento-card" data-expanded={eventoAbierto === evento.id}>
                <div className="evento-header" onClick={() => toggleEvento(evento.id)}>
                  <div className="evento-image-area">
                    {infoEvento.foto ? (
                      <img
                        src={infoEvento.foto}
                        alt={infoEvento.nombre}
                      />
                    ) : (
                      <div className="evento-placeholder">
                        🎭 Sin imagen disponible
                      </div>
                    )}
                  </div>
                  <h2>{infoEvento.nombre}</h2>
                  
                  <div className="evento-info-section">
                    <div className="fecha-destacada">
                      <strong>📅 Fecha:</strong> {formatearFecha(infoEvento.fecha)}
                    </div>
                    
                    <div className={`estado-evento ${infoEvento.estado.estado}`}>
                      <strong>⏰ Estado:</strong> {infoEvento.estado.texto}
                    </div>
                    
                    <div className="info-destacada">
                      <strong>🏷️ Categoría:</strong> {infoEvento.categoria}
                    </div>
                  </div>
                </div>

                {/* Solo se muestra si el evento está abierto */}
                {eventoAbierto === evento.id && (
                  <div className="evento-details">
                    <div className="evento-info-completa">
                      <p><strong>📝 Descripción:</strong> {infoEvento.descripcion}</p>
                      <p><strong>👥 Cupos disponibles:</strong> {infoEvento.cupos}</p>
                      <p><strong>🏢 Organizador:</strong> {infoEvento.organizador}</p>
                    </div>

                    {infoEvento.ubicacion && infoEvento.ubicacion !== 'Sin ubicación' && (
                      <div className="evento-ubicacion-section">
                        <p><strong>📍 Ubicación:</strong> {infoEvento.ubicacion}</p>
                        <div className="evento-mapa-container">
                          <p><strong>🗺️ Mapa del evento:</strong></p>
                          <MapaEventoMejorado direccion={infoEvento.ubicacion} />
                        </div>
                      </div>
                    )}

                    <div className="evento-actions">
                      <button
                        className="obtener-entrada-btn"
                        onClick={() => handleObtenerEntrada(evento)}
                        disabled={loadingEntrada[evento.id] || infoEvento.estado.estado === 'pasado'}
                      >
                        {loadingEntrada[evento.id] ? (
                          '⏳ Obteniendo...'
                        ) : infoEvento.estado.estado === 'pasado' ? (
                          '❌ Evento finalizado'
                        ) : (
                          '🎟️ Obtener Entrada'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
  </div>
);}

export default EventosPage;
