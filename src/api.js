
import axios from 'axios';

// Configura la URL base de la API
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia este URL según la dirección de tu backend
});

// Obtén todos los eventos
export const getEventos = async () => {
  try {
    const response = await api.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    throw error;
  }
};

// Crear un nuevo evento
export const createEvento = async (eventoData) => {
  try {
    const response = await api.post('/eventos', eventoData);
    return response.data;
  } catch (error) {
    console.error('Error creando evento:', error);
    throw error;
  }
};

// Actualizar un evento existente
export const updateEvento = async (id, updatedData) => {
  try {
    const response = await api.put(`/eventos/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando evento:', error);
    throw error;
  }
};

// Eliminar un evento
export const deleteEvento = async (id) => {
  try {
    const response = await api.delete(`/eventos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando evento:', error);
    throw error;
  }
};


export const getCategorias = async () => {
  try {
    const response = await api.get('/categorias'); // Asegúrate de que esta ruta existe en tu backend
    return response.data;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
};