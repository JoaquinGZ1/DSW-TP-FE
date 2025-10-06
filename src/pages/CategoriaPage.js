import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriaPage.css';  // Asegúrate de que la ruta sea correcta

function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeguidas, setCategoriasSeguidas] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc'); // Estado para el orden alfabético
  const [loadingFollow, setLoadingFollow] = useState({}); // Estado para cargas por categoría

  // Obtener el usuario del localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Llamada a la API para obtener todas las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Solicitar todas las categorías desde el backend
        const response = await axios.get('http://localhost:4000/api/categorias');
        setCategorias(response.data.data); // Guardar las categorías en el estado
      } catch (err) {
        setError('Hubo un error al cargar las categorías');
        console.error('Error al obtener las categorías:', err);
      }
    };

    fetchCategorias();
  }, []); // El array vacío asegura que se ejecute solo una vez cuando el componente se monta

  // Obtener categorías seguidas por el usuario
  useEffect(() => {
    const fetchCategoriasSeguidas = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const response = await axios.get(`http://localhost:4000/api/usuarios/${user.id}/categorias-seguidas`);
        setCategoriasSeguidas(response.data.data.map(cat => cat.id));
      } catch (err) {
        console.error('Error al obtener categorías seguidas:', err);
      }
    };

    fetchCategoriasSeguidas();
  }, []);

  // Función para seguir/dejar de seguir una categoría
  const toggleSeguirCategoria = async (categoriaId) => {
    const user = getCurrentUser();
    if (!user) {
      setError('Debes iniciar sesión para seguir categorías');
      return;
    }

    setLoadingFollow(prev => ({ ...prev, [categoriaId]: true }));

    try {
      const esSeguida = categoriasSeguidas.includes(categoriaId);
      const endpoint = esSeguida ? 'unfollow-categoria' : 'follow-categoria';
      
      await axios.post(`http://localhost:4000/api/usuarios/${user.id}/${endpoint}`, {
        categoriaId: categoriaId
      });

      // Actualizar estado local de categorías seguidas
      if (esSeguida) {
        setCategoriasSeguidas(prev => prev.filter(id => id !== categoriaId));
      } else {
        setCategoriasSeguidas(prev => [...prev, categoriaId]);
      }

      // Actualizar el contador de usuarios seguidos en tiempo real
      setCategorias(prevCategorias => 
        prevCategorias.map(categoria => {
          if (categoria.id === categoriaId) {
            const currentCount = categoria.usuariosSeguidos ? categoria.usuariosSeguidos.length : 0;
            return {
              ...categoria,
              usuariosSeguidos: esSeguida 
                ? Array(Math.max(0, currentCount - 1)).fill({}) // Decrementar
                : Array(currentCount + 1).fill({}) // Incrementar
            };
          }
          return categoria;
        })
      );

      setError(''); // Limpiar cualquier error previo
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar seguimiento de categoría');
      console.error('Error al seguir/dejar de seguir categoría:', err);
    } finally {
      setLoadingFollow(prev => ({ ...prev, [categoriaId]: false }));
    }
  };

  // Función para ordenar las categorías
  const handleOrderChange = (event) => {
    const newOrder = event.target.value;
    setOrder(newOrder);
    const sortedCategorias = [...categorias].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.name.localeCompare(b.name); // Orden ascendente
      } else {
        return b.name.localeCompare(a.name); // Orden descendente
      }
    });
    setCategorias(sortedCategorias);
  };

  // Filtrar las categorías basadas en el término de búsqueda
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = getCurrentUser();

  return (
    <div className="categoria-page">
      <h2>Categorías de Eventos</h2>

      <div className="filters-container">
        {/* Barra de búsqueda */}
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categorías..."
          />
          <button>Buscar</button>
        </div>

        {/* Menú desplegable para ordenar */}
        <div className="sort-container">
          <label>Ordenar por:</label>
          <select value={order} onChange={handleOrderChange}>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && <div className="error-message">{error}</div>}

      {/* Mostrar categorías filtradas y ordenadas */}
      <ul>
        {filteredCategorias.length === 0 ? (
          <div className="no-categorias">
            <h3>No se encontraron categorías</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          filteredCategorias.map((categoria) => (
            <li key={categoria.id} className="categoria-item">
              <div className="categoria-header">
                <div className="categoria-info">
                  <h3>{categoria.name}</h3>
                  
                </div>
                {currentUser && (
                  <div className="categoria-actions">
                    <button
                      onClick={() => toggleSeguirCategoria(categoria.id)}
                      disabled={loadingFollow[categoria.id]}
                      className={`btn-seguir ${categoriasSeguidas.includes(categoria.id) ? 'siguiendo' : 'no-siguiendo'}`}
                    >
                      {loadingFollow[categoria.id] 
                        ? 'Procesando...' 
                        : categoriasSeguidas.includes(categoria.id) 
                          ? 'Dejar de Seguir' 
                          : 'Seguir'
                      }
                    </button>
                  </div>
                )}
              </div>
              
              <div className="categoria-stats">
                <div className="stat-item">
                  <div className="stat-number">{categoria.eventos ? categoria.eventos.length : 0}</div>
                  <div className="stat-label">Eventos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{categoria.usuariosSeguidos ? categoria.usuariosSeguidos.length : 0}</div>
                  <div className="stat-label">Seguidores</div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CategoriaPage;
