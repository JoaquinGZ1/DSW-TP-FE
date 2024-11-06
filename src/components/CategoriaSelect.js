import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoriaSelect = ({ onSelect }) => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/categorias');
        console.log('Datos de la API:', response.data);

        // Ordena las categorías alfabéticamente por nombre antes de guardarlas en el estado
        const sortedCategorias = (Array.isArray(response.data) ? response.data : response.data.data || [])
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategorias(sortedCategorias);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setError('No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <label htmlFor="categoria">Selecciona una categoría:</label>
      <select id="categoria" onChange={(e) => onSelect(e.target.value)} required>
        <option value="">Seleccione una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.name} {/* Cambia "name" si tu campo es diferente */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoriaSelect;
