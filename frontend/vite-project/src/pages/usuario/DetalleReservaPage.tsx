import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Evento = {
  _id: string;
  name: string;
  description: string;
  type: string;
  start: string;
  end?: string;
  capacity: number;
  location: string;
  price: number;
};

type Reserva = {
  _id: string;
  eventId: string;
  userId: string;
  status: string;
  preverifiedAt: string;
  otpVerified: boolean;
  kycVerified: boolean;
  locationVerified?: boolean;
  completedAt?: string;
  metadata?: any;
};

export default function DetalleReservaPage() {
  const { reservationId, eventId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || '{"_id": "683b4bfdebc0428122dd8146"}'
  );

  useEffect(() => {
    fetch(`http://localhost:8001/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvento)
      .catch(() => setMensaje("❌ Error al cargar el evento"));

    fetch(`http://localhost:8001/reservations/${reservationId}`)
      .then((res) => res.json())
      .then(setReserva)
      .catch(() => setMensaje("❌ Error al cargar la reserva"))
      .finally(() => setLoading(false));
  }, [eventId, reservationId]);

  const handleRegistro = async () => {
    try {
      const res = await fetch("http://localhost:8001/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          eventId: evento?._id,
          userId: usuario._id,
        }),
      });

      const success = await res.json();

      if (success) {
        setMensaje("✅ Registro completado con éxito");
        setTimeout(() => navigate("/usuario/mis-eventos"), 2000);
      } else {
        setMensaje("❌ No se pudo registrar. ¿Ya estás inscrito?");
      }
    } catch {
      setMensaje("❌ Error al registrarse");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-600">Cargando evento...</div>;

  return (
    <div className="min-h-screen bg-usuario py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-200">
        {evento ? (
          <>
            <h1 className="text-3xl font-bold text-text-main">{evento.name}</h1>
            <p className="text-gray-800">{evento.description}</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>📍 Ubicación:</strong> {evento.location}
              </p>
              <p>
                <strong>🕒 Inicio:</strong>{" "}
                {new Date(evento.start).toLocaleString()}
              </p>
              {evento.type === "temporal" && evento.end && (
                <p>
                  <strong>➡️ Fin:</strong>{" "}
                  {new Date(evento.end).toLocaleString()}
                </p>
              )}
              <p>
                <strong>👥 Aforo:</strong> {evento.capacity}
              </p>
              <p>
                <strong>💰 Precio:</strong> {evento.price} €
              </p>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
              <h2 className="text-2xl font-semibold text-text-main">
                📋 Datos de la Reserva
              </h2>

              {reserva ? (
                <>
                  <div className="flex flex-col items-center">
                    <img
                      src="/src/assets/fake-qr.png"
                      alt="Código QR de la reserva"
                      className="w-32 h-32 border-2 border-gray-300 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDAwIi8+CjxyZWN0IHg9IjgwIiB5PSIxNiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDAwIi8+CjxyZWN0IHg9IjE2IiB5PSI4MCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjY0IiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUjwvdGV4dD4KPC9zdmc+";
                      }}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Muestra este código en el evento
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-800">
                    <p>
                      <strong>ID de Reserva:</strong>{" "}
                      <span className="ml-2 font-mono bg-gray-200 px-2 py-1 rounded">
                        {reserva._id}
                      </span>
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                          reserva.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : reserva.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reserva.status}
                      </span>
                    </p>
                    <p>
                      <strong>Fecha de Reserva:</strong>{" "}
                      {new Date(reserva.preverifiedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">Cargando datos de reserva...</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-600">❌ Evento no encontrado</p>
        )}

        {mensaje && (
          <p className="text-center text-blue-700 font-medium">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
