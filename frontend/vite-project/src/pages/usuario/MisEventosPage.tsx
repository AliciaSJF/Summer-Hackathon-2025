import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface EventWithReservation {
  _id: string;
  reservation_id: string;
  name: string;
  description: string;
  type: string;
  start: string;
  end?: string;
  capacity: number;
  location: string;
  price?: number;
  businessId: string;
  createdAt: string;
}

export default function MisEventosPage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<EventWithReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || '{"_id": "683b4bfdebc0428122dd8146"}'
  );

  useEffect(() => {
    fetch(`http://localhost:8001/events/user/${usuario._id}/reservations`)
      .then((res) => res.json())
      .then(setEventos)
      .catch((err) => {
        console.error(err);
        setError("❌ Error al cargar eventos");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReservationClick = (reservationId: string, eventId: string) => {
    navigate(`/usuario/reservations/${reservationId}/event/${eventId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-usuario rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        Tus eventos
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
              onClick={() =>
                handleReservationClick(evento.reservation_id, evento._id)
              }
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
              <p>💰 Precio: {evento.price || 0} €</p>
              <p className="text-xs text-gray-500">
                🔑 ID de la reserva: {evento.reservation_id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
