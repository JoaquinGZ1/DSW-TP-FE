import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginUnificado.css';
import config from '../config';

function LoginUnificado({ setIsAuthenticated }) {
  const [userType, setUserType] = useState('usuario'); // 'usuario' o 'organizador'
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      let endpoint;
      
      if (userType === 'usuario') {
        endpoint = `${config.apiUrl}/api/usuarios/login`;
        response = await axios.post(endpoint, { mail, password });
        
        // Guardar datos del usuario
        localStorage.setItem('id', response.data.usuario.id);
        localStorage.setItem('role', 'usuario');
        localStorage.setItem('Token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        setSuccess(`¡Bienvenido, ${response.data.usuario.nickname}!`);
        
      } else {
        endpoint = `${config.apiUrl}/api/organizadores/login`;
        response = await axios.post(endpoint, { mail, password });
        
        // Guardar datos del organizador
        localStorage.setItem('role', 'organizador');
        localStorage.setItem('Token', response.data.token);
        localStorage.setItem('organizador', JSON.stringify(response.data.organizador));
        
        setSuccess(`¡Bienvenido, ${response.data.organizador.nickname}!`);
      }

      // Actualizar el estado de autenticación
      setIsAuthenticated(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError(error.response?.data.message || 'Error en el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    if (userType === 'usuario') {
      navigate('/registerUsuario');
    } else {
      navigate('/registerOrganizador');
    }
  };

  return (
    <div className="login-unificado-container">
      <div className="login-card">
        <h2 className="login-title">
          <span className="login-icon">🔐</span>
          Iniciar Sesión
        </h2>
        
        {/* Selector de tipo de usuario */}
        <div className="user-type-selector">
          <div className="toggle-container">
            <button
              type="button"
              className={`toggle-button ${userType === 'usuario' ? 'active' : ''}`}
              onClick={() => setUserType('usuario')}
            >
              <span className="toggle-icon">👤</span>
              Usuario
            </button>
            <button
              type="button"
              className={`toggle-button ${userType === 'organizador' ? 'active' : ''}`}
              onClick={() => setUserType('organizador')}
            >
              <span className="toggle-icon">🏢</span>
              Organizador
            </button>
          </div>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="login-form">
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

          {/* Botón de submit */}
          <button 
            type="submit" 
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Iniciar Sesión
              </>
            )}
          </button>

          {/* Botón de registro */}
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="register-button"
          >
            <span className="button-icon">📝</span>
            ¿No tienes cuenta? Regístrate como {userType === 'usuario' ? 'Usuario' : 'Organizador'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginUnificado;
