import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

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

  const getStatusConfig = (r: any) => {
    const status = r.checkin?.status;
    if (status === "completed") return {
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-800",
      icon: "text-green-600",
      text: "Completado"
    };
    if (status === "trouble") return {
      bg: "bg-yellow-50",
      border: "border-yellow-200", 
      badge: "bg-yellow-100 text-yellow-800",
      icon: "text-yellow-600",
      text: "Con problema"
    };
    if (status === "anomaly") return {
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-800", 
      icon: "text-red-600",
      text: "Anomalía detectada"
    };
    return {
      bg: "bg-gray-50",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-800",
      icon: "text-gray-600", 
      text: "Pendiente"
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "trouble":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "anomaly":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BackButton to="/empresa/home" color="#1f2937" />
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Sistema de Check-In
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Gestión de asistencia para evento <span className="text-[#0068FF] font-bold">{eventId}</span>
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Check-in Action Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#0068FF] rounded-full mr-3"></div>
              Realizar Check-In
            </h2>
            <p className="text-gray-600">Introduce el ID de reserva para procesar el check-in del cliente</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Reserva
              </label>
              <input
                type="text"
                placeholder="Ingresa el ID de la reserva"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleCheckIn}
                disabled={!reservationId.trim()}
                className="px-8 py-3 bg-gradient-to-r from-[#0068FF] to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Procesar Check-In
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {mensaje && (
            <div className={`p-4 rounded-lg border ${
              mensaje.includes('✅') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
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
                <span className="font-medium">{mensaje}</span>
              </div>
            </div>
          )}

          {anomalia && (
            <div className="mt-4 p-4 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-800">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="font-medium">{anomalia}</span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-8 h-8 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                <p className="text-3xl font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Check-ins Completados</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reservations.filter(r => r.checkin?.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Con Problemas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reservations.filter(r => r.checkin?.status === "trouble").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Anomalías</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reservations.filter(r => r.checkin?.status === "anomaly").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#0068FF] rounded-full mr-3"></div>
              Lista de Reservas del Evento
            </h2>
            <p className="text-gray-600">Gestión completa de todas las reservas y su estado de check-in</p>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas disponibles</h3>
              <p className="text-gray-600">Aún no se han registrado reservas para este evento.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map((r) => {
                const statusConfig = getStatusConfig(r);
                return (
                  <div
                    key={r._id}
                    className={`${statusConfig.bg} ${statusConfig.border} border rounded-xl p-6 hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mr-4">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {r.kycInfo?.name || "Usuario Anónimo"}
                                </h3>
                                <p className="text-sm text-gray-600">{r.kycInfo?.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                              <span className={`mr-1 ${statusConfig.icon}`}>
                                {getStatusIcon(r.checkin?.status)}
                              </span>
                              {statusConfig.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</label>
                            <p className="text-gray-900 font-medium">{r.kycInfo?.phone}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID de Reserva</label>
                            <p className="text-gray-900 font-mono text-sm">{r._id}</p>
                          </div>
                        </div>
                      </div>
                      
                      {r.checkin?.status === "completed" && (
                        <div className="ml-6">
                          <button
                            onClick={() => reportProblem(r._id)}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Reportar Problema
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            🎯 Sistema de Check-In Empresarial • Telefónica Business Solutions • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
