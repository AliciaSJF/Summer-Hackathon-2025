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

export default function DetalleEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || '{"_id": "683b4bfdebc0428122dd8146"}'
  );

  useEffect(() => {
    fetch(`http://localhost:8001/events/${id}`)
      .then((res) => res.json())
      .then(setEvento)
      .catch(() => setMensaje("❌ Error al cargar el evento"))
      .finally(() => setLoading(false));
  }, [id]);

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
    } catch (err) {
      console.error(err);
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

            <button
              onClick={handleRegistro}
              className="btn-usuario w-full mt-6"
            >
              ✍️ Registrarse en el evento
            </button>
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
