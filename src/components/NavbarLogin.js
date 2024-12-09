import { Link } from 'react-router-dom';

function NavbarLogin() {
  return (
    <nav className="navbar">
      {/* Logo en la esquina superior izquierda */}
      <div className="navbar-logo">
        <Link to="/"> {/* Cambiar <a href="/"> a <Link to="/"> */}
          <img src="/WEVENT-LOGO.png" alt="Logo" className="logo" style={{ width: '128px', height: '128px' }} />
        </Link>
      </div>
    </nav>
  );
}


export default NavbarLogin;
