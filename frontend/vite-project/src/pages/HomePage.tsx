import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">¿Quién eres?</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/usuario/login")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
        >
          Soy Usuario
        </button>
        <button
          onClick={() => navigate("/empresa/login")}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
        >
          Soy Empresa
        </button>
      </div>
    </div>
  );
}
