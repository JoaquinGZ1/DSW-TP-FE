import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import MapaEvento from './MapaEvento.js'; // ruta según tu estructura
import './EventoList.css';

const handleObtenerEntrada = async (evento) => {
  try {
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

    alert('Entrada obtenida con éxito');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert('Ya tenés una entrada para este evento 🎟️');
    } else {
      console.error("Error al obtener entrada:", error);
      alert('Ocurrió un error al obtener la entrada');
    }
  }
};





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
          <p><strong>Fecha:</strong> {new Date(evento.date).toLocaleString('es-ES', { hour12: false })}</p>

          </div>
          
          {/* Solo se muestra si el evento está abierto */}
          {eventoAbierto === evento.id && (
            <div className="evento-details">
              <p><strong>Descripción:</strong> {evento.description ? evento.description : 'No disponible'} </p>
              <p><strong>Categoría:</strong> {evento.eventoCategoria?.name}</p>
              <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
              <MapaEvento direccion={evento.ubicacion} />  {/* cambiar APIKEY*/}
              <p><strong>Cupos:</strong> {evento.cupos}</p>
              <button
                className="obtener-entrada-btn"
                onClick={() => handleObtenerEntrada(evento)}
              >
                Obtener Entrada
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);}

export default EventosPage;
