import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapaEventoMejorado from '../components/MapaEventoMejorado';
import './EntradaPage.css';

const EntradaPage = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entradaAbierta, setEntradaAbierta] = useState(null); // Para el acordeón individual
  const [loadingEliminar, setLoadingEliminar] = useState({}); // Loading state para cada entrada

  useEffect(() => {
    fetchEntradas();
  }, []);

  const fetchEntradas = async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem('user'));
      
      if (!usuario || !usuario.id) {
        setError('Usuario no encontrado');
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/usuarios/${usuario.id}/entradas`);
      setEntradas(response.data.data);
    } catch (error) {
      console.error("Error al obtener entradas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Alternar la visibilidad del detalle de la entrada (acordeón individual)
  const toggleEntrada = (id) => {
    setEntradaAbierta(entradaAbierta === id ? null : id);
  };

  // Función para eliminar entrada
  const handleEliminarEntrada = async (entradaId) => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.'
    );

    if (!confirmacion) return;

    try {
      setLoadingEliminar(prev => ({ ...prev, [entradaId]: true }));
      
      await axios.delete(`http://localhost:4000/api/entrada/${entradaId}`);
      
      // Actualizar la lista de entradas eliminando la entrada borrada
      setEntradas(prev => prev.filter(entrada => entrada.id !== entradaId));
      
      // Si la entrada eliminada estaba abierta, cerrar el acordeón
      if (entradaAbierta === entradaId) {
        setEntradaAbierta(null);
      }
      
      alert('Entrada eliminada exitosamente');
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      alert('Error al eliminar la entrada. Por favor intenta nuevamente.');
    } finally {
      setLoadingEliminar(prev => ({ ...prev, [entradaId]: false }));
    }
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

  const formatearFechaCompra = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerInfoEvento = (entrada) => {
    // Usar información del evento siempre que esté disponible
    return {
      nombre: entrada.evento?.name || 'Evento no disponible',
      descripcion: entrada.evento?.description || 'Sin descripción',
      categoria: entrada.evento?.eventoCategoria?.name || 'Sin categoría',
      cupos: entrada.evento?.cupos || 'No disponible',
      organizador: entrada.evento?.organizador?.nickname || 'No disponible',
      ubicacion: entrada.evento?.ubicacion || 'Sin ubicación',
      fechaEvento: entrada.evento?.date || null,
      foto: entrada.evento?.photo ? `http://localhost:4000/${entrada.evento.photo}` : null
    };
  };

  // Helper para obtener el estado de la entrada
  const obtenerEstadoEntrada = (entrada) => {
    // Usar el estado calculado del backend si está disponible
    if (entrada.estadoCalculado) {
      return {
        estado: entrada.estadoCalculado.toLowerCase(),
        texto: entrada.estadoCalculado,
        icono: entrada.estadoCalculado === 'Activa' ? '✅' : '⏰'
      };
    }
    
    // Fallback: calcular localmente si no viene del backend
    const ahora = new Date();
    const fechaEvento = new Date(entrada.evento?.date);
    
    if (fechaEvento > ahora) {
      return { estado: 'activa', texto: 'Activa', icono: '✅' };
    } else {
      return { estado: 'expirada', texto: 'Expirada', icono: '⏰' };
    }
  };

  if (loading) return <p>Cargando entradas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="evento-list-container">
      <h1>Mis Entradas</h1>
      
      {entradas.length === 0 ? (
        <div className="no-entradas">
          <span className="emoji">🎫</span>
          <h3>No tienes entradas</h3>
          <p>¡Explora los eventos disponibles y obtén tu primera entrada!</p>
        </div>
      ) : (
        <ul>
          {entradas.map((entrada) => {
            const infoEvento = obtenerInfoEvento(entrada);
            const estadoEntrada = obtenerEstadoEntrada(entrada);
            
            return (
              <li key={entrada.id} className="evento-card" data-expanded={entradaAbierta === entrada.id}>
                <div className="evento-header" onClick={() => toggleEntrada(entrada.id)}>
                  <div className="evento-image-area">
                    {infoEvento.foto ? (
                      <img
                        src={infoEvento.foto}
                        alt={infoEvento.nombre}
                      />
                    ) : (
                      <div className="entrada-placeholder">
                        🎫 Sin imagen disponible
                      </div>
                    )}
                  </div>
                  <h2>{infoEvento.nombre}</h2>
                  
                  <div className="entrada-info-section">
                    <div className="entrada-id">
                      <strong>Código de Entrada:</strong> #{entrada.id}
                    </div>
                    
                    <div className={`estado-entrada ${estadoEntrada.estado}`}>
                      <strong>{estadoEntrada.icono} Estado:</strong> {estadoEntrada.texto}
                    </div>
                    
                    <div className="fecha-destacada">
                      <strong>📅 Fecha del Evento:</strong> {formatearFecha(infoEvento.fechaEvento)}
                    </div>
                    
                    <div className="info-destacada">
                      <strong>🛒 Comprada el:</strong> {formatearFechaCompra(entrada.date)}
                    </div>
                  </div>
                </div>

                {/* Solo se muestra si la entrada está abierta */}
                {entradaAbierta === entrada.id && (
                  <div className="evento-details">
                    <div className="evento-info-entrada">
                      <p><strong>📝 Descripción:</strong> {infoEvento.descripcion}</p>
                      <p><strong>📂 Categoría:</strong> {infoEvento.categoria}</p>
                      <p><strong>👥 Cupos:</strong> {infoEvento.cupos}</p>
                      <p><strong>🏢 Organizador:</strong> {infoEvento.organizador}</p>
                    </div>

                    {infoEvento.ubicacion && infoEvento.ubicacion !== 'Sin ubicación' && (
                      <div className="entrada-ubicacion-section">
                        <p><strong>📍 Ubicación:</strong> {infoEvento.ubicacion}</p>
                        <div className="entrada-mapa-container">
                          <p><strong>🗺️ Mapa del evento:</strong></p>
                          <MapaEventoMejorado direccion={infoEvento.ubicacion} />
                        </div>
                      </div>
                    )}

                    <div className="evento-actions">
                      <button
                        className="btn-eliminar-entrada"
                        onClick={() => handleEliminarEntrada(entrada.id)}
                        disabled={loadingEliminar[entrada.id]}
                      >
                        {loadingEliminar[entrada.id] ? 'Eliminando...' : 'Eliminar Entrada'}
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
  );
};

export default EntradaPage;
