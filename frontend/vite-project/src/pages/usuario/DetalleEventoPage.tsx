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
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    fetch(`http://localhost:8001/events/${id}`)
      .then((res) => res.json())
      .then(setEvento)
      .catch((err) => {
        console.error(err);
        setMensaje("❌ Error al cargar el evento");
      })
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

  if (loading) return <div className="p-6">Cargando evento...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow space-y-4">
      {evento ? (
        <>
          <h1 className="text-3xl font-bold">{evento.name}</h1>
          <p className="text-gray-700">{evento.description}</p>
          <p>
            <strong>Ubicación:</strong> {evento.location}
          </p>
          <p>
            <strong>Inicio:</strong> {new Date(evento.start).toLocaleString()}
          </p>
          {evento.type === "temporal" && evento.end && (
            <p>
              <strong>Fin:</strong> {new Date(evento.end).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Aforo:</strong> {evento.capacity}
          </p>
          <p>
            <strong>Precio:</strong> {evento.price} €
          </p>

          <button
            onClick={handleRegistro}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✍️ Registrarse en el evento
          </button>
        </>
      ) : (
        <p>Evento no encontrado</p>
      )}

      {mensaje && <p className="mt-4 text-blue-700">{mensaje}</p>}
    </div>
  );
}
