import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import LoadingScreen from './components/common/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home/Home';
import Buscar from './pages/buscar/Buscar';
import Chat from './pages/chat/Chat';
import Misiones from './pages/misiones/Misiones';
import Perfil from './pages/perfil/Perfil';
import MisSolicitudes from './pages/solicitudes/MisSolicitudes';
import MapaPage from './pages/mapa/MapaPage';

const Rutas = () => {
  const { autenticado, cargando } = useAuth();
  if (cargando) return <LoadingScreen />;
  return (
    <Routes>
      <Route path="/" element={autenticado ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={autenticado ? <Navigate to="/home" /> : <Register />} />
      {/* Home es el mapa principal - NO usa MainLayout porque es full-screen */}
      <Route path="/home" element={autenticado ? <><Home /><MainLayout mapMode /></> : <Navigate to="/" />} />
      <Route path="/buscar" element={autenticado ? <MainLayout><Buscar /></MainLayout> : <Navigate to="/" />} />
      <Route path="/chat" element={autenticado ? <MainLayout><Chat /></MainLayout> : <Navigate to="/" />} />
      <Route path="/chat/:id" element={autenticado ? <MainLayout><Chat /></MainLayout> : <Navigate to="/" />} />
      <Route path="/misiones" element={autenticado ? <MainLayout><Misiones /></MainLayout> : <Navigate to="/" />} />
      <Route path="/perfil" element={autenticado ? <MainLayout><Perfil /></MainLayout> : <Navigate to="/" />} />
      <Route path="/mis-solicitudes" element={autenticado ? <MainLayout><MisSolicitudes /></MainLayout> : <Navigate to="/" />} />
      <Route path="/mapa" element={autenticado ? <MainLayout><MapaPage /></MainLayout> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <AuthProvider>
      <BrowserRouter>
        <Rutas />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
