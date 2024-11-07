import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginOrganizador({ setIsAuthenticated }) {

  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      // Enviar los datos al backend para autenticar al organizador
      console.log('Enviando solicitud a backend...', { mail, password });

      const response = await axios.post('http://localhost:4000/api/organizadores/login', {
        mail,
        password,
      });
    console.log('Respuesta del backend:', response); // Verifica la respuesta del backend

      // Guardar el token y los datos del organizador en localStorage
      localStorage.setItem('role', 'organizador');
      localStorage.setItem('Token', response.data.token);
      localStorage.setItem('organizador', JSON.stringify(response.data.organizador));

      // Actualiza el estado de autenticación y redirige
      setIsAuthenticated(true); // <- Esto es clave para que App sepa que estamos autenticados
      setSuccess(`Login exitoso. Bienvenido, ${response.data.organizador.nickname}`);

      setTimeout(() => {
        navigate('/'); // Ajusta esta ruta si es necesario
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      // Captura el error y muestra más detalles
    console.error('Error en la solicitud:', error);
    console.error('Respuesta del error:', error.response);
    setError(error.response?.data.message || 'Error en el inicio de sesión');

    }
  };

  const handleRegisterRedirect = () => {
    navigate('/registerOrganizador');
  };

  return (
    <div>
      <h2>Iniciar Sesión - Organizador</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Ingresar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button onClick={handleRegisterRedirect}>¿No tienes cuenta? Registrate aquí</button>
    </div>
  );
}

export default LoginOrganizador;
