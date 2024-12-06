import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriaPage.css';  // Asegúrate de que la ruta sea correcta

function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc'); // Estado para el orden alfabético

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

  return (
    <div className="categoria-page">
      <h2>Lista de Categorías</h2>

      {/* Barra de búsqueda con lupa */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar categorías..."
        />
        <button>🔍</button>
      </div>

      {/* Menú desplegable para ordenar */}
      <div>
        <label>Ordenar por: </label>
        <select value={order} onChange={handleOrderChange}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && <p>{error}</p>}

      {/* Mostrar categorías filtradas y ordenadas */}
      <ul>
        {filteredCategorias.length === 0 ? (
          <p>No se encontraron categorías</p>
        ) : (
          filteredCategorias.map((categoria) => (
            <li key={categoria.id}>
              <h3>{categoria.name}</h3>
              <p>{categoria.description}</p>
              <p><strong>Eventos:</strong> {categoria.eventos ? categoria.eventos.length : 0}</p>
              <p><strong>Usuarios Seguidos:</strong> {categoria.usuariosSeguidos ? categoria.usuariosSeguidos.length : 0}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CategoriaPage;
