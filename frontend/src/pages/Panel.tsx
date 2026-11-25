
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Panel.css';

function Panel() {
  const { sesion, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate('/login');
  }

  if (!sesion) {
    return null;
  }

  const { usuario } = sesion;

  return (
    <div className="panel-page">
      <header className="panel-header">
        <Link to="/" className="panel-brand">
          <div className="panel-brand-symbol">PM</div>
          <div>
            <strong>PERMISOS</strong>
            <span>MEDELLÍN</span>
          </div>
        </Link>

        <button
          type="button"
          className="panel-logout"
          onClick={cerrarSesion}
        >
          Cerrar sesión →
        </button>
      </header>

      <main className="panel-main">
        <section className="panel-welcome">
          <span className="panel-eyebrow">
            ESPACIO CIUDADANO
          </span>

          <h1>¡Bienvenido, {usuario.nombre}!</h1>

          <p>
            Desde aquí puedes gestionar tus permisos,
            consultar tus solicitudes y mantenerte informado.
          </p>
        </section>

        <section className="panel-profile">
          <div className="panel-avatar">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>

          <div>
            <span className="panel-label">TU CUENTA</span>
            <h2>{usuario.nombre}</h2>
            <p>{usuario.email}</p>
            <span className="panel-role">{usuario.rol}</span>
          </div>
        </section>

        <section className="panel-section">
          <span className="panel-eyebrow">GESTIÓN DE TRÁMITES</span>
          <h2>¿Qué deseas hacer hoy?</h2>

          <div className="panel-grid">
            <Link to="/nueva-solicitud" className="panel-card">
              <span className="panel-card-number">01</span>
              <div className="panel-card-icon">＋</div>
              <h3>Nueva solicitud</h3>
              <p>
                Inicia el proceso para solicitar un permiso.
              </p>
              <span className="panel-coming">
                Crear solicitud →
              </span>
            </Link>

            <Link to="/mis-tramites" className="panel-card">
              <span className="panel-card-number">02</span>
              <div className="panel-card-icon">⌕</div>
              <h3>Mis trámites</h3>
              <p>
                Consulta tus solicitudes y revisa su estado.
              </p>
              <span className="panel-coming">
                Consultar trámites →
              </span>
            </Link>

            <Link to="/mi-perfil" className="panel-card">
              <span className="panel-card-number">03</span>
              <div className="panel-card-icon">♙</div>
              <h3>Mi perfil</h3>
              <p>
                Revisa la información de tu cuenta ciudadana.
              </p>
              <span className="panel-coming">
                Ver mi perfil →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="panel-footer">
        <strong>PERMISOS MEDELLÍN</strong>
        <span>Proyecto académico · Medellín, Colombia</span>
      </footer>
    </div>
  );
}

export default Panel;
