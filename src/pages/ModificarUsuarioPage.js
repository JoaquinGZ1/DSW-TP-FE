import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ModificarUsuarioPage.css';
import config from '../config';

function ModificarUsuarioPage() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [DNI, setDNI] = useState('');
  const [description, setDescription] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
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
      const response = await axios.put(`${config.apiUrl}/api/usuarios/update/${user.id}`, {
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
      
      // Cerrar sesión: eliminar datos del localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      
      // Refrescar página y redirigir al login
      setTimeout(() => {
        window.location.reload();
        navigate('/login');
      }, 1000);

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil');
    }
  };

  const handleEliminarCuenta = async () => {
    if (confirmacion !== 'ELIMINAR') {
      alert('Debes escribir "ELIMINAR" para confirmar la eliminación de tu cuenta');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.post(
        `${config.apiUrl}/api/usuarios/${user.id}/delete-account`,
        { confirmacion },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        }
      );

      alert('Tu cuenta ha sido eliminada correctamente');
      
      // Cerrar sesión
      localStorage.removeItem('user');
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      
      // Redirigir al login
      navigate('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert(error.response?.data?.message || 'Hubo un error al eliminar la cuenta');
    }
  };

  if (!user) {
    return (
      <div className="modificar-usuario-page">
        <div className="modificar-usuario-form-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modificar-usuario-page">
      <div className="modificar-usuario-form-container">
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

      <div className="zona-peligro" style={{ marginTop: '40px', padding: '20px', border: '2px solid #dc3545', borderRadius: '8px' }}>
        <h3 style={{ color: '#dc3545' }}>Zona de Peligro</h3>
        <p>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.</p>
        
        {!mostrarEliminar ? (
          <button 
            type="button"
            onClick={() => setMostrarEliminar(true)}
            style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            ELIMINAR CUENTA
          </button>
        ) : (
          <div style={{ marginTop: '15px' }}>
            <p style={{ fontWeight: 'bold' }}>
              Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
            </p>
            <input
              type="text"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              placeholder="Escribe ELIMINAR"
              style={{ 
                padding: '8px', 
                marginRight: '10px', 
                border: '1px solid #dc3545',
                borderRadius: '4px'
              }}
            />
            <button 
              type="button"
              onClick={handleEliminarCuenta}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Confirmar eliminación
            </button>
            <button 
              type="button"
              onClick={() => {
                setMostrarEliminar(false);
                setConfirmacion('');
              }}
              style={{ 
                backgroundColor: '#6c757d', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default ModificarUsuarioPage;
