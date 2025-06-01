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
    <div className="min-h-screen bg-white py-10 px-4 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-12 relative">
        {/* Botón de volver */}
        <BackButton to="/empresa/home" color="#007c91" />
        <h1 className="text-4xl font-extrabold text-[#00b2a9] mb-8 text-center">
          📊 Panel de Análisis para Empresas
        </h1>

        {/* Histograma de Fiabilidad */}
        <div className="bg-[#f5fcfc] p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-[#007c91] flex items-center gap-2">
            🤝 Fiabilidad del Cliente
          </h2>
          <Plot
            data={[
              {
                x: fiabilidadClientes.x,
                y: fiabilidadClientes.y,
                type: "bar",
                marker: { color: "#007c91" },
              },
            ]}
            layout={{
              width: 700,
              height: 320,
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              margin: { t: 40, b: 60 },
              xaxis: { title: "Fiabilidad" },
              yaxis: { title: "Nº de Clientes" },
            }}
          />
        </div>

        {/* Queso - Distribución de Edad */}
        <div className="bg-[#e8f7fb] p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#007c91] flex items-center gap-2">
              🎂 Distribución de Edad por Fiabilidad
            </h2>
            <select
              className="border border-[#007c91] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b2a9] transition"
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
          <Plot
            data={[
              {
                labels: ageData?.x,
                values: ageData?.y,
                type: "pie",
                textinfo: "percent",
              },
            ]}
            layout={{
              width: 700,
              height: 320,
              paper_bgcolor: "transparent",
              margin: { t: 40, b: 40 },
            }}
          />
        </div>

        {/* Reseñas por Fiabilidad */}
        <div className="bg-[#f5fcfc] p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#007c91] flex items-center gap-2">
              ⭐ Reseñas por Fiabilidad
            </h2>
            <select
              className="border border-[#007c91] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b2a9] transition"
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
          <Plot
            data={[
              {
                x: review?.x,
                y: review?.y,
                type: "bar",
                marker: { color: "#007c91" },
              },
            ]}
            layout={{
              width: 700,
              height: 320,
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              margin: { t: 40, b: 60 },
              xaxis: { title: "Nota" },
              yaxis: { title: "Nº de Reseñas" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
