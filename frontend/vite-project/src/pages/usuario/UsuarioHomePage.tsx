import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Evento = {
  _id: string;
  name: string;
  type: string;
  start: string;
  end?: string;
  capacity: number;
  location: string;
  price: number;
};

export default function UsuarioHomePage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultUsuario = {
    _id: "683b55e323204f24b8f09aef",
    name: "Marta Galeano Grijalba",
    email: "csp.nacintegrations@nokia.com",
  };

  if (!localStorage.getItem("usuario")) {
    localStorage.setItem("usuario", JSON.stringify(defaultUsuario));
  }

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    fetch("http://localhost:8001/events")
      .then((res) => res.json())
      .then(setEventos)
      .catch((err) => {
        console.error(err);
        setError("❌ Error al cargar eventos");
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("usuario");
    navigate("/usuario/registro");
  };

  const irADetalle = (id: string) => {
    navigate(`/usuario/eventos/${id}`);
  };

  return (
    <div className="min-h-screen bg-usuario py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-1">
              Bienvenido, {usuario?.name || "usuario"}
            </h1>
            <p className="text-gray-600">
              Explora y gestiona tus eventos favoritos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/usuario/mis-eventos")}
              className="btn-usuario"
            >
              📅 Mis eventos
            </button>
            <button
              onClick={() => navigate("/usuario/recomendaciones")}
              className="btn-usuario"
            >
              🎯 Recomendaciones
            </button>
            <button
              onClick={() => navigate("/usuario/reseñas")}
              className="btn-usuario"
            >
              ⭐ Mis reseñas
            </button>
            <button
              onClick={logout}
              className="btn-usuario bg-red-600 hover:bg-red-700"
            >
              🔓 Cerrar sesión
            </button>
          </div>
        </div>

        <hr className="border-gray-300" />

        <h2 className="text-2xl font-semibold text-text-main">
          Eventos disponibles
        </h2>

        {loading ? (
          <p className="text-gray-600">Cargando eventos...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : eventos.length === 0 ? (
          <p className="text-gray-600">No hay eventos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventos.map((evento) => (
              <div
                key={evento._id}
                onClick={() => irADetalle(evento._id)}
                className="cursor-pointer border border-gray-200 p-5 rounded-xl shadow-sm bg-gray-50 hover:bg-white transition-all"
              >
                <h3 className="text-lg font-semibold text-text-main mb-2">
                  {evento.name}
                </h3>
                <p className="text-sm text-gray-700">📍 {evento.location}</p>
                <p className="text-sm text-gray-700">
                  🗓️ {new Date(evento.start).toLocaleString()}
                </p>
                {evento.type === "temporal" && evento.end && (
                  <p className="text-sm text-gray-700">
                    ➡️ Hasta: {new Date(evento.end).toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  👥 Aforo: {evento.capacity}
                </p>
                <p className="text-sm text-gray-700">
                  💰 Precio: {evento.price} €
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
