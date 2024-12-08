import React, { useState, useEffect } from 'react';
import './OrganizadorPage.css';
import { useNavigate } from 'react-router-dom'

function OrganizadorPage() {
  const [organizador, setorganizador] = useState(null); // Estado para guardar el usuario logueado
  const navigate = useNavigate(); // Usar el hook useNavigate

  useEffect(() => {
    // Obtener la información del usuario logueado del localStorage
    const organizadorData = JSON.parse(localStorage.getItem('organizador'));
    if (organizadorData) {
      setorganizador(organizadorData); // Almacenar los datos del organizador en el estado
    }
  }, []);

  const handleEditProfile = () => {
    // Redirigir a la página de edición de organizador
    // Asegúrate de que tienes la ruta configurada correctamente para editar el perfil
    navigate('/modificar-organizador');
  };

  const handleLogout = () => {
    // Eliminar los datos del organizador y el token del localStorage
    localStorage.removeItem('organizador');
    localStorage.removeItem('Token');
    localStorage.removeItem('role'); // Opcional, si también deseas eliminar el rol
    window.location.reload(); // Recargar la página para actualizar el estado de autenticación

    // Redirigir al login o página de selección de login
    navigate("/seleccion-login");
  };

  if (!organizador) {
    return <div>Cargando...</div>; // Si aún no tenemos el organizador, mostramos un mensaje de carga
  }

  return (
    <div className="organizador-page">
      <h2>Perfil de Organizador</h2>

      {/* Mostrar los datos del usuario logueado */}
      <div className="organizador-info">
        <p><strong>Nickname:</strong> {organizador.nickname}</p>
        <p><strong>Email:</strong> {organizador.mail}</p>
        <p><strong>CUIT:</strong> {organizador.CUIT}</p>
        <p><strong>Descripción:</strong> {organizador.description}</p>
      </div>
      <div className="event-buttons">
        {/* Botón para editar el perfil */}
        <button onClick={handleEditProfile} className="edit-profile-button">
          Modificar Información
        </button>

        {/* Botón de Logout */}
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default OrganizadorPage;
