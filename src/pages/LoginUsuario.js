import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginUsuario.css';

function LoginUsuario({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    mail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.mail) {
      newErrors.mail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/usuarios/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Importante para manejar cookies
        }
      );

      // Solo guardamos la información del usuario
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      localStorage.setItem('role', 'usuario');

      setIsAuthenticated(true);
      setSuccess('Login exitoso. Redirigiendo...');
      
      setTimeout(() => {
        navigate('/usuario');
      }, 1500);
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response?.status === 401) {
        setServerError('Credenciales inválidas');
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Error en el inicio de sesión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="mail">Correo Electrónico:</label>
          <input
            type="email"
            id="mail"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            className={errors.mail ? 'error' : ''}
          />
          {errors.mail && <span className="error-message">{errors.mail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-button">
          Iniciar Sesión
        </button>

        <button
          type="button"
          onClick={() => navigate('/RegisterUsuario')}
          className="register-button"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>

      {serverError && <div className="error-message server-error">{serverError}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default LoginUsuario;
