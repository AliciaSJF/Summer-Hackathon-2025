import { useNavigate } from "react-router-dom";
import mongoLogo from "../assets/mongodb-logo.png";
import telefonicaLogo from "../assets/telefonica-logo.png";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 px-4 relative">
      <div className="relative flex items-center justify-center w-full max-w-6xl">
        {/* Logo MongoDB más grande y más pegado */}
        <img
          src={mongoLogo}
          alt="MongoDB Logo"
          className="absolute -left-36 md:-left-40 md:w-96 opacity-30 pointer-events-none"
        />

        {/* Caja central */}
        <div className="z-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-md text-center space-y-8">
          <h1 className="text-4xl font-semibold text-gray-800 border-b pb-4 shadow-sm">
            ¿Qué eres?
          </h1>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/usuario/registro")}
              className="bg-[#13AA52] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-[#0e8440] transition-all"
            >
              Usuario
            </button>

            <button
              onClick={() => navigate("/empresa/home")}
              className="bg-[#007c91] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-[#005f70] transition-all"
            >
              Empresa
            </button>
          </div>
        </div>

        {/* Logo Telefónica más grande y más pegado */}
        <img
          src={telefonicaLogo}
          alt="Telefónica Logo"
          className="absolute -right-36 md:-right-40 md:w-96 opacity-30 pointer-events-none"
        />
      </div>
    </div>
  );
}
