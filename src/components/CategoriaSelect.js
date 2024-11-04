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

        // Asegúrate de que setCategorias reciba un arreglo
        setCategorias(Array.isArray(response.data) ? response.data : response.data.data || []);
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
