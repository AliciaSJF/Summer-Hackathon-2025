import { useState } from "react";
import { crearEvento } from "../../services/eventService";
import BackButton from "../../components/BackButton";

export default function CrearEventoPage() {
  const businessId =
    localStorage.getItem("businessId") || "683adc369af196301892a61f";

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "fixed",
    start: "",
    end: "",
    capacity: 1,
    location: "",
    price: 0,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const evento = {
      businessId,
      name: form.name,
      description: form.description,
      type: form.type,
      start: new Date(form.start).toISOString(),
      end:
        form.type === "temporal" ? new Date(form.end).toISOString() : undefined,
      capacity: Number(form.capacity),
      location: form.location,
      price: Number(form.price),
      createdAt: new Date().toISOString(),
    };

    try {
      await crearEvento(businessId, evento);
      setMensaje("✅ Evento creado correctamente");
      setForm({
        name: "",
        description: "",
        type: "fixed",
        start: "",
        end: "",
        capacity: 1,
        location: "",
        price: 0,
      });
    } catch (err) {
      console.error(err);
      setMensaje("❌ Hubo un error al crear el evento");
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
                Crear Nuevo Evento
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Organiza experiencias memorables para tus clientes
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Success/Error Message */}
        {mensaje && (
          <div className={`mb-8 rounded-xl p-6 border ${
            mensaje.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">
                {mensaje.includes('✅') ? '✅' : '❌'}
              </div>
              <p className="font-medium">{mensaje}</p>
            </div>
          </div>
        )}

        {/* Event Creation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#0068FF] rounded-full mr-3"></div>
              Información del Evento
            </h2>
            <p className="text-gray-600">Complete los detalles para crear su nuevo evento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Conferencia de Tecnología 2024"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Descripción del Evento *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe el evento, actividades incluidas, público objetivo..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ubicación del Evento *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ej: Madrid, Palacio de Congresos"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Evento *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors bg-white"
                >
                  <option value="fixed">Evento Fijo (sin fecha de fin)</option>
                  <option value="temporal">Evento Temporal (con fecha de fin)</option>
                </select>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#0068FF] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fechas y Horarios
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fecha y Hora de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={form.start}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                  />
                </div>

                {form.type === "temporal" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Fecha y Hora de Fin *
                    </label>
                    <input
                      type="datetime-local"
                      name="end"
                      value={form.end}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Capacity and Pricing Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#0068FF] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Aforo y Precios
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Aforo Máximo *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="capacity"
                      min={1}
                      value={form.capacity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                    />
                    <span className="absolute right-4 top-3 text-gray-500 text-sm">personas</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Precio de Entrada *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      min={0}
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0068FF] focus:border-[#0068FF] transition-colors"
                    />
                    <span className="absolute right-4 top-3 text-gray-500 text-sm">€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-8">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#0068FF] to-blue-600 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-[#0068FF] transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Evento
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="p-2 bg-[#0068FF]/10 rounded-lg mr-4">
              <svg className="w-6 h-6 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-[#0068FF] mb-2">Consejos para crear un evento exitoso</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Usa un nombre descriptivo y atractivo</li>
                <li>• Incluye detalles específicos en la descripción</li>
                <li>• Considera el aforo realista para tu espacio</li>
                <li>• Establece precios competitivos para tu mercado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            🎯 Sistema de Gestión de Eventos • Telefónica Business Solutions • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
