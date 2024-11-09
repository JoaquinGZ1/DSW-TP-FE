import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de importar axios

function ModificarOrganizadorPage() {
  const [organizador, setOrganizador] = useState(null);
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [CUIT, setCUIT] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Obtener los datos del organizador desde localStorage o alguna API
    const organizadorData = JSON.parse(localStorage.getItem('organizador'));
    if (organizadorData) {
      setOrganizador(organizadorData);
      setNickname(organizadorData.nickname);
      setMail(organizadorData.mail);
      setCUIT(organizadorData.CUIT);  // Asegúrate de que 'CUIT' esté disponible
      setDescription(organizadorData.description);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(CUIT) || CUIT.trim() === '') {
    alert('El CUIT debe ser un número válido');
    return;
  }

    try {

      

      // Aquí realizamos la llamada a la API para actualizar los datos del organizador
      const response = await axios.put(`http://localhost:4000/api/organizadores/update/${CUIT}`, {
        nickname,
        mail,
        CUIT,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`, // Token en el header
        },
      });

      // Si la actualización fue exitosa, actualizamos el localStorage
      localStorage.setItem('organizador', JSON.stringify(response.data));

      // Mostrar mensaje de éxito
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil');
    }
  };

  if (!organizador) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="modificar-organizador-page">
      <h2>Modificar Información de Organizador</h2>

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
          <label>CUIT</label>
          <input
            type="text"
            value={CUIT}
            onChange={(e) => setCUIT(e.target.value)}
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

export default ModificarOrganizadorPage;
