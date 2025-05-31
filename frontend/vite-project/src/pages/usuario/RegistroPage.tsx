import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    address: "",
    gender: "male",
  });
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data === true) {
        localStorage.setItem(
          "usuario",
          JSON.stringify({ name: form.name, email: form.email, _id: data.id })
        );
        setMensaje("✅ Registro completado correctamente");
        setErrores({});
        navigate("/usuario/home");
      } else if (typeof data === "object") {
        setErrores(data);
        setMensaje("❌ Algunos campos no son válidos.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error en el registro.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-usuario rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Registro de Usuario
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        {errores.name === false && (
          <p className="text-red-600 text-sm">Nombre inválido</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />
        {errores.email === false && (
          <p className="text-red-600 text-sm">Email inválido</p>
        )}

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          required
          className="input"
        />
        {errores.phone === false && (
          <p className="text-red-600 text-sm">Teléfono inválido</p>
        )}

        <input
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
          required
          className="input"
        />
        {errores.birth_date === false && (
          <p className="text-red-600 text-sm">Fecha inválida</p>
        )}

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          required
          className="input"
        />
        {errores.address === false && (
          <p className="text-red-600 text-sm">Dirección inválida</p>
        )}

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
        >
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>

        <button type="submit" className="btn-usuario w-full">
          Registrarse
        </button>
      </form>

      {mensaje && <p className="mt-4 text-center text-gray-800">{mensaje}</p>}
    </div>
  );
}
