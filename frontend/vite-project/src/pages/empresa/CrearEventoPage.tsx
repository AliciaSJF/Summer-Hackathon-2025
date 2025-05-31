import { useState } from "react";
import { crearEvento } from "../../services/eventService";

export default function CrearEventoPage() {
  const businessId =
    localStorage.getItem("businessId") || "683adc369af196301892a609";

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo evento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <input
          type="text"
          name="name"
          placeholder="Nombre del evento"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />

        {/* Descripción */}
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
          className="input"
        />

        {/* Tipo */}
        <label className="block text-sm font-medium">Tipo de evento</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input"
        >
          <option value="fixed">Fijo (sin fecha de fin)</option>
          <option value="temporal">Temporal (con fecha de fin)</option>
        </select>

        {/* Inicio */}
        <div>
          <label className="block text-sm font-medium">
            Fecha y hora de inicio
          </label>
          <input
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Fin (solo si es temporal) */}
        {form.type === "temporal" && (
          <div>
            <label className="block text-sm font-medium">
              Fecha y hora de fin
            </label>
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        )}

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium">Precio (€)</label>
          <input
            type="number"
            name="price"
            min={0}
            value={form.price}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Aforo */}
        <div>
          <label className="block text-sm font-medium">Aforo máximo</label>
          <input
            type="number"
            name="capacity"
            min={1}
            value={form.capacity}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Ubicación */}
        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          value={form.location}
          onChange={handleChange}
          required
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear evento
        </button>
      </form>

      {mensaje && <p className="text-center mt-4">{mensaje}</p>}
    </div>
  );
}
