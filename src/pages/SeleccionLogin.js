import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SeleccionLogin.css'; // Asegúrate de importar el archivo CSS

function SeleccionLogin() {
  const navigate = useNavigate();

  const handleLoginUsuario = () => {
    navigate('/login-usuario');
  };

  const handleLoginOrganizador = () => {
    navigate('/login-organizador');
  };

  return (
    <div className="login-container">
      <h2 className="title">Seleccione el tipo de cuenta para iniciar sesión</h2>
      <div className="buttons-container">
        <button className="login-button usuario" onClick={handleLoginUsuario}>
          Login Usuario
        </button>
        <button className="login-button organizador" onClick={handleLoginOrganizador}>
          Login Organizador
        </button>
      </div>
    </div>
  );
}

export default SeleccionLogin;
