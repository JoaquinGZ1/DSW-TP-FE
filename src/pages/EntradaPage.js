import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EntradasUsuario() {
  const [entradas, setEntradas] = useState([]); // Almacenamos las entradas
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Obtener el ID del usuario desde localStorage y verifica si existe
  const usuario = JSON.parse(localStorage.getItem('user')); // Cambié 'usuario' a 'user'
  const usuarioId = usuario?.id;
  console.log('usuarioId:', usuarioId);

  useEffect(() => {
    // Si no hay usuarioId, redirigir a la página de inicio y salir del efecto
    if (!usuarioId) {
      navigate('/');
      return;
    }

    // Función para obtener las entradas del usuario
    const fetchEntradas = async () => {
      try {
        // Llama al endpoint para obtener las entradas del usuario
        const response = await axios.get(`http://localhost:4000/api/usuarios/${usuarioId}/entradas`);
        console.log('Respuesta de entradas:', response.data); // Verifica la respuesta

        // Asumiendo que las entradas están dentro de response.data.data
        setEntradas(response.data.data); // Guardar las entradas en el estado
      } catch (error) {
        console.error('Error al obtener entradas:', error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    // Llama a la función para obtener entradas
    fetchEntradas();
  }, [usuarioId, navigate]);

  // Muestra "Cargando..." mientras se obtienen los datos
  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Mis Entradas</h1>
      {entradas.length > 0 ? (
        <ul className="entradas-list">
          {entradas.map((entrada) => {
            const fecha = new Date(entrada.date); // Asegúrate de que 'date' existe
            return (
              <li key={entrada.code} className="entrada-item">
                <div className="entrada-info">
                  <h2>{entrada.evento?.name || 'Evento no disponible'}</h2> {/* Maneja eventos nulos o faltantes */}
                  <p>Tipo de Entrada: {entrada.tipoEntrada?.name || 'Tipo no disponible'}</p>
                  <p>Estado: {entrada.status}</p>
                  <p>Fecha de Compra: {fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                  <p>Hora: {fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tienes entradas registradas.</p>
      )}
    </div>
  );
}

export default EntradasUsuario;
