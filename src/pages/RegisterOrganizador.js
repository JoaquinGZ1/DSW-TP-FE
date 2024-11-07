import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        navigate('/login-organizador'); // Ajusta esta ruta si es necesario
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      setError(error.response?.data.message || 'Error en el registro');
    }
  };

  return (
    <div>
      <h2>Registro de Organizador</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CUIT:</label>
          <input
            type="text"
            value={CUIT}
            onChange={(e) => setCUIT(e.target.value)}
            placeholder="CUIT"
          />
        </div>
        <div>
          <label>Nickname:</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="Correo Electrónico"
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default RegisterOrganizador;
