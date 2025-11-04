import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import MapaEvento from '../components/MapaEvento';
import './EventoList.css';
import config from '../config';





const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [soloSeguidas, setSoloSeguidas] = useState(false); // Nuevo estado para filtrar solo seguidas
  const [categoriasSeguidas, setCategoriasSeguidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para el orden de fecha
  const [eventoAbierto, setEventoAbierto] = useState(null); // Estado para el acordeón
  const [loadingEntrada, setLoadingEntrada] = useState({}); // Loading state para cada botón

  // Obtener el usuario del localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Obtener categorías seguidas por el usuario
  useEffect(() => {
    const fetchCategoriasSeguidas = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const response = await axios.get(`${config.apiUrl}/api/usuarios/${user.id}/categorias-seguidas`);
        setCategoriasSeguidas(response.data.data.map(cat => cat.id));
      } catch (err) {
        console.error('Error al obtener categorías seguidas:', err);
      }
    };

    fetchCategoriasSeguidas();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const [eventosRes, categoriasRes] = await Promise.all([
        axios.get(`${config.apiUrl}/api/eventos`),
        axios.get(`${config.apiUrl}/api/categorias`)
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

      await axios.post(`${config.apiUrl}/api/entrada`, entradaData);

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

  // Handler para el checkbox de categorías seguidas
  const handleSoloSeguidasChange = (e) => {
    const isChecked = e.target.checked;
    setSoloSeguidas(isChecked);
    
    // Si se activa "Solo categorías seguidas", resetear filtro de categoría específica
    if (isChecked) {
      setCategoriaSeleccionada('');
    }
  };

  // Handler para el select de categoría específica
  const handleCategoriaChange = (e) => {
    const selectedCategoria = e.target.value;
    setCategoriaSeleccionada(selectedCategoria);
    
    // Si se selecciona una categoría específica, desactivar "Solo seguidas"
    if (selectedCategoria !== '') {
      setSoloSeguidas(false);
    }
  };

  // Función para filtrar eventos
  const eventosFiltrados = () => {
    let eventosFinal = eventos;

    // Filtrar por categoría específica seleccionada
    if (categoriaSeleccionada) {
      eventosFinal = eventosFinal.filter(evento => 
        evento.eventoCategoria?.id === parseInt(categoriaSeleccionada)
      );
    }

    // Filtrar solo por categorías seguidas
    if (soloSeguidas && categoriasSeguidas.length > 0) {
      eventosFinal = eventosFinal.filter(evento => 
        evento.eventoCategoria && categoriasSeguidas.includes(evento.eventoCategoria.id)
      );
    }

    return eventosFinal;
  };

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
      foto: evento.photo ? `${config.apiUrl}/${evento.photo}` : null,
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
            onChange={handleCategoriaChange}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>

        {getCurrentUser() && categoriasSeguidas.length > 0 && (
          <div className="followed-categories-filter">
            <label>
              <input
                type="checkbox"
                checked={soloSeguidas}
                onChange={handleSoloSeguidasChange}
              />
              <span>⭐ Solo categorías que sigo ({categoriasSeguidas.length})</span>
            </label>
          </div>
        )}
      </div>

      {eventosFiltrados().length === 0 ? (
        <div className="no-eventos">
          <span className="emoji">🎭</span>
          <h3>No hay eventos disponibles</h3>
          <p>¡Pronto habrá nuevos eventos emocionantes!</p>
        </div>
      ) : (
        <ul>
          {eventosFiltrados().map(evento => {
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
                          <MapaEvento direccion={infoEvento.ubicacion} />
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
