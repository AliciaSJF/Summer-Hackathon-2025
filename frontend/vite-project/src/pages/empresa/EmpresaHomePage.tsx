import { useEffect, useState } from "react";
import { getBusinessById } from "../../services/businessService";
import { obtenerEventos } from "../../services/eventService";
import { useNavigate } from "react-router-dom";

type Business = {
  name: string;
  vertical: string;
  plan: string;
  apiKey: string;
  config: Record<string, any>;
};

type Evento = {
  _id: string;
  name: string;
  type: string;
  start: string;
  end?: string;
  location: string;
  capacity: number;
};

export default function EmpresaHomePage() {
  const navigate = useNavigate();
  const businessId =
    localStorage.getItem("businessId") || "683adc369af196301892a609";

  const [business, setBusiness] = useState<Business | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventosLoading, setEventosLoading] = useState(true);
  const [errorEventos, setErrorEventos] = useState("");

  useEffect(() => {
    getBusinessById(businessId)
      .then((data) => setBusiness(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const data = await obtenerEventos(businessId);
        setEventos(data);
      } catch (err) {
        setErrorEventos("❌ Error al cargar eventos");
      } finally {
        setEventosLoading(false);
      }
    }

    cargarEventos();
  }, [businessId]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(business?.apiKey || "");
    alert("API key copiada al portapapeles");
  };

  if (loading)
    return <div className="p-6 text-gray-600">Cargando negocio...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Bienvenido, {business?.name}
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Vertical:</strong>{" "}
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {business?.vertical}
          </span>
        </p>
        <p>
          <strong>Plan:</strong> {business?.plan}
        </p>
        <p>
          <strong>API Key:</strong>
          <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded font-mono">
            {business?.apiKey.slice(0, 8)}...
          </span>
          <button
            onClick={copyApiKey}
            className="ml-2 text-blue-600 hover:underline text-sm"
          >
            Copiar
          </button>
        </p>
        <p>
          <strong>Configuración:</strong>{" "}
          {Object.keys(business?.config || {}).length > 0
            ? "Personalizada"
            : "Sin configuración"}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap gap-4">
        <a
          href="/empresa/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📊 Ver dashboard
        </a>
        <a
          href="/empresa/eventos/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📝 Crear evento
        </a>
        <a
          href="/empresa/reseñas"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ⭐ Análisis de reseñas
        </a>
      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4">Eventos organizados</h2>

      {eventosLoading ? (
        <p>Cargando eventos...</p>
      ) : errorEventos ? (
        <p className="text-red-600">{errorEventos}</p>
      ) : eventos.length === 0 ? (
        <p>No hay eventos organizados aún.</p>
      ) : (
        <ul className="space-y-4">
          {eventos.map((evento) => (
            <li
              key={evento._id}
              className="border p-4 rounded shadow-sm bg-gray-50 space-y-2"
            >
              <h3 className="text-lg font-semibold">{evento.name}</h3>
              <p>📍 {evento.location}</p>
              <p>🗓️ {new Date(evento.start).toLocaleString()}</p>
              {evento.type === "temporal" && evento.end && (
                <p>➡️ Hasta: {new Date(evento.end).toLocaleString()}</p>
              )}
              <p>👥 Aforo: {evento.capacity}</p>
              <span className="inline-block px-2 py-1 bg-gray-200 text-sm rounded">
                Tipo: {evento.type}
              </span>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/empresa/checkin/${evento._id}`)}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  🟢 Gestionar check-in
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
