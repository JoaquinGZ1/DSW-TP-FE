import React, { useState, useEffect } from 'react';
import './UsuarioPage.css';
import {  useNavigate } from 'react-router-dom'

function UsuarioPage() {
  const [user, setUser] = useState(null); // Estado para guardar el usuario logueado
  const navigate = useNavigate(); // Usar el hook useNavigate

  useEffect(() => {
    // Obtener la información del usuario logueado del localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData); // Almacenar los datos del usuario en el estado
    }
  }, []);

  const handleEditProfile = () => {
    // Redirigir a la página de edición de usuario
    // Asegúrate de que tienes la ruta configurada correctamente para editar el perfil
    navigate('/modificar-Usuario');
  };

  const handleLogout = () => {
    // Eliminar los datos del usuario y el token del localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('Token');
    localStorage.removeItem('role'); // Opcional, si también deseas eliminar el rol
    window.location.reload() // recargar la página para actualizar el estado de autenticación
    
    // Redirigir al login o página de selección de login
    navigate("/seleccion-login");
  };

  if (!user) {
    return <div>Cargando...</div>; // Si aún no tenemos el usuario, mostramos un mensaje de carga
  }

  return (
    <div className="usuario-page">
      <h2>Perfil de Usuario</h2>

      {/* Mostrar los datos del usuario logueado */}
      <div className="user-info">
        <p><strong>Nickname:</strong> {user.nickname}</p>
        <p><strong>Email:</strong> {user.mail}</p>
        <p><strong>DNI:</strong> {user.DNI}</p>
        <p><strong>Descripción:</strong> {user.description}</p>
      </div>

      {/* Botón para editar el perfil */}
      <button onClick={handleEditProfile} className="edit-profile-button">
        Modificar Información
      </button>

      {/* Botón de Logout */}
      <button onClick={handleLogout} className="logout-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default UsuarioPage;
