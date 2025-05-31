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
    navigate("/usuario/login");
  };

  const irADetalle = (id: string) => {
    navigate(`/usuario/eventos/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Bienvenido, {usuario?.name || "usuario"}
      </h1>

      <div className="flex flex-wrap gap-4">
        <a
          href="/usuario/mis-eventos"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📅 Mis eventos
        </a>
        <a
          href="/usuario/reseñas"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ⭐ Mis reseñas
        </a>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🔓 Cerrar sesión
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4">Eventos disponibles</h2>

      {loading ? (
        <p>Cargando eventos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : eventos.length === 0 ? (
        <p>No hay eventos disponibles en este momento.</p>
      ) : (
        <ul className="space-y-4">
          {eventos.map((evento) => (
            <li
              key={evento._id}
              onClick={() => irADetalle(evento._id)}
              className="border p-4 rounded shadow-sm bg-gray-50 hover:bg-blue-50 cursor-pointer transition"
            >
              <h3 className="text-lg font-semibold">{evento.name}</h3>
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
