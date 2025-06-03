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

  const getEventTypeIcon = (type: string) => {
    return type === "temporal" ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  const formatPrice = (price: number | undefined) => {
    return !price || price === 0 ? "Gratuito" : `${price} €`;
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return eventos.filter(evento => new Date(evento.start) > now);
  };

  const getPastEvents = () => {
    const now = new Date();
    return eventos.filter(evento => new Date(evento.start) <= now);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BackButton to="/usuario/home" color="#1f2937" />
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mis Eventos
              </h1>
              <p className="text-lg text-gray-600 font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gestiona tus reservas y eventos confirmados
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#81C564]/20">
                <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#412F1F]">Total Reservas</p>
                <p className="text-3xl font-bold text-gray-900">{eventos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#81C564]/20">
                <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#412F1F]">Próximos eventos</p>
                <p className="text-3xl font-bold text-gray-900">{getUpcomingEvents().length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#81C564]/20">
                <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#412F1F]">Eventos pasados</p>
                <p className="text-3xl font-bold text-gray-900">{getPastEvents().length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#81C564]/20">
                <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#412F1F]">Eventos gratuitos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {eventos.filter(e => !e.price || e.price === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#81C564] rounded-full mr-3"></div>
              Tus Reservas Confirmadas
            </h2>
            <p className="text-gray-600">Explora y gestiona todos los eventos para los que tienes reservas</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-[#81C564] mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando tus eventos</h3>
              <p className="text-gray-600">Obteniendo la lista de tus reservas confirmadas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Error al cargar eventos</h4>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes eventos reservados</h3>
              <p className="text-gray-600 mb-6">Explora eventos disponibles y realiza tu primera reserva.</p>
              <button
                onClick={() => navigate("/usuario/home")}
                className="px-6 py-3 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300"
              >
                Explorar eventos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <div
                  key={evento._id}
                  onClick={() => handleReservationClick(evento.reservation_id, evento._id)}
                  className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-[#81C564] to-[#529949] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-white">
                        <div className="mr-2">
                          {getEventTypeIcon(evento.type)}
                        </div>
                        <span className="text-sm font-medium capitalize">{evento.type}</span>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-semibold">
                          {formatPrice(evento.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-[#412F1F] group-hover:text-[#529949] transition-colors duration-200">
                      {evento.name}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">{evento.location}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">
                          {new Date(evento.start).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {evento.type === "temporal" && evento.end && (
                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 mr-3 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">
                            Hasta: {new Date(evento.end).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">Aforo: {evento.capacity} personas</span>
                      </div>
                    </div>

                    {/* Reservation Info */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="bg-[#81C564]/10 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#412F1F]">ID de Reserva:</span>
                          <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded">
                            {evento.reservation_id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Click para ver detalles</span>
                        <svg className="w-5 h-5 text-[#529949] group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#412F1F] rounded-xl p-6 text-center">
          <p className="text-white text-sm">
            🌱 Gestión de Reservas • Sistema Profesional • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
