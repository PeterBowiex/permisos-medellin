
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crearSolicitud } from '../api';
import { useAuth } from '../context/AuthContext';
import './NuevaSolicitud.css';

const documentosDisponibles = [
  { tipo: 'FUN', nombre: 'Formulario Único Nacional (FUN)', accept: '.pdf' },
  {
    tipo: 'CERTIFICADO_LIBERTAD',
    nombre: 'Certificado de libertad y tradición (vigencia máxima de 30 días)',
    accept: '.pdf',
  },
  {
    tipo: 'IDENTIDAD_PROPIETARIO',
    nombre: 'Documento de identidad del propietario',
    accept: '.pdf',
  },
  {
    tipo: 'EXISTENCIA_REPRESENTACION_LEGAL',
    nombre: 'Certificado de existencia y representación legal (persona jurídica)',
    accept: '.pdf',
  },
  {
    tipo: 'PODER_AUTORIZACION',
    nombre: 'Poder o autorización (si actúa un tercero)',
    accept: '.pdf',
  },
  {
    tipo: 'IMPUESTO_PREDIAL',
    nombre: 'Recibo del impuesto predial del último año',
    accept: '.pdf',
  },
  {
    tipo: 'MATRICULA_PROFESIONAL',
    nombre: 'Matrícula o tarjeta profesional de los responsables del diseño',
    accept: '.pdf',
  },
  {
    tipo: 'SOPORTE_EXPERIENCIA',
    nombre: 'Soportes de experiencia de los profesionales',
    accept: '.pdf',
  },
  {
    tipo: 'SOPORTES_ADICIONALES',
    nombre: 'Soportes adicionales',
    accept: '.pdf',
  },
  {
    tipo: 'PLANOS_ARQUITECTONICOS',
    nombre: 'Planos arquitectónicos',
    accept: '.pdf',
  },
];

