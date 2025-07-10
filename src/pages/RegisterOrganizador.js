import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterOrganizador.css';

function RegisterOrganizador() {
  const [CUIT, setCUIT] = useState('');
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = {
      CUIT,
      nickname,
      mail,
      password,
      description
    };

    try {
      // Enviar los datos del formulario al backend
      const response = await axios.post('http://localhost:4000/api/organizadores/register', formData);

      // Si el registro es exitoso, mostramos un mensaje y redirigimos al login
      setSuccess(`Registro exitoso. Bienvenido, ${response.data.data.nickname}`);
      
      // Redirigir a la página de login después de 2 segundos
      setTimeout(() => {
        navigate('/login'); // Redirige al login unificado
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      setError(error.response?.data.message || 'Error en el registro');
    }
  };

  return (
    <div className="register-organizador-container">
      <div className="register-card">
        <h2 className="register-title">
          <span className="register-icon">🏢</span>
          Registro de Organizador
        </h2>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏛️</span>
              CUIT:
            </label>
            <input
              type="text"
              value={CUIT}
              onChange={(e) => setCUIT(e.target.value)}
              required
              className="form-input"
              placeholder="20-12345678-9"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">✨</span>
              Nickname:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="form-input"
              placeholder="Nombre de tu organización"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📧</span>
              Correo Electrónico:
            </label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              className="form-input"
              placeholder="contacto@empresa.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              Descripción:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Describe tu organización y los tipos de eventos que organizas..."
              rows="4"
            />
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="message error-message">
              <span className="message-icon">❌</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              <span className="message-icon">✅</span>
              {success}
            </div>
          )}

          <button type="submit" className="submit-button">
            <span className="button-icon">🚀</span>
            Registrarse como Organizador
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="back-button"
          >
            <span className="button-icon">🔙</span>
            ¿Ya tienes cuenta? Inicia Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterOrganizador;
