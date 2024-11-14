import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Asegúrate de tener axios instalado: `npm install axios`
import CategoriaSelect from '../components/CategoriaSelect';
import './EventoCreate.css';

const EventoCreate = () => {
  const [name, setName] = useState('');
  const [cupos, setCupos] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [organizador, setOrganizador] = useState('');

  // Recupera el organizador desde localStorage al cargar el componente
  useEffect(() => {
    const organizadorData = localStorage.getItem('organizador');
    if (organizadorData) {
      const organizador = JSON.parse(organizadorData);
      setOrganizador(organizador.id); // Ajusta según cómo esté estructurado el objeto organizador
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('cupos', parseInt(cupos, 10));
    formData.append('description', description);
    formData.append('date', new Date(date).toISOString());
    formData.append('ubicacion', ubicacion);
    formData.append('organizador', organizador); // Organizador asignado automáticamente
    formData.append('categoria', categoria);

    // Solo agregar la foto si el usuario ha seleccionado una
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      // Realizar la llamada al backend usando Axios
console.log('Creando evento:');
formData.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});      
      const response = await axios.post('http://localhost:4000/api/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Importante para enviar FormData
        },
      });

      // Si el evento fue creado con éxito, muestra el mensaje y limpia el formulario
      console.log('Evento creado:', response.data);
      console.error('Error al crear el evento');

      
      // Limpiar el formulario después de la creación
      setName('');
      setCupos('');
      setDescription('');
      setPhoto(null);
      setDate('');
      setCategoria('');
      setUbicacion('');
    } catch (error) {
  console.error('Error creando el evento:', error);
  alert(`Error creando evento: ${error.message}`);
  }
  };

  return (
    <div>
      <h2>Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Cupos:
            <input
              type="number"
              value={cupos}
              onChange={(e) => setCupos(e.target.value)}
              required
              min="1"
            />
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength="500"
            />
          </label>
        </div>
        <div>
          <label>
            Foto (opcional):
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
            />
          </label>
        </div>
        <div>
          <label>
            Fecha:
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Componente de selección de categoría */}
        <CategoriaSelect onSelect={setCategoria} />

        <div>
          <label>
            Ubicación:
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
              maxLength="100"
            />
          </label>
        </div>
        
        {/* Organizador no es mostrado en el formulario ya que se asigna automáticamente */}
        
        <button type="submit">Crear Evento</button>
      </form>
    </div>
  );
};

export default EventoCreate;
