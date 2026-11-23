
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';

function PaginaTemporal({ titulo }: { titulo: string }) {
  return (
    <div
      style={{
        padding: '60px',
        textAlign: 'center',
        minHeight: '60vh',
      }}
    >
      <h1>{titulo}</h1>
      <p>Esta página está en construcción.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/registro"
        element={<PaginaTemporal titulo="Crear una cuenta" />}
      />

      <Route
        path="/panel"
        element={<PaginaTemporal titulo="Panel de usuario" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