function NuevaSolicitud() {
  const { sesion } = useAuth();
  const navigate = useNavigate();

  const [tipoPermiso, setTipoPermiso] = useState('');
  const [direccionPredio, setDireccionPredio] = useState('');
  const [matriculaInmobiliaria, setMatriculaInmobiliaria] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [documentos, setDocumentos] = useState<Record<string, File | null>>({});
  const [fotografias, setFotografias] = useState<File[]>([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  function cambiarDocumento(
    tipo: string,
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const archivo = evento.target.files?.[0] || null;

    setDocumentos((actuales) => ({
      ...actuales,
      [tipo]: archivo,
    }));
  }

  function cambiarFotografias(evento: ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(evento.target.files || []);

    if (archivos.length > 5) {
      setError('Puedes seleccionar máximo 5 fotografías.');
      evento.target.value = '';
      return;
    }

    const formatosValidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (archivos.some((archivo) => !formatosValidos.includes(archivo.type))) {
      setError('Las fotografías deben ser JPG, PNG o WEBP.');
      evento.target.value = '';
      return;
    }

    setError('');
    setFotografias(archivos);
  }

  async function enviarSolicitud(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');

    if (!sesion) {
      setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
      return;
    }

    const archivos = Object.entries(documentos)
      .filter((entrada): entrada is [string, File] => entrada[1] !== null)
      .map(([tipo, archivo]) => ({ tipo, archivo }));

    fotografias.forEach((archivo) => {
      archivos.push({
        tipo: 'FOTOGRAFIAS_PREDIO',
        archivo,
      });
    });

    try {
      setCargando(true);

      await crearSolicitud(
        {
          tipoPermiso,
          direccionPredio,
          matriculaInmobiliaria,
          descripcion,
          documentos: archivos,
        },
        sesion.auth
      );

      alert('¡Tu solicitud fue registrada correctamente!');
navigate('/panel');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al registrar la solicitud.'
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="nueva-solicitud">
      <header className="solicitud-header">
        <div>
          <span className="solicitud-etiqueta">PORTAL CIUDADANO</span>
          <h1>Nueva solicitud</h1>
          <p>
            Completa la información del predio y adjunta los documentos
            correspondientes al trámite.
          </p>
        </div>

        <Link to="/panel" className="volver-panel">
          Volver al panel
        </Link>
      </header>

      <form className="solicitud-formulario" onSubmit={enviarSolicitud}>
        <section className="form-seccion">
          <h2>01. Información del trámite</h2>
          <p className="seccion-descripcion">
            Indica qué permiso necesitas solicitar.
          </p>

          <label htmlFor="tipoPermiso">Tipo de permiso *</label>
          <select
            id="tipoPermiso"
            value={tipoPermiso}
            onChange={(e) => setTipoPermiso(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo de permiso</option>
            <option value="Licencia de construcción">
              Licencia de construcción
            </option>
            <option value="Licencia de urbanización">
              Licencia de urbanización
            </option>
            <option value="Licencia de parcelación">
              Licencia de parcelación
            </option>
            <option value="Licencia de subdivisión">
              Licencia de subdivisión
            </option>
            <option value="Reconocimiento de edificación">
              Reconocimiento de edificación
            </option>
            <option value="Otra solicitud">Otro</option>
          </select>
        </section>

        <section className="form-seccion">
          <h2>02. Información del predio</h2>
          <p className="seccion-descripcion">
            Datos para identificar el inmueble relacionado con el trámite.
          </p>

          <label htmlFor="direccionPredio">Dirección del predio *</label>
          <input
            id="direccionPredio"
            type="text"
            value={direccionPredio}
            onChange={(e) => setDireccionPredio(e.target.value)}
            placeholder="Ej. Calle 45 # 70-20"
            required
          />

          <label htmlFor="matriculaInmobiliaria">
            Matrícula inmobiliaria *
          </label>
          <input
            id="matriculaInmobiliaria"
            type="text"
            value={matriculaInmobiliaria}
            onChange={(e) => setMatriculaInmobiliaria(e.target.value)}
            placeholder="Número de matrícula inmobiliaria"
            required
          />

          <label htmlFor="descripcion">Descripción del proyecto</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe brevemente el proyecto o trámite que deseas realizar."
            rows={4}
          />
        </section>

        <section className="form-seccion">
          <h2>03. Documentación requerida</h2>
          <p className="seccion-descripcion">
            Adjunta los documentos que correspondan a tu trámite. Los
            documentos condicionales solo se requieren cuando aplique.
            Formato permitido: PDF.
          </p>

          <div className="documentos-lista">
            {documentosDisponibles.map((documento) => (
              <div className="documento-campo" key={documento.tipo}>
                <label htmlFor={documento.tipo}>{documento.nombre}</label>
                <input
                  id={documento.tipo}
                  type="file"
                  accept={documento.accept}
                  onChange={(e) => cambiarDocumento(documento.tipo, e)}
                />
                {documentos[documento.tipo] && (
                  <span className="archivo-seleccionado">
                    {documentos[documento.tipo]?.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="form-seccion">
          <h2>04. Fotografías del predio</h2>
          <p className="seccion-descripcion">
            Puedes adjuntar hasta 5 fotografías para mostrar el estado actual
            del inmueble. Formatos: JPG, PNG o WEBP.
          </p>

          <label htmlFor="fotografias">Seleccionar fotografías</label>
          <input
            id="fotografias"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={cambiarFotografias}
          />

          <p className="contador-fotos">
            {fotografias.length} de 5 fotografías seleccionadas
          </p>

          {fotografias.map((foto, indice) => (
            <p className="archivo-seleccionado" key={`${foto.name}-${indice}`}>
              {foto.name}
            </p>
          ))}
        </section>

        {error && <div className="mensaje-error">{error}</div>}

        <div className="solicitud-acciones">
          <Link to="/panel" className="boton-cancelar">
            Cancelar
          </Link>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Enviando solicitud...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NuevaSolicitud;
