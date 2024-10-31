// EventoCreate.js
import React, { useState } from 'react';
import { createEvento } from '../api'; // Asegúrate de tener esta función en tu API
import CategoriaSelect from '../components/CategoriaSelect'; // Asegúrate de tener este componente
import './EventoCreate.css'; // Asegúrate de tener este archivo CSS

const EventoCreate = () => {
  const [name, setName] = useState('');
  const [cupos, setCupos] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null); // Para manejar imágenes
  const [date, setDate] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [organizador, setOrganizador] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Estructura de datos según lo que espera tu backend
    const eventoData = {
      name,
      cupos: parseInt(cupos),
      description,
      photo, // Asegúrate de que tu backend pueda manejar el formato de la foto
      date: new Date(date).toISOString(),
      categoria, // Aquí se incluye la categoría seleccionada
      ubicacion,
      organizador, // ID o referencia al organizador
    };

    try {
      const createdEvento = await createEvento(eventoData);
      console.log('Evento creado:', createdEvento);
      // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error creando el evento:', error);
      // Maneja el error de manera adecuada
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit}>
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
            />
          </label>
        </div>
        <div>
          <label>
            Foto (opcional):
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])} // Manejo de archivos
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

        {/* Aquí se incluye el componente de selección de categoría */}
        <CategoriaSelect onSelect={setCategoria} />

        <div>
          <label>
            Ubicación:
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Organizador:
            <input
              type="text"
              value={organizador}
              onChange={(e) => setOrganizador(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Crear Evento</button>
      </form>
    </div>
  );
};

export default EventoCreate;
