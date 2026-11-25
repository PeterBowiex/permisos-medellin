
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { registrar } from '../api';
import './Login.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (clave !== confirmarClave) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (clave.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    setCargando(true);

    try {
      await registrar({
        nombre,
        email,
        clave,
        telefono,
        direccion,
      });

      setMensaje('¡Tu cuenta fue creada exitosamente! Ya puedes iniciar sesión.');

      setNombre('');
      setEmail('');
      setClave('');
      setConfirmarClave('');
      setTelefono('');
      setDireccion('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al crear la cuenta.'
      );
    } finally {
      setCargando(false);
    }
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
          <span className="login-eyebrow">
            PORTAL DE SERVICIOS CIUDADANOS
          </span>

          <h1>Empieza a gestionar tus trámites fácilmente.</h1>

          <p>
            Crea tu cuenta en Permisos Medellín y accede a los
            servicios ciudadanos desde un solo lugar.
          </p>

          <div className="login-info-footer">
            <span className="login-info-line" />
            <span>MEDELLÍN · ANTIOQUIA · COLOMBIA</span>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-heading">
            <span className="login-card-label">NUEVO USUARIO</span>
            <h2>Crear una cuenta</h2>
            <p>Completa tus datos para registrarte.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                placeholder="Tu número de contacto"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                placeholder="Tu dirección de residencia"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="clave">Contraseña</label>
              <input
                id="clave"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="confirmarClave">
                Confirmar contraseña
              </label>
              <input
                id="confirmarClave"
                type="password"
                placeholder="Escribe nuevamente tu contraseña"
                value={confirmarClave}
                onChange={(e) => setConfirmarClave(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="login-message" role="alert">
                {error}
              </p>
            )}

            {mensaje && (
              <p className="login-message" role="status">
                {mensaje}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={cargando}
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
            </button>
          </form>

          <div className="login-register">
            ¿Ya tienes una cuenta?
            <Link to="/login"> Iniciar sesión</Link>
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

export default Registro;
