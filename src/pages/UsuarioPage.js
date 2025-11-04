import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsuarioPage.css';

function UsuarioPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleEditProfile = () => {
    navigate('/modificar-Usuario');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('Token');
    localStorage.removeItem('role');
    window.location.reload();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-title">
            <h1 className="welcome-text">
              
              ¡Hola, {user.nickname}!
            </h1>
            <p className="profile-subtitle">Perfil de Usuario</p>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="profile-info">
          <h3 className="info-section-title">
            <span className="section-icon">📋</span>
            Información Personal
          </h3>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                
                Nickname
              </div>
              <div className="info-value">{user.nickname || 'No especificado'}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                
                Correo Electrónico
              </div>
              <div className="info-value">{user.mail || 'No especificado'}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                
                DNI
              </div>
              <div className="info-value">{user.DNI || 'No especificado'}</div>
            </div>

            <div className="info-item full-width">
              <div className="info-label">
                
                Descripción
              </div>
              <div className="info-value description">
                {user.description || 'Sin descripción agregada'}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del perfil */}
        <div className="profile-actions">
          <button onClick={handleEditProfile} className="action-button primary">
            <span className="button-icon">✏️</span>
            Modificar Información
          </button>

          <button onClick={handleLogout} className="action-button secondary">
            <span className="button-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>

        
      </div>
    </div>
  );
}

export default UsuarioPage;
