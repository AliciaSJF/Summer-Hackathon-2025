import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

type Evento = {
  _id: string;
  businessId: string;
  name: string;
  description: string;
  type: string;
  start: string;
  end?: string;
  capacity: number;
  location: string;
  price: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

type EventRecommendation = {
  eventModel: Evento;
  score: number;
};

export default function RecomendacionesEventoPage() {
  const navigate = useNavigate();
  const [recomendaciones, setRecomendaciones] = useState<EventRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultUsuario = {
    _id: "683b55e323204f24b8f09aef",
    name: "Marta Galeano Grijalba",
    email: "csp.nacintegrations@nokia.com",
  };

  if (!localStorage.getItem("usuario")) {
    localStorage.setItem("usuario", JSON.stringify(defaultUsuario));
  }

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    const userId = usuario._id;
    
    fetch(`http://localhost:8001/events/recommendations/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: EventRecommendation[]) => {
        // Sort by score in descending order (highest recommendations first)
        const sortedRecommendations = data.sort((a, b) => b.score - a.score);
        setRecomendaciones(sortedRecommendations);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Error al cargar recomendaciones personalizadas");
      })
      .finally(() => setLoading(false));
  }, [usuario._id]);

  const irADetalle = (id: string) => {
    navigate(`/usuario/eventos/${id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-50";
    if (score >= 0.6) return "text-blue-600 bg-blue-50";
    if (score >= 0.4) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return "¡Muy recomendado!";
    if (score >= 0.6) return "Recomendado";
    if (score >= 0.4) return "Puede interesarte";
    return "Sugerencia general";
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

  const formatPrice = (price: number) => {
    return price === 0 ? "Gratuito" : `${price} €`;
  };

  const getScoreStats = () => {
    const highScore = recomendaciones.filter(r => r.score >= 0.8).length;
    const mediumScore = recomendaciones.filter(r => r.score >= 0.6 && r.score < 0.8).length;
    const lowScore = recomendaciones.filter(r => r.score < 0.6).length;
    return { highScore, mediumScore, lowScore };
  };

  const stats = getScoreStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BackButton to="/usuario/home" color="#1f2937" />
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Recomendaciones IA
              </h1>
              <p className="text-lg text-gray-600 font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Eventos personalizados basados en tus gustos y reseñas
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/usuario/home")}
            className="px-6 py-3 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al inicio
          </button>
          <button
            onClick={() => navigate("/usuario/mis-eventos")}
            className="px-6 py-3 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Mis eventos
          </button>
        </div>

        {/* Statistics Overview */}
        {!loading && !error && recomendaciones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#81C564]/20">
                  <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#412F1F]">Total Recomendaciones</p>
                  <p className="text-3xl font-bold text-gray-900">{recomendaciones.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#81C564]/20">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#412F1F]">Muy recomendados</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.highScore}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#81C564]/20">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#412F1F]">Recomendados</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.mediumScore}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#81C564]/20">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#412F1F]">Sugerencias</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.lowScore}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#81C564] rounded-full mr-3"></div>
              Tus Recomendaciones Personalizadas
            </h2>
            <p className="text-gray-600">Eventos seleccionados especialmente para ti por nuestra IA</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-[#81C564] mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generando recomendaciones</h3>
              <p className="text-gray-600">Analizando tus preferencias y creando sugerencias personalizadas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 mb-1">Error al cargar recomendaciones</h4>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300"
                  >
                    🔄 Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          ) : recomendaciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay recomendaciones disponibles</h3>
              <p className="text-gray-600 mb-6">
                Participa en más eventos y deja reseñas para obtener recomendaciones personalizadas
              </p>
              <button
                onClick={() => navigate("/usuario/home")}
                className="px-6 py-3 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold rounded-lg hover:from-[#529949] hover:to-[#412F1F] transition-all duration-300"
              >
                📋 Ver todos los eventos
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-[#412F1F]">
                    {recomendaciones.length} recomendaciones encontradas
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Ordenados por relevancia
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recomendaciones.map((recomendacion, index) => {
                  const evento = recomendacion.eventModel;
                  const score = recomendacion.score;
                  
                  return (
                    <div
                      key={evento._id}
                      onClick={() => irADetalle(evento._id)}
                      className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden relative"
                    >
                      {/* Recommendation Badge */}
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(score)} border-2 border-white shadow-md`}>
                          #{index + 1} • {(score * 100).toFixed(0)}%
                        </div>
                      </div>

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
                        {/* Recommendation Score Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">{getScoreLabel(score)}</span>
                            <span className="font-semibold">{(score * 100).toFixed(1)}% match</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                score >= 0.8 ? 'bg-green-500' :
                                score >= 0.6 ? 'bg-blue-500' :
                                score >= 0.4 ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${score * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-[#412F1F] group-hover:text-[#529949] transition-colors duration-200">
                          {evento.name}
                        </h3>
                        
                        <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                          {evento.description}
                        </p>
                        
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
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-3 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm">Aforo: {evento.capacity}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Click para ver detalles</span>
                            <svg className="w-5 h-5 text-[#529949] group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Info Section */}
              <div className="mt-8 bg-gradient-to-r from-[#81C564]/10 to-[#529949]/10 border border-[#81C564]/20 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-[#81C564]/20 rounded-lg mr-4">
                    <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#412F1F] mb-2">Recomendaciones con Inteligencia Artificial</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Estas sugerencias se basan en tus reseñas anteriores, eventos a los que has asistido 
                      y patrones de preferencias. Cuantas más reseñas dejes, más precisas serán las recomendaciones.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#412F1F] rounded-xl p-6 text-center">
          <p className="text-white text-sm">
            🌱 Recomendaciones IA • Sistema Profesional • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
