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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Registro de Usuario
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Crea tu cuenta para acceder a eventos exclusivos
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <div className="w-2 h-2 bg-[#81C564] rounded-full mr-3"></div>
                Información Personal
              </h2>
              <p className="text-gray-600">Completa los siguientes campos para crear tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#412F1F] mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ingresa tu nombre completo"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 placeholder-gray-500 transition-colors duration-200"
                  />
                  {errores.name === false && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Nombre inválido
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#412F1F] mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={form.birth_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 transition-colors duration-200"
                  />
                  {errores.birth_date === false && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fecha inválida
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-[#412F1F] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Información de Contacto
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#412F1F] mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                    {errores.email === false && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Email inválido
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#412F1F] mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+34 xxx xxx xxx"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                    {errores.phone === false && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Teléfono inválido
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-[#412F1F] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Información Adicional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#412F1F] mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Calle, número, ciudad"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 placeholder-gray-500 transition-colors duration-200"
                    />
                    {errores.address === false && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Dirección inválida
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#412F1F] mb-2">
                      Género *
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:border-[#81C564] text-gray-900 transition-colors duration-200"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                <button 
                  type="submit" 
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#81C564] to-[#529949] text-white font-semibold text-lg rounded-lg hover:from-[#529949] hover:to-[#412F1F] focus:outline-none focus:ring-2 focus:ring-[#81C564] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear Cuenta
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {mensaje && (
              <div className={`mt-6 p-4 rounded-lg border ${
                mensaje.includes('✅') 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    mensaje.includes('✅') ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {mensaje.includes('✅') ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium ${
                    mensaje.includes('✅') ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {mensaje}
                  </span>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-8 bg-gradient-to-r from-[#81C564]/10 to-[#529949]/10 border border-[#81C564]/20 rounded-lg p-6">
              <div className="flex items-start">
                <div className="p-2 bg-[#81C564]/20 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#412F1F] mb-2">Información importante</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#81C564] rounded-full mr-2"></span>
                      Todos los campos marcados con (*) son obligatorios
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#81C564] rounded-full mr-2"></span>
                      Tu información está protegida y no será compartida
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#81C564] rounded-full mr-2"></span>
                      Recibirás confirmación por email una vez registrado
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#412F1F] rounded-xl p-6 text-center mt-8">
          <p className="text-white text-sm">
            🌱 Plataforma de Registro • Sistema Profesional • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
