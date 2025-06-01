import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmpresaCheckInPage() {
  const { eventId } = useParams();
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [anomalia, setAnomalia] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await fetch(
        `http://localhost:8001/reservations/event/${eventId}`
      );
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al cargar las reservas");
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

      const json = await res.json();
      await fetchReservations();

      setMensaje("✅ Check-in realizado correctamente");
      if (json?.previous_anomaly_checkins) {
        setAnomalia("⚠️ Anomalías previas detectadas.");
      }

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
      alert("❌ Error al reportar problema");
    }
  };

  const getBgColor = (r: any) => {
    const status = r.checkin?.status;
    if (status === "completed") return "bg-green-100";
    if (status === "trouble") return "bg-yellow-100";
    if (status === "anomaly") return "bg-red-100";
    return "bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-empresa py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <h1 className="text-3xl font-bold text-text-main">
          📲 Check-in evento <span className="text-blue-700">{eventId}</span>
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Reservation ID"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            className="input flex-1"
          />
          <button onClick={handleCheckIn} className="btn-empresa">
            ✅ Hacer check-in
          </button>
        </div>

        {mensaje && (
          <p className="text-center text-sm text-blue-700 font-medium">
            {mensaje}
          </p>
        )}
        {anomalia && (
          <p className="text-center text-sm text-red-600 font-semibold">
            {anomalia}
          </p>
        )}

        <hr className="my-4" />

        <h2 className="text-2xl font-semibold text-text-main">
          📋 Reservas del evento
        </h2>

        <ul className="space-y-3">
          {reservations.map((r) => (
            <li
              key={r._id}
              className={`p-4 border rounded-lg shadow-sm ${getBgColor(
                r
              )} flex justify-between items-center`}
            >
              <div>
                <p className="font-bold text-text-main">
                  {r.kycInfo?.name || "Usuario Anónimo"}
                </p>
                <p className="text-sm text-gray-600">{r.kycInfo?.phone}</p>
                <p className="text-sm text-gray-600">{r.kycInfo?.email}</p>
                <p className="font-mono text-sm mt-1">{r._id}</p>
              </div>
              {r.checkin?.status === "completed" && (
                <button
                  onClick={() => reportProblem(r._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  ⚠️ Notificar problema
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
