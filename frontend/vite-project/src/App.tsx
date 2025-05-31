import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pantalla inicial y error
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

// Layouts
import UsuarioLayout from "./pages/layouts/UsuarioLayout";
import EmpresaLayout from "./pages/layouts/EmpresaLayout";

// Usuario
import RegistroPage from "./pages/usuario/RegistroPage";
import UsuarioLoginPage from "./pages/usuario/UsuarioLoginPage";
import UauarioHomePage from "./pages/usuario/UsuarioHomePage"; // Si la tienes
import EventosPage from "./pages/usuario/EventosPage";
import DetalleEventoPage from "./pages/usuario/DetalleEventoPage";
import MisEventosPage from "./pages/usuario/MisEventosPage";
import UsuarioResenasPage from "./pages/usuario/UsuarioResenasPage";
import UsuarioCheckInPage from "./pages/usuario/UsuarioCheckInPage"; // Si la tienes

// Empresa
import EmpresaLoginPage from "./pages/empresa/EmpresaLoginPage";
import EmpresaHomePage from "./pages/empresa/EmpresaHomePage";
import DashboardPage from "./pages/empresa/DashboardPage";
import CrearEventoPage from "./pages/empresa/CrearEventoPage";
import EmpresaCheckInPage from "./pages/empresa/EmpresaCheckInPage";
import EmpresaResenasPage from "./pages/empresa/EmpresaResenasPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Usuario */}
        <Route path="/usuario" element={<UsuarioLayout />}>
          <Route path="login" element={<UsuarioLoginPage />} />
          <Route path="registro" element={<RegistroPage />} />
          <Route path="home" element={<UauarioHomePage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="eventos/:id" element={<DetalleEventoPage />} />
          <Route path="mis-eventos" element={<MisEventosPage />} />
          <Route path="reseñas" element={<UsuarioResenasPage />} />
          <Route path="acceso/:id" element={<UsuarioCheckInPage />} />
        </Route>

        {/* Empresa */}
        <Route path="/empresa" element={<EmpresaLayout />}>
          <Route path="login" element={<EmpresaLoginPage />} />
          <Route path="home" element={<EmpresaHomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="eventos/nuevo" element={<CrearEventoPage />} />
          <Route path="checkin/:eventId" element={<EmpresaCheckInPage />} />
          <Route path="reseñas" element={<EmpresaResenasPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
