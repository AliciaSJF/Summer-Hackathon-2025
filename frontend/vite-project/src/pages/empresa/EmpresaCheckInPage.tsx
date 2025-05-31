import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmpresaCheckInPage() {
  const { eventId } = useParams();
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [mensaje, setMensaje] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await fetch(
        `http://localhost:8001/reservations/event/${eventId}`
      );
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
      setMensaje("Error al cargar las reservas");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [eventId]);

  const handleCheckIn = async () => {
    try {
      const res = await fetch(
        `http://localhost:8001/reservations/${reservationId}/checkin`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error("Error en el check-in");

      await fetchReservations();
      setMensaje("✅ Check-in realizado correctamente");
      setReservationId("");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al hacer el check-in");
    }
  };

  const reportProblem = async (id: string) => {
    try {
      await fetch(`http://localhost:8001/reservations/${id}/checkin/trouble`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "trouble" }),
      });

      await fetchReservations();
    } catch (err) {
      console.error(err);
      alert("Error al reportar problema");
    }
  };

  const getBgColor = (r: any) => {
    const status = r.checkin?.status;
    if (status === "completed") return "bg-green-100";
    if (status === "trouble") return "bg-yellow-100";
    return "bg-gray-100";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Check-in para evento <span className="text-blue-600">{eventId}</span>
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Reservation ID"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          className="input w-full"
        />
        <button
          onClick={handleCheckIn}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Hacer check-in
        </button>
      </div>

      {mensaje && <p className="text-sm mb-4 text-center">{mensaje}</p>}

      <h2 className="text-xl font-semibold mb-2">Reservas</h2>
      <ul className="space-y-2">
        {reservations.map((r) => (
          <li
            key={r._id}
            className={`p-3 border rounded flex justify-between items-center ${getBgColor(
              r
            )}`}
          >
            <div>
              <p className="font-semibold">
                {r.kycInfo?.name || "Usuario Anónimo"}
              </p>
              <p className="text-xs text-gray-600">{r.kycInfo?.phone}</p>
              <p className="text-xs text-gray-600">{r.kycInfo?.email}</p>
              <p className="font-mono text-sm">{r._id}</p>
            </div>
            {r.checkin?.status === "completed" && (
              <button
                onClick={() => reportProblem(r._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Notificar problema
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
