
import { createContext, useContext, useState, type ReactNode } from 'react';
import { iniciarSesion, type Usuario } from '../api';

interface Sesion {
  usuario: Usuario;
  auth: string;
}

interface AuthContextType {
  sesion: Sesion | null;
  login: (email: string, clave: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function leerSesion(): Sesion | null {
  try {
    const texto = sessionStorage.getItem('sesion');
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);

  async function login(email: string, clave: string) {
    const nueva = await iniciarSesion(email, clave);
    setSesion(nueva);

    try {
      sessionStorage.setItem('sesion', JSON.stringify(nueva));
    } catch {
      // La sesión vive solo en memoria.
    }
  }

  function logout() {
    setSesion(null);

    try {
      sessionStorage.removeItem('sesion');
    } catch {
      // No hay almacenamiento que limpiar.
    }
  }

  return (
    <AuthContext.Provider value={{ sesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return contexto;
}
