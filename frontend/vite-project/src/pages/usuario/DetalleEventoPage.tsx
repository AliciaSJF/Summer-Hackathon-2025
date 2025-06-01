import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

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

  const getEventTypeIcon = (type: string) => {
    return type === "temporal" ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Gratuito" : `${price} €`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Cargando Evento
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Obteniendo los detalles del evento...
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-[#81C564] mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando evento</h3>
            <p className="text-gray-600">Obteniendo la información completa del evento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BackButton to="/usuario/home" color="#1f2937" />
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {evento ? evento.name : "Detalle del Evento"}
              </h1>
              <p className="text-lg text-gray-600 font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información completa del evento y registro
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {evento ? (
          <>
            {/* Event Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#81C564] to-[#529949] p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <div className="mr-4">
                      {getEventTypeIcon(evento.type)}
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide opacity-90">
                        Evento {evento.type}
                      </span>
                      <h2 className="text-3xl font-bold mt-1">{evento.name}</h2>
                    </div>
                  </div>
                  <div className="bg-white/20 px-6 py-3 rounded-xl">
                    <span className="text-white text-2xl font-bold">
                      {formatPrice(evento.price)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Event Description */}
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#412F1F] mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descripción del Evento
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-lg">{evento.description}</p>
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Location & Schedule */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#412F1F] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ubicación y Horario
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <p className="text-gray-700">{evento.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Fecha y hora de inicio</p>
                      <p className="text-gray-700">
                        {new Date(evento.start).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {evento.type === "temporal" && evento.end && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Fecha y hora de fin</p>
                        <p className="text-gray-700">
                          {new Date(evento.end).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity & Pricing */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#412F1F] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Detalles del Evento
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Capacidad máxima</p>
                      <p className="text-gray-700">{evento.capacity} personas</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Precio</p>
                      <p className="text-gray-700 text-xl font-semibold">{formatPrice(evento.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-[#529949] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Tipo de evento</p>
                      <p className="text-gray-700 capitalize">{evento.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#412F1F] mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Registro al Evento
                </h3>
                <p className="text-gray-600 mb-6">
                  Confirma tu asistencia al evento. Recibirás una confirmación por email.
                </p>
                
                <button
                  onClick={handleRegistro}
                  className="px-8 py-4 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold text-lg rounded-lg hover:from-[#529949] hover:to-[#412F1F] focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center mx-auto"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Registrarse en el evento
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {mensaje && (
              <div className={`p-4 rounded-lg border ${
                mensaje.includes('✅') 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    mensaje.includes('✅') ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {mensaje.includes('✅') ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium text-lg ${
                    mensaje.includes('✅') ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {mensaje}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Event Not Found */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="p-4 bg-red-100 rounded-full inline-block mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Evento no encontrado</h3>
              <p className="text-gray-600 mb-6">
                {mensaje || "El evento que buscas no existe o ha sido eliminado."}
              </p>
              <button
                onClick={() => navigate("/usuario/home")}
                className="px-6 py-3 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300"
              >
                Volver a eventos
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#412F1F] rounded-xl p-6 text-center">
          <p className="text-white text-sm">
            🌱 Plataforma de Eventos • Sistema Profesional • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
