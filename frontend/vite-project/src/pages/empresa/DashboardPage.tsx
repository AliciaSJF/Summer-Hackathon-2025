import { useState } from "react";
import Plot from "react-plotly.js";
import BackButton from "../../components/BackButton";

const fiabilidadClientes = {
  x: ["Muy Baja", "Baja", "Normal", "Alta", "Muy Alta"],
  y: [2, 5, 8, 10, 7],
};

const edadPorFiabilidad = [
  {
    subgroup: "Muy Baja",
    x: ["Infantil", "Juvenil", "Adulta", "Senior"],
    y: [0, 1, 1, 0],
  },
  {
    subgroup: "Baja",
    x: ["Infantil", "Juvenil", "Adulta", "Senior"],
    y: [0, 3, 0, 2],
  },
  {
    subgroup: "Normal",
    x: ["Infantil", "Juvenil", "Adulta", "Senior"],
    y: [0, 2, 3, 3],
  },
  {
    subgroup: "Alta",
    x: ["Infantil", "Juvenil", "Adulta", "Senior"],
    y: [2, 3, 3, 2],
  },
  {
    subgroup: "Muy Alta",
    x: ["Infantil", "Juvenil", "Adulta", "Senior"],
    y: [1, 1, 2, 3],
  },
];

const reviewsPorFiabilidad = [
  {
    subgroup: "Muy Baja",
    x: ["1", "2", "3", "4", "5"],
    y: [1, 1, 0, 0, 0],
  },
  {
    subgroup: "Baja",
    x: ["1", "2", "3", "4", "5"],
    y: [1, 1, 3, 0, 0],
  },
  {
    subgroup: "Normal",
    x: ["1", "2", "3", "4", "5"],
    y: [0, 1, 0, 3, 4],
  },
  {
    subgroup: "Alta",
    x: ["1", "2", "3", "4", "5"],
    y: [0, 0, 0, 3, 7],
  },
  {
    subgroup: "Muy Alta",
    x: ["1", "2", "3", "4", "5"],
    y: [0, 0, 1, 2, 4],
  },
];

export default function DashboardPage() {
  const [selectedGroup, setSelectedGroup] = useState("Muy Alta");
  const [selectedReviewGroup, setSelectedReviewGroup] = useState("Muy Alta");

  const ageData = edadPorFiabilidad.find((d) => d.subgroup === selectedGroup);
  const review = reviewsPorFiabilidad.find(
    (d) => d.subgroup === selectedReviewGroup
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BackButton to="/empresa/home" color="#1f2937" />
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard analítica
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Inteligencia de Negocio e Insights de Clientes
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes totales</p>
                <p className="text-3xl font-bold text-gray-900">32</p>
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
                <p className="text-sm font-medium text-gray-600">Alta fiabilidad</p>
                <p className="text-3xl font-bold text-gray-900">17</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Puntuación media</p>
                <p className="text-3xl font-bold text-gray-900">4.2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Customer Reliability Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Análisis de Fiabilidad del Cliente
              </h2>
              <p className="text-gray-600">Distribución de puntuaciones de fiabilidad en tu base de usuarios</p>
            </div>
            <div className="flex justify-center">
              <Plot
                data={[
                  {
                    x: fiabilidadClientes.x,
                    y: fiabilidadClientes.y,
                    type: "bar",
                    marker: { 
                      color: "#3b82f6",
                      line: { color: "#1e40af", width: 1 }
                    },
                    hovertemplate: "<b>%{x}</b><br>Clientes: %{y}<extra></extra>",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 350,
                  paper_bgcolor: "white",
                  plot_bgcolor: "white",
                  margin: { t: 20, b: 60, l: 60, r: 20 },
                  xaxis: { 
                    title: { text: "Nivel de Fiabilidad", font: { size: 14, color: "#374151" } },
                    tickfont: { size: 12, color: "#6b7280" },
                    gridcolor: "#f3f4f6"
                  },
                  yaxis: { 
                    title: { text: "Número de Clientes", font: { size: 14, color: "#374151" } },
                    tickfont: { size: 12, color: "#6b7280" },
                    gridcolor: "#f3f4f6"
                  },
                  font: { family: "Inter, sans-serif" }
                }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>

          {/* Age Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Demografía por Edad
                </h2>
                <p className="text-gray-600">Distribución de edad por segmento de fiabilidad</p>
              </div>
              <div className="flex flex-col items-end">
                <label className="text-sm font-medium text-gray-700 mb-2">Nivel de Fiabilidad</label>
                <select
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {edadPorFiabilidad.map((g) => (
                    <option key={g.subgroup} value={g.subgroup}>
                      {g.subgroup}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <Plot
                data={[
                  {
                    labels: ageData?.x,
                    values: ageData?.y,
                    type: "pie",
                    textinfo: "label+percent",
                    textfont: { size: 12, color: "#374151" },
                    marker: {
                      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                      line: { color: "#ffffff", width: 2 }
                    },
                    hovertemplate: "<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 350,
                  paper_bgcolor: "white",
                  margin: { t: 20, b: 20, l: 20, r: 20 },
                  font: { family: "Inter, sans-serif" },
                  showlegend: true,
                  legend: {
                    orientation: "v",
                    x: 1.05,
                    y: 0.5,
                    font: { size: 12, color: "#374151" }
                  }
                }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>
        </div>

        {/* Reviews Chart - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Análisis de Puntuaciones de Reseñas
              </h2>
              <p className="text-gray-600">Distribución de calificaciones por nivel de fiabilidad del cliente</p>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-sm font-medium text-gray-700 mb-2">Nivel de Fiabilidad</label>
              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={selectedReviewGroup}
                onChange={(e) => setSelectedReviewGroup(e.target.value)}
              >
                {reviewsPorFiabilidad.map((g) => (
                  <option key={g.subgroup} value={g.subgroup}>
                    {g.subgroup}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <Plot
              data={[
                {
                  x: review?.x,
                  y: review?.y,
                  type: "bar",
                  marker: { 
                    color: "#f59e0b",
                    line: { color: "#d97706", width: 1 }
                  },
                  hovertemplate: "<b>Calificación: %{x} estrellas</b><br>Reseñas: %{y}<extra></extra>",
                },
              ]}
              layout={{
                width: 800,
                height: 400,
                paper_bgcolor: "white",
                plot_bgcolor: "white",
                margin: { t: 20, b: 60, l: 60, r: 20 },
                xaxis: { 
                  title: { text: "Calificación (Estrellas)", font: { size: 14, color: "#374151" } },
                  tickfont: { size: 12, color: "#6b7280" },
                  gridcolor: "#f3f4f6"
                },
                yaxis: { 
                  title: { text: "Número de Reseñas", font: { size: 14, color: "#374151" } },
                  tickfont: { size: 12, color: "#6b7280" },
                  gridcolor: "#f3f4f6"
                },
                font: { family: "Inter, sans-serif" }
              }}
              config={{ displayModeBar: false }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            📊 Dashboard impulsado por analítica avanzada • Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
