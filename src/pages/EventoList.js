import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './EventoList.css';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para el orden de fecha
  const [eventoAbierto, setEventoAbierto] = useState(null); // Estado para el acordeón

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    fetchData();
  }, []);

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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
  <div className="evento-list-container">
    <h1>Lista de Eventos</h1>
    <div className="filters-container">
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

      <div className="category-filter">
        <label htmlFor="categoria">Filtrar por categoría: </label>
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

    <ul>
      {eventosFiltrados.map(evento => (
        <li key={evento.id} className="evento-card">
          <div className="evento-header" onClick={() => toggleEvento(evento.id)}>
            {evento.photo && (
              <img
                src={`http://localhost:4000/${evento.photo}`}
                alt={evento.name}
              />
            )}
            <h2>{evento.name}</h2>
          </div>
          
          {/* Solo se muestra si el evento está abierto */}
          {eventoAbierto === evento.id && (
            <div className="evento-details">
              <p><strong>Descripción:</strong> {evento.description}</p>
              <p><strong>Categoría:</strong> {evento.eventoCategoria?.name}</p>
              <p><strong>Fecha:</strong> {new Date(evento.date).toLocaleString('es-ES', { hour12: false })}</p>
              <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
              <p><strong>Cupos:</strong> {evento.cupos}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);}

export default EventosPage;
