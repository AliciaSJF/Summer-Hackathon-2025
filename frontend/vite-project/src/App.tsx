import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pantalla inicial y error
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

// Usuario
import RegistroPage from "./pages/usuario/RegistroPage";
import UauarioHomePage from "./pages/usuario/UsuarioHomePage"; // Si la tienes
import EventosPage from "./pages/usuario/EventosPage";
import DetalleEventoPage from "./pages/usuario/DetalleEventoPage";
import MisEventosPage from "./pages/usuario/MisEventosPage";
import UsuarioResenasPage from "./pages/usuario/UsuarioResenasPage";
import DetalleReservaPage from "./pages/usuario/DetalleReservaPage";
// Empresa
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
        <Route path="/usuario/registro" element={<RegistroPage />} />
        <Route path="/usuario/home" element={<UauarioHomePage />} />
        <Route path="/usuario/eventos" element={<EventosPage />} />
        <Route path="/usuario/eventos/:id" element={<DetalleEventoPage />} />
        <Route path="/usuario/mis-eventos" element={<MisEventosPage />} />
        <Route path="/usuario/reseñas" element={<UsuarioResenasPage />} />
        <Route
          path="/usuario/reservations/:reservationId/event/:eventId"
          element={<DetalleReservaPage />}
        />
        {/* Empresa */}
        <Route path="/empresa/home" element={<EmpresaHomePage />} />
        <Route path="/empresa/dashboard" element={<DashboardPage />} />
        <Route path="/empresa/eventos/nuevo" element={<CrearEventoPage />} />
        <Route
          path="/empresa/checkin/:eventId"
          element={<EmpresaCheckInPage />}
        />
        <Route path="/empresa/reseñas" element={<EmpresaResenasPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
