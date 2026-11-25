import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Panel from './pages/Panel';
import NuevaSolicitud from './pages/NuevaSolicitud';
import MisTramites from './pages/MisTramites';

import { useAuth } from './context/AuthContext';

function App() {
  const { sesion } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/panel"
        element={sesion ? <Panel /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/nueva-solicitud"
        element={sesion ? <NuevaSolicitud /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/mis-tramites"
        element={sesion ? <MisTramites /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;