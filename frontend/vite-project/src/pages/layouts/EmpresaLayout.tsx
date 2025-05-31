import { Outlet, Link } from "react-router-dom";

export default function EmpresaLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white min-h-screen p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Panel Empresa</h2>
        <nav className="space-y-2">
          <Link to="/empresa/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/empresa/eventos/nuevo" className="block hover:underline">
            Crear evento
          </Link>
          <Link to="/empresa/checkin" className="block hover:underline">
            Check-in
          </Link>
          <Link to="/empresa/reseñas" className="block hover:underline">
            Reseñas
          </Link>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
