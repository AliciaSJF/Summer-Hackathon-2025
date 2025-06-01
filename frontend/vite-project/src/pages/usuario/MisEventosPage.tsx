import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

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
    <div className="min-h-screen bg-usuario py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8 border border-gray-200">
        <div className="flex justify-between items-center relative">
          <BackButton to="/usuario/home" color="#0e7c54" />
          <h2 className="text-3xl font-bold text-text-main mt-12">
            🎟 Tus eventos
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-600">Cargando eventos...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : eventos.length === 0 ? (
          <p className="text-gray-600">
            No hay eventos disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventos.map((evento) => (
              <div
                key={evento._id}
                onClick={() =>
                  handleReservationClick(evento.reservation_id, evento._id)
                }
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
                  💰 Precio: {evento.price || 0} €
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  🔑 ID reserva: {evento.reservation_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
