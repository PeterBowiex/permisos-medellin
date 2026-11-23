
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
