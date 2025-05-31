import { useEffect, useState } from "react";
import { getBusinessById } from "../../services/businessService";

type Business = {
  name: string;
  vertical: string;
  plan: string;
  apiKey: string;
  config: Record<string, any>;
};

export default function EmpresaHomePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const businessId =
    localStorage.getItem("businessId") || "683adc369af196301892a609";

  useEffect(() => {
    getBusinessById(businessId)
      .then((data) => setBusiness(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(business?.apiKey || "");
    alert("API key copiada al portapapeles");
  };

  if (loading)
    return <div className="p-6 text-gray-600">Cargando negocio...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Bienvenido, {business?.name}
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Vertical:</strong>{" "}
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {business?.vertical}
          </span>
        </p>
        <p>
          <strong>Plan:</strong> {business?.plan}
        </p>
        <p>
          <strong>API Key:</strong>
          <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded font-mono">
            {business?.apiKey.slice(0, 8)}...
          </span>
          <button
            onClick={copyApiKey}
            className="ml-2 text-blue-600 hover:underline text-sm"
          >
            Copiar
          </button>
        </p>
        <p>
          <strong>Configuración:</strong>{" "}
          {Object.keys(business?.config || {}).length > 0
            ? "Personalizada"
            : "Sin configuración"}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap gap-4">
        <a
          href="/empresa/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📊 Ver dashboard
        </a>
        <a
          href="/empresa/eventos/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📝 Crear evento
        </a>
        <a
          href="/empresa/checkin"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          🟢 Gestionar check-ins
        </a>
        <a
          href="/empresa/reseñas"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ⭐ Análisis de reseñas
        </a>
      </div>
    </div>
  );
}
