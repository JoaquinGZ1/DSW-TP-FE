import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ModificarOrganizadorPage.css';

function ModificarOrganizadorPage() {
  const [organizador, setOrganizador] = useState(null);
  const [nickname, setNickname] = useState('');
  const [mail, setMail] = useState('');
  const [CUIT, setCUIT] = useState('');
  const [description, setDescription] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los datos del organizador desde localStorage
    const organizadorData = JSON.parse(localStorage.getItem('organizador'));
    if (organizadorData) {
      setOrganizador(organizadorData);
      setNickname(organizadorData.nickname);
      setMail(organizadorData.mail);
      setCUIT(organizadorData.CUIT.toString()); // Convertir a string para el campo de texto
      setDescription(organizadorData.description);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que CUIT solo contenga números
    if (!/^\d+$/.test(CUIT)) {
      alert('El CUIT debe ser un número válido');
      return;
    }

    try {
      // Enviar CUIT como string, no como entero (según la entidad del backend)
      const response = await axios.put(`http://localhost:4000/api/organizadores/update/${organizador.id}`, {
        nickname,
        mail,
        CUIT: CUIT, // Mantener como string
        description,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`, // Token en el header
          },
        });

      // Actualizar el localStorage con los datos actualizados
      localStorage.setItem('organizador', JSON.stringify(response.data));

      alert('Perfil actualizado correctamente');
      
      // Cerrar sesión: eliminar datos del localStorage
      localStorage.removeItem('organizador');
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      
      // Refrescar página y redirigir al login
      setTimeout(() => {
        window.location.reload();
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('Error completo al actualizar el perfil:', error);
      
      if (error.response) {
        // El servidor respondió con un código de estado que indica error
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        alert(`Error al actualizar el perfil: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        console.error('Error request:', error.request);
        alert('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Algo pasó al configurar la petición
        console.error('Error message:', error.message);
        alert('Error al configurar la petición: ' + error.message);
      }
    }
  };

  const handleEliminarCuenta = async () => {
    if (confirmacion !== 'ELIMINAR') {
      alert('Debes escribir "ELIMINAR" para confirmar la eliminación de tu cuenta');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta de organizador? Esta acción eliminará todos tus eventos y las entradas asociadas. Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/organizadores/${organizador.id}/delete-account`,
        { confirmacion },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        }
      );

      alert(`Cuenta eliminada correctamente. Se eliminaron ${response.data.data.eventosEliminados} eventos y ${response.data.data.entradasEliminadas} entradas.`);
      
      // Cerrar sesión
      localStorage.removeItem('organizador');
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      
      // Redirigir al login
      navigate('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert(error.response?.data?.message || 'Hubo un error al eliminar la cuenta');
    }
  };

  if (!organizador) {
    return (
      <div className="modificar-organizador-page">
        <div className="modificar-organizador-form-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modificar-organizador-page">
      <div className="modificar-organizador-form-container">
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

      <div className="zona-peligro" style={{ marginTop: '40px', padding: '20px', border: '2px solid #dc3545', borderRadius: '8px' }}>
        <h3 style={{ color: '#dc3545' }}>Zona de Peligro</h3>
        <p>Una vez que elimines tu cuenta de organizador, todos tus eventos y las entradas asociadas serán eliminadas permanentemente. No hay vuelta atrás. Por favor, está seguro.</p>
        
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

export default ModificarOrganizadorPage;
