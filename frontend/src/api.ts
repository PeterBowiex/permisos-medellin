export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'PROPIETARIO' | 'FUNCIONARIO';
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  clave: string;
  telefono: string;
  direccion: string;
}

export interface DatosSolicitud {
  tipoPermiso: string;
  direccionPredio: string;
  matriculaInmobiliaria: string;
  descripcion: string;
  documentos: {
    tipo: string;
    archivo: File;
  }[];
}

export interface DocumentoResumen {
  id: number;
  nombreArchivo: string;
  tipoDocumento: string;
  formato: string;
  tamanioBytes: number;
}

export interface SolicitudResumen {
  idRadicado: number;
  tipoPermiso: string;
  direccionPredio: string;
  matriculaInmobiliaria: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  documentos: DocumentoResumen[];
}

export function basicAuth(email: string, clave: string): string {
  const bytes = new TextEncoder().encode(`${email}:${clave}`);
  return 'Basic ' + btoa(String.fromCharCode(...bytes));
}

export async function registrar(datos: DatosRegistro): Promise<void> {
  const res = await fetch('/api/auth/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    throw new Error(
      res.status === 409
        ? 'Ese correo ya está registrado.'
        : 'No se pudo completar el registro. Revisa los datos.'
    );
  }
}

export async function iniciarSesion(
  email: string,
  clave: string
): Promise<{ usuario: Usuario; auth: string }> {
  const auth = basicAuth(email, clave);

  const res = await fetch('/api/auth/yo', {
    headers: {
      Authorization: auth,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!res.ok) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  return { usuario: await res.json(), auth };
}

export async function crearSolicitud(
  datos: DatosSolicitud,
  auth: string
): Promise<void> {
  const formulario = new FormData();

  formulario.append('tipoPermiso', datos.tipoPermiso);
  formulario.append('direccionPredio', datos.direccionPredio);
  formulario.append('matriculaInmobiliaria', datos.matriculaInmobiliaria);
  formulario.append('descripcion', datos.descripcion);

  datos.documentos.forEach((documento) => {
    formulario.append('archivos', documento.archivo);
    formulario.append('tiposDocumentos', documento.tipo);
  });

  const res = await fetch('/api/solicitudes', {
    method: 'POST',
    headers: { Authorization: auth },
    body: formulario,
  });

  if (!res.ok) {
    let mensaje = 'No se pudo registrar la solicitud.';

    try {
      const respuesta = await res.json();
      mensaje = respuesta.message || respuesta.error || mensaje;
    } catch {}

    throw new Error(mensaje);
  }
}

export async function obtenerMisSolicitudes(
  auth: string
): Promise<SolicitudResumen[]> {
  const res = await fetch('/api/solicitudes/mis-solicitudes', {
    method: 'GET',
    headers: {
      Authorization: auth,
    },
  });

  if (!res.ok) {
    throw new Error('No fue posible cargar tus trámites.');
  }

  return await res.json();
}