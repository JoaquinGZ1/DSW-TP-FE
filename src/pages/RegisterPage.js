import React, { useState } from 'react'; // Importa useState de React
import axios from 'axios'; // Importa axios para las solicitudes HTTP
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegar entre páginas

const RegisterPage = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario'); // 'usuario' o 'organizador'
  const [dni, setDni] = useState(''); // Para usuarios
  const [cuit, setCuit] = useState(''); // Para organizadores
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { nickname, email, password, role, description, photo };
      
      // Asegúrate de incluir DNI o CUIT según el rol
      if (role === 'usuario') {
        data.DNI = dni; // Para usuario
      } else if (role === 'organizador') {
        data.CUIT = cuit; // Para organizador
      }

      const response = await axios.post('http://localhost:4000/api/auth/register', data);
      if (response.data.success) {
        setError('');
        navigate('/login'); // Redirige a login después del registro exitoso
      }
    } catch (err) {
      setError('Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
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
        {role === 'usuario' && (
          <input
            type="number"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        )}
        {role === 'organizador' && (
          <input
            type="number"
            placeholder="CUIT"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
          />
        )}
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="usuario">Usuario</option>
          <option value="organizador">Organizador</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;
