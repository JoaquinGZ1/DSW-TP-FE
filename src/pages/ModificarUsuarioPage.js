import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de importar axios

function ModificarUsuarioPage() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [DNI, setDNI] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los datos del usuario desde localStorage o alguna API
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setNickname(userData.nickname);
      setMail(userData.mail);
      setDNI(userData.DNI);  // Asegúrate de que 'DNI' esté disponible
      setDescription(userData.description);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Aquí realizamos la llamada a la API para actualizar los datos del usuario
      const response = await axios.put(`http://localhost:4000/api/usuarios/update/${user.id}`, {
        nickname,
        mail,
        DNI,
        description,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`, // Token en el header
          },
        }
      );
      // Si la actualización fue exitosa, actualizamos el localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Mostrar mensaje de éxito
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil');
    }
    localStorage.removeItem('Token');
    navigate("/login-usuario")
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="modificar-usuario-page">
      <h2>Modificar Información de Usuario</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>DNI</label>
          <input
            type="text"
            value={DNI}
            onChange={(e) => setDNI(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}

export default ModificarUsuarioPage;
