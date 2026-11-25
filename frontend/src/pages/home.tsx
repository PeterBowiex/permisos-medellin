
import { Link } from 'react-router-dom';
import "../App.css";

function Home() {
  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-content">
          <span>Distrito Especial de Ciencia, Tecnología e Innovación</span>
          <span>Portal de atención ciudadana</span>
        </div>
      </div>

      <header className="main-header">
        <div className="container header-content">
          <Link to="/" className="brand">
            <div className="brand-symbol">
              <svg viewBox="0 0 60 60" fill="none">
                <path d="M30 4L53 17V43L30 56L7 43V17L30 4Z"
                  stroke="currentColor" strokeWidth="3" />
                <path d="M19 39V21L30 34L41 21V39"
                  stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="brand-text">
              <strong>PERMISOS</strong>
              <span>MEDELLÍN</span>
              <small>GESTIÓN DE TRÁMITES CIUDADANOS</small>
            </div>
          </Link>

          <nav className="main-nav">
            <Link to="/" className="active">Inicio</Link>
            <a href="#servicios">Trámites y servicios</a>
            <a href="#consulta">Consultar solicitud</a>
            <a href="#ayuda">Ayuda</a>
          </nav>

          <Link to="/login" className="login-button">
            Iniciar sesión <span>→</span>
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="eyebrow">
                PORTAL DE SERVICIOS CIUDADANOS
              </span>
              <h1>Tus trámites,<br />más cerca de ti.</h1>
              <p>
                Gestiona tus permisos y solicitudes de manera
                fácil, segura y desde un solo lugar.
                Estamos aquí para facilitar tus trámites.
              </p>
              <div className="hero-actions">
                <Link to="/registro" className="primary-button">
                  Solicitar un permiso <span>→</span>
                </Link>
                <a href="#consulta" className="secondary-button">
                  Consultar solicitud
                </a>
              </div>
            </div>

            <aside className="hero-notice">
              <div className="notice-line" />
              <span>ATENCIÓN CIUDADANA</span>
              <strong>Un portal pensado para ti.</strong>
              <p>
                Accede a tus trámites y consulta su estado
                de forma sencilla y oportuna.
              </p>
            </aside>
          </div>

          <div className="hero-bottom">
            <div className="container">
              <span>MEDELLÍN · ANTIOQUIA · COLOMBIA</span>
            </div>
          </div>
        </section>

        <section className="services-section" id="servicios">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">NUESTROS SERVICIOS</span>
                <h2>¿Qué necesitas hacer hoy?</h2>
                <p>
                  Encuentra aquí las opciones para gestionar
                  tus trámites ciudadanos.
                </p>
              </div>
              <a href="#consulta" className="text-link">
                Conoce más →
              </a>
            </div>

            <div className="services-grid">
              <article className="service-card">
                <span className="service-number">01</span>
                <div className="service-icon">＋</div>
                <h3>Solicitar un permiso</h3>
                <p>
                  Inicia una nueva solicitud y realiza tus
                  trámites de manera sencilla.
                </p>
                <Link to="/registro">Comenzar solicitud <span>→</span></Link>
              </article>

              <article className="service-card">
                <span className="service-number">02</span>
                <div className="service-icon">⌕</div>
                <h3>Consultar solicitud</h3>
                <p>
                  Consulta el estado y revisa el avance
                  de tus solicitudes.
                </p>
                <a href="#consulta">Consultar ahora <span>→</span></a>
              </article>

              <article className="service-card">
                <span className="service-number">03</span>
                <div className="service-icon">▤</div>
                <h3>Mis trámites</h3>
                <p>
                  Accede a tu cuenta para consultar
                  y gestionar tus trámites.
                </p>
                <Link to="/login">Ingresar a mi cuenta <span>→</span></Link>
              </article>
            </div>
          </div>
        </section>

        <section className="consult-section" id="consulta">
          <div className="container consult-content">
            <div>
              <span className="section-label">SEGUIMIENTO</span>
              <h2>¿Ya tienes una solicitud?</h2>
              <p>
                Ingresa a tu cuenta para consultar el estado
                de tus solicitudes y conocer sus novedades.
              </p>
            </div>
            <Link to="/login" className="primary-button">
              Consultar mi solicitud <span>→</span>
            </Link>
          </div>
        </section>

        <section className="access-section" id="ayuda">
          <div className="container access-content">
            <div>
              <span className="section-label">TU ESPACIO CIUDADANO</span>
              <h2>Gestiona tus trámites en línea.</h2>
              <p>
                Crea tu cuenta o inicia sesión para acceder
                a los servicios del portal.
              </p>
            </div>
            <div className="access-actions">
              <Link to="/registro" className="primary-button">
                Crear una cuenta <span>→</span>
              </Link>
              <Link to="/login" className="outline-button">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <strong>PERMISOS MEDELLÍN</strong>
            <span>Portal de atención ciudadana</span>
          </div>
          <p>Proyecto académico · Medellín, Colombia</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
