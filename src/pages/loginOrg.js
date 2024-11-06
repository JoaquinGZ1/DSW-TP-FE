import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginOrg = () => {
  const [CUIT, setCUIT] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        'http://localhost:4000/organizador/login',
        { CUIT, password }
      );

      // Si la respuesta es exitosa, redirigir al dashboard u otra página
      if (response.data.success) {
        // Guardar el token o los datos necesarios en localStorage o context
        localStorage.setItem('organizador_token', response.data.token); 
        navigate('/dashboard');  // Redirige a la página de dashboard o la página deseada
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión como Organizador</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="CUIT">CUIT</label>
          <input
            type="text"
            id="CUIT"
            name="CUIT"
            value={CUIT}
            onChange={(e) => setCUIT(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginOrg;
