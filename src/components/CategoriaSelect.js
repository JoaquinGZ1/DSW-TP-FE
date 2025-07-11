import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriaSelect = ({ onSelect }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categorias');
      setCategorias(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedCategoria(value);
    onSelect(value);
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div>
      <label>
        Categoría:
        <select 
          value={selectedCategoria} 
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CategoriaSelect;
