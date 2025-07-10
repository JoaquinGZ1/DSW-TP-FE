import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapaEve    const detallesCompletos = `
INFORMACIÓN COMPLETA DEL EVENTO

Nombre: ${evento.name || 'No disponible'}
ID: ${evento.id}
Fecha: ${evento.date ? new Date(evento.date).toLocaleString('es-ES', { 
  dateStyle: 'full', 
  timeStyle: 'short' 
}) : 'Fecha no especificada'}
Ubicación: ${evento.ubicacion || 'No especificada'}
Categoría: ${evento.eventoCategoria?.name || 'Sin categoría'}
Cupos disponibles: ${evento.cupos || 'No especificado'}
Organizador: 
${organizadorInfo}

Descripción:
${evento.description || 'No hay descripción disponible'}
    `;../components/MapaEventoMejorado';
import './CategoriaPage.css';

function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [eventoExpandido, setEventoExpandido] = useState(null);

  // Llamada a la API para obtener categorías y eventos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, eventosRes] = await Promise.all([
          axios.get('http://localhost:4000/api/categorias'),
          axios.get('http://localhost:4000/api/eventos')
        ]);
        
        setCategorias(categoriasRes.data.data);
        setEventos(eventosRes.data.data);
      } catch (err) {
        setError('Hubo un error al cargar los datos');
        console.error('Error al obtener los datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar eventos por categoría
  const eventosPorCategoria = categorias.map(categoria => ({
    ...categoria,
    eventos: eventos.filter(evento => evento.eventoCategoria?.id === categoria.id)
  }));

  // Filtrar categorías basadas en búsqueda y selección
  const categoriasFiltradas = eventosPorCategoria.filter(categoria => {
    const matchesSearch = categoria.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSelection = selectedCategoria === 'todas' || categoria.id === parseInt(selectedCategoria);
    return matchesSearch && matchesSelection && categoria.eventos.length > 0;
  });

  // Alternar expansión de evento
  const toggleEvento = (eventoId) => {
    setEventoExpandido(eventoExpandido === eventoId ? null : eventoId);
  };

  // Función para obtener entrada
  const handleObtenerEntrada = async (evento) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('user'));
      
      if (!usuario) {
        alert('❌ Debes iniciar sesión para obtener una entrada');
        return;
      }

      const entradaData = {
        status: 'comprada',
        tipoEntrada: 1,
        usuario: usuario.id,
        evento: evento.id,
      };

      await axios.post('http://localhost:4000/api/entrada', entradaData);
      alert('✅ ¡Entrada obtenida con éxito!');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('ℹ️ Ya tienes una entrada para este evento 🎟️');
      } else {
        console.error("Error al obtener entrada:", error);
        alert('❌ Ocurrió un error al obtener la entrada');
      }
    }
  };

  // Función para ver detalles completos del evento
  const handleVerDetallesCompletos = (evento) => {
    // Log para debug - ver qué datos tenemos del organizador
    console.log('Evento completo:', evento);
    console.log('Organizador:', evento.organizador);
    
    // Crear un objeto con toda la información del evento
    const organizadorInfo = evento.organizador 
      ? `${evento.organizador.nickname || 'Nombre no disponible'}\nEmail: ${evento.organizador.email || 'No disponible'}`
      : 'Información no disponible';
    
    const detallesCompletos = `
�️ INFORMACIÓN COMPLETA DEL EVENTO 🎟️

� Nombre: ${evento.name || 'No disponible'}
🆔 ID: ${evento.id}
📅 Fecha: ${evento.date ? new Date(evento.date).toLocaleString('es-ES', { 
  dateStyle: 'full', 
  timeStyle: 'short' 
}) : 'Fecha no especificada'}
📍 Ubicación: ${evento.ubicacion || 'No especificada'}
🏷️ Categoría: ${evento.eventoCategoria?.name || 'Sin categoría'}
👥 Cupos disponibles: ${evento.cupos || 'No especificado'}
🏛️ Organizador: 
${organizadorInfo}

📝 Descripción:
${evento.description || 'No hay descripción disponible'}
    `;

    alert(detallesCompletos.trim());
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Cargando categorías...</p></div>;

  return (
    <div className="categoria-page">
      <div className="categoria-header">
        <h1>Eventos por Categorías</h1>
        <p className="categoria-subtitle">Explora eventos organizados por categorías temáticas</p>
      </div>

      {/* Controles de filtrado y visualización */}
      <div className="categoria-controls">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categorías..."
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-container">
          <label htmlFor="categoria-select">Filtrar por categoría:</label>
          <select 
            id="categoria-select"
            value={selectedCategoria} 
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name} ({eventos.filter(e => e.eventoCategoria?.id === categoria.id).length})
              </option>
            ))}
          </select>
        </div>

        <div className="view-controls">
          <label>Vista:</label>
          <div className="view-buttons">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Tarjetas
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && <div className="error-message">❌ {error}</div>}

      {/* Mostrar categorías con sus eventos */}
      <div className="categorias-container">
        {categoriasFiltradas.length === 0 ? (
          <div className="no-results">
            <h3>No se encontraron categorías</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          categoriasFiltradas.map((categoria) => (
            <div key={categoria.id} className="categoria-section">
              <div className="categoria-header-section">
                <h2>{categoria.name}</h2>
                <p className="categoria-description">{categoria.description}</p>
                <div className="categoria-stats">
                  <span className="stat">{categoria.eventos.length} eventos</span>
                  <span className="stat">{categoria.usuariosSeguidos?.length || 0} seguidores</span>
                </div>
              </div>                <div className={`eventos-grid ${viewMode}`}>
                {categoria.eventos.map((evento) => (
                  <div key={evento.id} className={`evento-card ${eventoExpandido === evento.id ? 'expandido' : ''}`}>
                    <div className="evento-header" onClick={() => toggleEvento(evento.id)}>
                      {evento.photo && (
                        <img
                          src={`http://localhost:4000/${evento.photo}`}
                          alt={evento.name}
                          className="evento-image"
                        />
                      )}
                      <div className="evento-info">
                        <h3>{evento.name || 'Evento sin nombre'}</h3>
                      </div>
                      <div className="expand-indicator">
                        {eventoExpandido === evento.id ? '▲' : '▼'}
                      </div>
                    </div>

                    {eventoExpandido === evento.id && (
                      <div className="evento-info-expandida">
                        <p className="evento-fecha">
                          Fecha: {evento.date ? new Date(evento.date).toLocaleString('es-ES', { 
                            dateStyle: 'full', 
                            timeStyle: 'short' 
                          }) : 'Fecha no especificada'}
                        </p>
                        <p className="evento-ubicacion">Ubicación: {evento.ubicacion || 'Ubicación no especificada'}</p>
                      </div>
                    )}

                    {eventoExpandido === evento.id && (
                      <div className="evento-details">
                        {/* Información detallada en grid */}
                        <div className="evento-info-detallada">
                          <div className="info-item">
                            <span className="icon"></span>
                            <span><strong>Cupos:</strong> {evento.cupos || 'No especificado'}</span>
                          </div>
                          <div className="info-item">
                            <span className="icon"></span>
                            <span><strong>Categoría:</strong> {evento.eventoCategoria?.name || 'Sin categoría'}</span>
                          </div>
                          <div className="info-item">
                            <span className="icon"></span>
                            <span><strong>ID del Evento:</strong> {evento.id}</span>
                          </div>
                          <div className="info-item">
                            <span className="icon"></span>
                            <span><strong>Estado:</strong> Activo</span>
                          </div>
                        </div>

                        {/* Información del organizador */}
                        {evento.organizador && (
                          <div className="evento-organizador">
                            <h5>Información del Organizador</h5>
                            <p><strong>Nombre:</strong> {evento.organizador.nickname || 'No disponible'}</p>
                            <p><strong>Email:</strong> {evento.organizador.email || 'No disponible'}</p>
                            {evento.organizador.telefono && (
                              <p><strong>Teléfono:</strong> {evento.organizador.telefono}</p>
                            )}
                          </div>
                        )}

                        {/* Descripción del evento */}
                        <p><strong>Descripción:</strong></p>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #e9ecef',
                          marginBottom: '16px',
                          lineHeight: '1.5'
                        }}>
                          {evento.description || 'Descripción no disponible'}
                        </div>
                        
                        {/* Mapa del evento */}
                        {evento.ubicacion && (
                          <div className="evento-mapa">
                            <h4>Ubicación del evento</h4>
                            <div className="mapa-container">
                              <MapaEventoMejorado direccion={evento.ubicacion} />
                            </div>
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="evento-actions">
                          <button 
                            className="btn-ver-evento"
                            onClick={() => handleVerDetallesCompletos(evento)}
                          >
                            Ver detalles completos
                          </button>
                          <button 
                            className="btn-obtener-entrada"
                            onClick={() => handleObtenerEntrada(evento)}
                          >
                            Obtener entrada
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoriaPage;
