// src/pages/login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario'); // 'usuario' o 'organizador'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password, role });
      if (response.data.success) {
        // Aquí se puede guardar el token en el localStorage o el contexto
        setError('');
        navigate(role === 'organizador' ? '/eventos/crear' : '/'); // Redirige según el rol
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirige a la página de registro
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="usuario">Usuario</option>
          <option value="organizador">Organizador</option>
        </select>
        <button type="submit">Iniciar sesión</button>
      </form>
      {error && <p>{error}</p>}

      <button onClick={handleRegisterRedirect}>
        ¿No tienes una cuenta? Regístrate
      </button>
    </div>
  );
};

export default Login;
