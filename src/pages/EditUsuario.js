import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditUsuario.css';

function EditUsuario() {
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

  useEffect(() => {
    // Cargar los datos actuales del usuario
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setFormData({
        nickname: userData.nickname || '',
        mail: userData.mail || '',
        password: '', // No cargar la contraseña por seguridad
        DNI: userData.DNI || '',
        description: userData.description || ''
      });
    } else {
      // Si no hay datos del usuario, redirigir al login
      navigate('/login-usuario');
    }
  }, [navigate]);

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

    // Solo validar la contraseña si se está intentando cambiar
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos un número';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
      }
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

    if (!validateForm()) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id) {
        setServerError('No se pudo identificar al usuario');
        return;
      }

      // Solo enviar los campos que han sido modificados
      const updateData = {};
      if (formData.nickname !== userData.nickname) updateData.nickname = formData.nickname;
      if (formData.mail !== userData.mail) updateData.mail = formData.mail;
      if (formData.password) updateData.password = formData.password;
      if (formData.DNI !== userData.DNI) updateData.DNI = formData.DNI;
      if (formData.description !== userData.description) updateData.description = formData.description;

      const response = await axios.put(
        `http://localhost:4000/api/usuarios/update/${userData.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Importante para enviar las cookies
        }
      );

      // Actualizar los datos en localStorage
      localStorage.setItem('user', JSON.stringify(response.data.usuario));

      setSuccess('Perfil actualizado exitosamente');
      
      setTimeout(() => {
        navigate('/usuario');
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar:', error);
      
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Error al actualizar el perfil. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="edit-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="edit-form">
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
          <label htmlFor="password">Nueva Contraseña (dejar en blanco para mantener la actual):</label>
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

        <div className="button-group">
          <button type="submit" className="submit-button">
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate('/usuario')}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </form>

      {serverError && <div className="error-message server-error">{serverError}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default EditUsuario;
