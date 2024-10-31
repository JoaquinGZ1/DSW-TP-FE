import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importa Axios

const CategoriaSelect = ({ onSelect }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Realiza la solicitud GET usando Axios
        const response = await axios.get('/api/categorias'); // Asegúrate de que la URL sea correcta
        setCategorias(response.data); // Guarda las categorías en el estado
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div>
      <label htmlFor="categoria">Selecciona una categoría:</label>
      <select id="categoria" onChange={(e) => onSelect(e.target.value)} required>
        <option value="">Seleccione una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.name} {/* Asegúrate de que el campo 'nombre' existe en tu objeto categoría */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoriaSelect;
