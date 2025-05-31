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
    <div className="p-6 max-w-4xl mx-auto bg-usuario rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-text-main">
        Bienvenido, {usuario?.name || "usuario"}
      </h1>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate("/usuario/mis-eventos")}
          className="btn-usuario"
        >
          📅 Mis eventos
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

      <hr className="my-6 border-gray-400" />

      <h2 className="text-2xl font-semibold text-text-main">
        Eventos disponibles
      </h2>

      {loading ? (
        <p className="text-gray-700">Cargando eventos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : eventos.length === 0 ? (
        <p className="text-gray-700">
          No hay eventos disponibles en este momento.
        </p>
      ) : (
        <ul className="space-y-4">
          {eventos.map((evento) => (
            <li
              key={evento._id}
              onClick={() => irADetalle(evento._id)}
              className="border border-gray-300 p-4 rounded shadow-sm bg-white hover:bg-gray-50 cursor-pointer transition"
            >
              <h3 className="text-lg font-semibold text-text-main">
                {evento.name}
              </h3>
              <p>📍 {evento.location}</p>
              <p>🗓️ {new Date(evento.start).toLocaleString()}</p>
              {evento.type === "temporal" && evento.end && (
                <p>➡️ Hasta: {new Date(evento.end).toLocaleString()}</p>
              )}
              <p>👥 Aforo: {evento.capacity}</p>
              <p>💰 Precio: {evento.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
