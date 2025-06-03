import { useEffect, useState } from "react";
import { getBusinessById } from "../../services/businessService";
import { obtenerEventos } from "../../services/eventService";
import { useNavigate } from "react-router-dom";

type Business = {
  name: string;
  vertical: string;
  plan: string;
  apiKey: string;
  config: Record<string, any>;
};

type Evento = {
  _id: string;
  name: string;
  type: string;
  start: string;
  end?: string;
  location: string;
  capacity: number;
};

export default function EmpresaHomePage() {
  const navigate = useNavigate();
  const businessId =
    localStorage.getItem("businessId") || "683adc369af196301892a61f";

  const [business, setBusiness] = useState<Business | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventosLoading, setEventosLoading] = useState(true);
  const [errorEventos, setErrorEventos] = useState("");

  useEffect(() => {
    getBusinessById(businessId)
      .then(setBusiness)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const data = await obtenerEventos(businessId);
        setEventos(data);
      } catch (err) {
        setErrorEventos("❌ Error al cargar eventos");
      } finally {
        setEventosLoading(false);
      }
    }
    cargarEventos();
  }, [businessId]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(business?.apiKey || "");
    alert("API key copiada al portapapeles");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068FF]"></div>
            <p className="text-gray-600 font-medium">Cargando información del negocio...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Portal Empresarial
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Gestión Integral de Eventos y Analítica de Negocio
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-[#0068FF]/10">
              <svg className="w-8 h-8 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-3xl font-bold text-gray-900">Bienvenido, {business?.name}</h2>
              <p className="text-gray-600">Panel de control y gestión empresarial</p>
            </div>
          </div>

          {/* Business Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-[#0068FF] to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-white/80 text-sm font-medium">Vertical</p>
                  <p className="text-white font-bold text-lg">{business?.vertical}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-600 text-sm font-medium">Plan Activo</p>
                  <p className="text-gray-900 font-bold text-lg">{business?.plan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2H9m6 0V9a2 2 0 00-2-2M3 7a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-600 text-sm font-medium">API Key</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 font-mono text-sm">{business?.apiKey.slice(0, 8)}...</p>
                    <button
                      onClick={copyApiKey}
                      className="text-[#0068FF] hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-600 text-sm font-medium">Configuración</p>
                  <p className="text-gray-900 font-bold text-lg">
                    {Object.keys(business?.config || {}).length > 0 ? "Personalizada" : "Estándar"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-2 bg-[#0068FF] rounded-full mr-3"></div>
            Herramientas de Gestión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/empresa/dashboard")}
              className="group bg-gradient-to-r from-[#0068FF] to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-[#0068FF] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Dashboard Analítico</h4>
              <p className="text-white/80 text-sm">Visualiza métricas y KPIs en tiempo real</p>
            </button>

            <button
              onClick={() => navigate("/empresa/eventos/nuevo")}
              className="group bg-white border-2 border-[#0068FF] text-[#0068FF] p-6 rounded-xl hover:bg-[#0068FF] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Crear Evento</h4>
              <p className="text-gray-600 group-hover:text-white/80 text-sm">Organiza nuevos eventos y experiencias</p>
            </button>

            <button
              onClick={() => navigate("/empresa/reseñas")}
              className="group bg-white border-2 border-gray-300 text-gray-700 p-6 rounded-xl hover:border-[#0068FF] hover:text-[#0068FF] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Análisis de Reseñas</h4>
              <p className="text-gray-600 group-hover:text-[#0068FF]/80 text-sm">Insights con inteligencia artificial</p>
            </button>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Eventos Organizados
            </h3>
            <div className="text-sm text-gray-600">
              {eventos.length} evento{eventos.length !== 1 ? 's' : ''} activo{eventos.length !== 1 ? 's' : ''}
            </div>
          </div>

          {eventosLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068FF] mb-4"></div>
              <p className="text-gray-600">Cargando eventos...</p>
            </div>
          ) : errorEventos ? (
            <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-red-600 font-medium">{errorEventos}</p>
            </div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📅</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No hay eventos organizados</h4>
              <p className="text-gray-600 mb-6">Comienza creando tu primer evento para gestionar asistentes y recopilar feedback</p>
              <button
                onClick={() => navigate("/empresa/eventos/nuevo")}
                className="bg-[#0068FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Crear Primer Evento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eventos.map((evento) => (
                <div
                  key={evento._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{evento.name}</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        evento.type === "temporal" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {evento.type === "temporal" ? "Evento Temporal" : "Evento Fijo"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{evento.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(evento.start).toLocaleString()}</span>
                    </div>

                    {evento.type === "temporal" && evento.end && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Hasta: {new Date(evento.end).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Aforo: {evento.capacity} personas</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/empresa/checkin/${evento._id}`)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Gestionar Check-in
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            🏢 Portal Empresarial powered by advanced technology • Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
