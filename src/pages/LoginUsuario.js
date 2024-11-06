import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginUsuario() {
  const [mail, setMail] = useState(''); // Solo necesitamos mail
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar el mail y la contraseña al backend
      const response = await axios.post('http://localhost:4000/api/usuarios/login', {
        mail,
        password,
      });

      localStorage.setItem('role', 'usuario'); // Guardar el rol
      localStorage.setItem('Token', response.data.token); // Guardar el token en localStorage
      localStorage.setItem('user', JSON.stringify(response.data.usuario)); // Guardar los datos del usuario en localStorage 
      setSuccess(`Login exitoso. Bienvenido, ${response.data.usuario.nickname}`);

      setTimeout(() => {
        navigate('/'); // Ajusta esta ruta si es necesario
      }, 2000); // Redirige después de 2 segundos
    } catch (error) {
      setError(error.response?.data.message || 'Error en el inicio de sesión');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirige a la página de registro
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

      <button onClick={handleRegisterRedirect}>Registrarse</button> {/* Botón para redirigir */}
    </div>
  );
}

export default LoginUsuario;
