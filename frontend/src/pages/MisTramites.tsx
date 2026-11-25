import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerMisSolicitudes, type SolicitudResumen } from '../api';
import { useAuth } from '../context/AuthContext';
import './MisTramites.css';

function MisTramites() {
  const { sesion } = useAuth();

  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarSolicitudes() {
      if (!sesion) return;

      try {
        setCargando(true);
        setError('');

        const datos = await obtenerMisSolicitudes(sesion.auth);
        setSolicitudes(datos);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al consultar tus trámites.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarSolicitudes();
  }, [sesion]);

  function formatearFecha(fecha: string) {
    if (!fecha) return 'Fecha no disponible';

    const fechaValida = new Date(fecha);

    if (Number.isNaN(fechaValida.getTime())) {
      return fecha;
    }

    return fechaValida.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function obtenerEstado(estado: string) {
    const estados: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_REVISION: 'En revisión',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada',
      REQUIERE_CORRECCION: 'Requiere corrección',
    };

    return estados[estado] || estado.replaceAll('_', ' ');
  }

  function claseEstado(estado: string) {
    const clases: Record<string, string> = {
      PENDIENTE: 'estado-pendiente',
      EN_REVISION: 'estado-revision',
      APROBADA: 'estado-aprobada',
      RECHAZADA: 'estado-rechazada',
      REQUIERE_CORRECCION: 'estado-correccion',
    };

    return clases[estado] || 'estado-pendiente';
  }

  return (
    <div className="tramites-page">
      <header className="tramites-header">
        <Link to="/" className="tramites-brand">
          <div className="tramites-brand-symbol">PM</div>
          <div>
            <strong>PERMISOS</strong>
            <span>MEDELLÍN</span>
          </div>
        </Link>

        <Link to="/panel" className="tramites-back">
          ← Volver al panel
        </Link>
      </header>

      <main className="tramites-main">
        <section className="tramites-intro">
          <span className="tramites-eyebrow">ESPACIO CIUDADANO</span>
          <h1>Mis trámites</h1>
          <p>
            Consulta las solicitudes que has registrado y revisa el estado
            de cada uno de tus procesos.
          </p>
        </section>

        <section className="tramites-content">
          <div className="tramites-content-heading">
            <div>
              <h2>Solicitudes registradas</h2>
              <p>
                {solicitudes.length}{' '}
                {solicitudes.length === 1
                  ? 'solicitud encontrada'
                  : 'solicitudes encontradas'}
              </p>
            </div>

            <Link to="/nueva-solicitud" className="tramites-new-button">
              + Nueva solicitud
            </Link>
          </div>

          {cargando && (
            <div className="tramites-message">
              <div className="tramites-loader"></div>
              <p>Cargando tus solicitudes...</p>
            </div>
          )}

          {!cargando && error && (
            <div className="tramites-message tramites-error">
              <h3>No pudimos cargar tus trámites</h3>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Intentar nuevamente
              </button>
            </div>
          )}

          {!cargando && !error && solicitudes.length === 0 && (
            <div className="tramites-empty">
              <div className="tramites-empty-icon">⌕</div>
              <h3>Aún no tienes solicitudes</h3>
              <p>
                Cuando registres una solicitud, aparecerá aquí para que
                puedas consultar su información y estado.
              </p>
              <Link to="/nueva-solicitud" className="tramites-new-button">
                Crear mi primera solicitud
              </Link>
            </div>
          )}

          {!cargando && !error && solicitudes.length > 0 && (
            <div className="tramites-list">
              {solicitudes.map((solicitud) => (
                <article
                  className="tramite-card"
                  key={solicitud.idRadicado}
                >
                  <div className="tramite-card-top">
                    <div>
                      <span className="tramite-radicado-label">
                        NÚMERO DE RADICADO
                      </span>
                      <h3>#{solicitud.idRadicado}</h3>
                    </div>

                    <span
                      className={`tramite-estado ${claseEstado(
                        solicitud.estado
                      )}`}
                    >
                      {obtenerEstado(solicitud.estado)}
                    </span>
                  </div>

                  <div className="tramite-card-info">
                    <div>
                      <span>TIPO DE PERMISO</span>
                      <p>{solicitud.tipoPermiso}</p>
                    </div>

                    <div>
                      <span>DIRECCIÓN DEL PREDIO</span>
                      <p>{solicitud.direccionPredio}</p>
                    </div>

                    <div>
                      <span>FECHA DE REGISTRO</span>
                      <p>{formatearFecha(solicitud.fechaCreacion)}</p>
                    </div>

                    <div>
                      <span>DOCUMENTOS ADJUNTOS</span>
                      <p>
                        {solicitud.documentos?.length || 0}{' '}
                        {(solicitud.documentos?.length || 0) === 1
                          ? 'archivo'
                          : 'archivos'}
                      </p>
                    </div>
                  </div>

                  <div className="tramite-card-footer">
                    <span>
                      Matrícula: {solicitud.matriculaInmobiliaria || 'No registrada'}
                    </span>
                    <span className="tramite-detail-label">
                      Radicado #{solicitud.idRadicado}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="tramites-footer">
        <strong>PERMISOS MEDELLÍN</strong>
        <span>Proyecto académico · Medellín, Colombia</span>
      </footer>
    </div>
  );
}

export default MisTramites;