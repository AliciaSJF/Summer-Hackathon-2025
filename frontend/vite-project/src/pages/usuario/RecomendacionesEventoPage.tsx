import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-usuario py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-1">
              🎯 Recomendaciones para ti
            </h1>
            <p className="text-gray-600">
              Eventos personalizados basados en tus gustos y reseñas anteriores
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/usuario/home")}
              className="btn-usuario"
            >
              🏠 Volver al inicio
            </button>
            <button
              onClick={() => navigate("/usuario/mis-eventos")}
              className="btn-usuario"
            >
              📅 Mis eventos
            </button>
          </div>
        </div>

        <hr className="border-gray-300" />

        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Generando recomendaciones personalizadas...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Error al cargar recomendaciones
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-usuario"
            >
              🔄 Intentar de nuevo
            </button>
          </div>
        ) : recomendaciones.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Participa en más eventos y deja reseñas para obtener recomendaciones personalizadas
            </p>
            <button
              onClick={() => navigate("/usuario/home")}
              className="btn-usuario"
            >
              📋 Ver todos los eventos
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-main">
                {recomendaciones.length} recomendaciones encontradas
              </h2>
              <div className="text-sm text-gray-600">
                Ordenados por relevancia ⭐
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recomendaciones.map((recomendacion, index) => {
                const evento = recomendacion.eventModel;
                const score = recomendacion.score;
                
                return (
                  <div
                    key={evento._id}
                    onClick={() => irADetalle(evento._id)}
                    className="cursor-pointer border border-gray-200 p-5 rounded-xl shadow-sm bg-gray-50 hover:bg-white transition-all hover:shadow-md relative"
                  >
                    {/* Recommendation Badge */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                        #{index + 1} • {(score * 100).toFixed(0)}%
                      </div>
                    </div>

                    {/* Recommendation Score Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{getScoreLabel(score)}</span>
                        <span>{(score * 100).toFixed(1)}% match</span>
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

                    <h3 className="text-lg font-semibold text-text-main mb-2">
                      {evento.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {evento.description}
                    </p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>📍 {evento.location}</p>
                      <p>🗓️ {new Date(evento.start).toLocaleString()}</p>
                      {evento.type === "temporal" && evento.end && (
                        <p>➡️ Hasta: {new Date(evento.end).toLocaleString()}</p>
                      )}
                      <p>👥 Aforo: {evento.capacity}</p>
                      <p>💰 Precio: {evento.price} €</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Info Footer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🤖</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Recomendaciones con IA
                  </h4>
                  <p className="text-sm text-blue-800">
                    Estas sugerencias se basan en tus reseñas anteriores, eventos a los que has asistido 
                    y patrones de preferencias. Cuantas más reseñas dejes, más precisas serán las recomendaciones.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
