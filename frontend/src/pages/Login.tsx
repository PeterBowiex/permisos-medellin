
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje('El formulario está listo. Próximamente conectaremos el inicio de sesión con el servidor.');
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/" className="login-brand">
          <div className="login-brand-symbol">PM</div>
          <div className="login-brand-text">
            <strong>PERMISOS</strong>
            <span>MEDELLÍN</span>
            <small>GESTIÓN DE TRÁMITES CIUDADANOS</small>
          </div>
        </Link>

        <Link to="/" className="back-home">
  ← Volver al inicio
</Link>
      </header>

      <main className="login-main">
        <section className="login-info">
          <span className="login-eyebrow">PORTAL DE SERVICIOS CIUDADANOS</span>
          <h1>Gestiona tus trámites desde un solo lugar.</h1>
          <p>
            Accede a la plataforma para solicitar permisos,
            consultar el estado de tus solicitudes y hacer
            seguimiento a tus procesos.
          </p>

          <div className="login-info-footer">
            <span className="login-info-line" />
            <span>MEDELLÍN · ANTIOQUIA · COLOMBIA</span>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-heading">
            <span className="login-card-label">BIENVENIDO</span>
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="clave">Contraseña</label>
              <input
                id="clave"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>

            {mensaje && (
              <p className="login-message" role="status">
                {mensaje}
              </p>
            )}

            <button type="submit" className="login-submit">
              Iniciar sesión <span>→</span>
            </button>
          </form>

          <div className="login-register">
            ¿Todavía no tienes una cuenta?
            <Link to="/registro"> Crear una cuenta</Link>
          </div>

          <div className="login-security">
            <span>♧</span>
            Tus datos son tratados de manera segura.
          </div>
        </section>
      </main>

      <footer className="login-footer">
        <span>PERMISOS MEDELLÍN</span>
        <span>Proyecto académico · Medellín, Colombia</span>
      </footer>
    </div>
  );
}

export default Login;
