import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizadorPage.css';

function OrganizadorPage() {
  const [organizador, setOrganizador] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const organizadorData = JSON.parse(localStorage.getItem('organizador'));
    if (organizadorData) {
      setOrganizador(organizadorData);
    }
  }, []);

  const handleEditProfile = () => {
    navigate('/modificar-organizador');
  };

  const handleLogout = () => {
    localStorage.removeItem('organizador');
    localStorage.removeItem('Token');
    localStorage.removeItem('role');
    window.location.reload();
    navigate("/login");
  };

  if (!organizador) {
    return (
      <div className="profile-organizador-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-organizador-container">
      <div className="profile-organizador-card">
        {/* Header del perfil */}
        <div className="profile-organizador-header">
          <div className="profile-organizador-avatar">
            <span className="avatar-organizador-icon">🏢</span>
          </div>
          <div className="profile-organizador-title">
            <h1 className="welcome-organizador-text">
              <span className="rocket-emoji">🚀</span>
              ¡Hola, {organizador.nickname}!
            </h1>
            <p className="profile-organizador-subtitle">Perfil de Organizador</p>
          </div>
        </div>

        {/* Información del organizador */}
        <div className="profile-organizador-info">
          <h3 className="info-organizador-section-title">
            <span className="section-organizador-icon">📊</span>
            Información de la Organización
          </h3>
          
          <div className="info-organizador-grid">
            <div className="info-organizador-item">
              <div className="info-organizador-label">
                <span className="label-organizador-icon">✨</span>
                Nombre de la Organización
              </div>
              <div className="info-organizador-value">{organizador.nickname || 'No especificado'}</div>
            </div>

            <div className="info-organizador-item">
              <div className="info-organizador-label">
                <span className="label-organizador-icon">📧</span>
                Correo Electrónico
              </div>
              <div className="info-organizador-value">{organizador.mail || 'No especificado'}</div>
            </div>

            <div className="info-organizador-item">
              <div className="info-organizador-label">
                <span className="label-organizador-icon">🏛️</span>
                CUIT
              </div>
              <div className="info-organizador-value">{organizador.CUIT || 'No especificado'}</div>
            </div>

            <div className="info-organizador-item full-width-organizador">
              <div className="info-organizador-label">
                <span className="label-organizador-icon">📝</span>
                Descripción de la Organización
              </div>
              <div className="info-organizador-value description-organizador">
                {organizador.description || 'Sin descripción agregada'}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del perfil */}
        <div className="profile-organizador-actions">
          <button onClick={handleEditProfile} className="action-organizador-button primary-organizador">
            <span className="button-organizador-icon">✏️</span>
            Modificar Información
          </button>

          <button onClick={handleLogout} className="action-organizador-button secondary-organizador">
            <span className="button-organizador-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>

        {/* Footer decorativo */}
        <div className="profile-organizador-footer">
          <p className="footer-organizador-text">¡Crea eventos increíbles y conecta con tu audiencia! 🎭</p>
        </div>
      </div>
    </div>
  );
}

export default OrganizadorPage;
