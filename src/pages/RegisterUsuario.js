import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterUsuario.css';

function RegisterUsuario() {
  const [formData, setFormData] = useState({
    nickname: '',
    mail: '',
    password: '',
    DNI: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Validaciones del lado del cliente
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'El nickname es requerido';
    }

    if (!formData.mail) {
      newErrors.mail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
    }

    if (!formData.DNI) {
      newErrors.DNI = 'El DNI es requerido';
    } else if (isNaN(formData.DNI)) {
      newErrors.DNI = 'El DNI debe ser un número';
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

    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/register', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Importante para manejar cookies
        }
      );

      setSuccess('Registro exitoso. Redirigiendo al login...');
      
      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/login-usuario');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Manejar errores de validación del servidor
        const serverValidationErrors = {};
        error.response.data.errors.forEach(err => {
          serverValidationErrors[err.param] = err.msg;
        });
        setErrors(serverValidationErrors);
      } else {
        setServerError('Error en el registro. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={errors.nickname ? 'error' : ''}
          />
          {errors.nickname && <span className="error-message">{errors.nickname}</span>}
        </div>

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

        <div className="form-group">
          <label htmlFor="DNI">DNI:</label>
          <input
            type="text"
            id="DNI"
            name="DNI"
            value={formData.DNI}
            onChange={handleChange}
            className={errors.DNI ? 'error' : ''}
          />
          {errors.DNI && <span className="error-message">{errors.DNI}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-button">Registrarse</button>
      </form>

      {serverError && <div className="error-message server-error">{serverError}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default RegisterUsuario;
