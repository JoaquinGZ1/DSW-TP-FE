import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginUsuario({ setIsAuthenticated }) { // Recibe setIsAuthenticated como prop
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar el mail y la contraseña al backend
      const response = await axios.post('http://localhost:4000/api/usuarios/login', {
        mail,
        password,
      });

      // Guardar el token y datos en localStorage
      localStorage.setItem('role', 'usuario');
      localStorage.setItem('Token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));  
      console.log('Usuario al guardar:', response.data.usuario);

      // Actualiza el estado de autenticación y redirige
      setIsAuthenticated(true); // <- Esto es clave para que App sepa que estamos autenticados
      setSuccess(`Login exitoso. Bienvenido, ${response.data.usuario.nickname}`);
      setTimeout(() => {
        navigate('/'); // Ajusta esta ruta si es necesario
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      setError(error.response?.data.message || 'Error en el inicio de sesión');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/registerUsuario');
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
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

      <button onClick={handleRegisterRedirect}>Registrarse</button>
    </div>
  );
}

export default LoginUsuario;
