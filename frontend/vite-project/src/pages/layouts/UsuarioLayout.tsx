import { Outlet, Link } from "react-router-dom";

export default function UsuarioLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="font-bold text-lg">EventosApp</h1>
          <div className="space-x-4">
            <Link to="/eventos" className="text-blue-600 hover:underline">
              Eventos
            </Link>
            <Link to="/mis-eventos" className="text-blue-600 hover:underline">
              Mis Eventos
            </Link>
            <Link to="/reseñas" className="text-blue-600 hover:underline">
              Reseñas
            </Link>
          </div>
        </nav>
      </header>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
