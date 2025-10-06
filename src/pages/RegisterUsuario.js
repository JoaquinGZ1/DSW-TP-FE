import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterUsuario.css';

function RegisterUsuario() {
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [DNI, setDNI] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Enviamos los datos del formulario al backend
      const response = await axios.post('http://localhost:4000/api/usuarios/register', {
        nickname,
        mail,
        password,
        DNI,
        description,
      });

      // Si el registro es exitoso, mostramos un mensaje y redirigimos al login
      setSuccess(`Registro exitoso. Bienvenido, ${response.data.data.nickname}`);
      
      // Redirigir a la página de login después de 2 segundos
      setTimeout(() => {
        navigate('/login'); // Redirige al login unificado
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      // Captura el error del backend (por ejemplo, DNI ya registrado, mail ya registrado, etc.)
      setError(error.response?.data.message || 'Error en el registro');
    }
  };

  return (
    <div className="register-usuario-container">
      <div className="register-card">
        <h2 className="register-title">
          <span className="register-icon">👤</span>
          Registro de Usuario
        </h2>
        
        <form onSubmit={handleSubmit} className="register-form">
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
              placeholder="Tu nombre de usuario único"
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
              placeholder="ejemplo@correo.com"
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
              <span className="label-icon">🆔</span>
              DNI:
            </label>
            <input
              type="number"
              value={DNI}
              onChange={(e) => setDNI(e.target.value)}
              required
              className="form-input"
              placeholder="12345678"
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
              placeholder="Cuéntanos un poco sobre ti..."
              rows="3"
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
            Registrarse como Usuario
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

export default RegisterUsuario;
