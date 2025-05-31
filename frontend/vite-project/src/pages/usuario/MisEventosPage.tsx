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

  const usuario = JSON.parse(localStorage.getItem("usuario") || '{"_id": "683b4bfdebc0428122dd8146"}');

  useEffect(() => {
    console.log("usuario:", usuario);
    fetch(`http://localhost:8001/events/user/${usuario._id}/reservations`)
      .then((res) => {
        let response = res.json();
      console.log(response);
    return response})
      .then(setEventos)
      .catch((err) => {
        console.error(err);
        setError("❌ Error al cargar eventos");
      })
      .finally(() => {setLoading(false)
      });
  }, []);

  const handleReservationClick = (reservationId: string, eventId: string) => {
    navigate(`/usuario/reservations/${reservationId}/event/${eventId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">

      <h2 className="text-2xl font-semibold mb-4">Tus eventos</h2>

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
              onClick={() => handleReservationClick(evento.reservation_id, evento._id)}
              className="border p-4 rounded shadow-sm bg-gray-50 hover:bg-blue-50 cursor-pointer transition"
            >
              <h3 className="text-lg font-semibold">{evento.name}</h3>
              <p>📍 {evento.location}</p>
              <p>🗓️ {new Date(evento.start).toLocaleString()}</p>
              {evento.type === "temporal" && evento.end && (
                <p>➡️ Hasta: {new Date(evento.end).toLocaleString()}</p>
              )}
              <p>👥 Aforo: {evento.capacity}</p>
              <p>💰 Precio: {evento.price || 0} €</p>
              <p>🔑 ID de la reserva: {evento.reservation_id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

