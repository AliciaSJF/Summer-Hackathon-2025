import { useState } from "react";
import { crearEvento } from "../../services/eventService"; // ← nuevo

export default function CrearEventoPage() {
  const businessId = localStorage.getItem("businessId") || "";
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "fixed",
    start: "",
    end: "",
    capacity: 1,
    location: "",
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
      createdAt: new Date().toISOString(),
    };

    try {
      await crearEvento(businessId, evento); // ← uso del servicio
      setMensaje("✅ Evento creado correctamente");
      setForm({
        name: "",
        description: "",
        type: "fixed",
        start: "",
        end: "",
        capacity: 1,
        location: "",
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
        <input
          type="text"
          name="name"
          placeholder="Nombre del evento"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
          className="input"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input"
        >
          <option value="fixed">Fijo</option>
          <option value="temporal">Temporal</option>
        </select>

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

        <input
          type="number"
          name="capacity"
          placeholder="Aforo"
          min={1}
          value={form.capacity}
          onChange={handleChange}
          required
          className="input"
        />
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
