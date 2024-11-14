import axios from 'axios';

// Configura la URL base de la API
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Cambia este URL según la dirección de tu backend
});

// Obtén todos los eventos
export const getEventos = async () => {
  try {
    const response = await api.get('/eventos'); // Cambiado a ruta relativa
    return response.data;
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    throw error;
  }
};

// Crear un nuevo evento
export const createEvento = async (eventoData) => {
  try {
    const response = await api.post('http://localhost:4000/api/eventos', eventoData); // Cambiado a ruta relativa
    return response.data;
  } catch (error) {
    console.error('Error creando evento:', error);
    throw error;
  }
};

