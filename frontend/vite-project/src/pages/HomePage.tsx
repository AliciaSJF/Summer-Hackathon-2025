import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mongoLogo from "../assets/mongodb-logo.png";
import telefonicaLogo from "../assets/telefonica-logo.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#81C564]/20 to-[#529949]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#0068FF]/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#412F1F]/10 to-[#81C564]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Mouse Follower Gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-[#81C564]/10 via-[#0068FF]/5 to-transparent rounded-full blur-2xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
        
        {/* Floating Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header with Sponsor Logos */}
      <div className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* MongoDB Sponsor */}
            <div className={`flex items-center space-x-4 transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
              <img
                src={mongoLogo}
                alt="MongoDB"
                className="h-12 w-auto filter brightness-110"
              />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-[#81C564]">Powered by</p>
                <p>MongoDB Atlas</p>
              </div>
            </div>

            {/* CLiaBLE Brand */}
            <div className={`text-center transform transition-all duration-1000 delay-300 ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#81C564] to-[#529949] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#81C564] to-[#0068FF] bg-clip-text text-transparent">
                  CLiaBLE
                </h1>
              </div>
              <p className="text-xs text-gray-400 tracking-wide">
                Client-oriented • Reliable • AI-Powered
              </p>
            </div>

            {/* Telefónica Sponsor */}
            <div className={`flex items-center space-x-4 transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
              <div className="text-sm text-gray-300 text-right">
                <p className="font-semibold text-[#0068FF]">Powered by</p>
                <p>Telefónica OpenGateway</p>
              </div>
              <img
                src={telefonicaLogo}
                alt="Telefónica"
                className="h-12 w-auto filter brightness-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Hero Section */}
          <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              Plataforma de
              <span className="block bg-gradient-to-r from-[#81C564] via-[#529949] to-[#0068FF] bg-clip-text text-transparent">
                Eventos Inteligente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              Conectamos empresas y usuarios a través de experiencias excepcionales
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Tecnología de vanguardia con MongoDB y Telefónica OpenGateway para crear el futuro de los eventos
            </p>
          </div>

          {/* Action Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            {/* Usuario Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#81C564] to-[#529949] rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
              <button
                onClick={() => navigate("/usuario/registro")}
                className="relative w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-left transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-[#81C564]/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#81C564] to-[#529949] rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#81C564] transition-colors duration-300">
                      Usuario
                    </h3>
                    <p className="text-gray-400 text-sm">Explora y participa</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Descubre eventos increíbles, recibe recomendaciones personalizadas con IA y conecta con experiencias únicas.
                </p>
                
                <div className="flex items-center text-[#81C564] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Comenzar como usuario</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Empresa Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0068FF] to-blue-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
              <button
                onClick={() => navigate("/empresa/home")}
                className="relative w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-left transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-[#0068FF]/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0068FF] to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#0068FF] transition-colors duration-300">
                      Empresa
                    </h3>
                    <p className="text-gray-400 text-sm">Gestiona y analiza</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Crea y gestiona eventos, analiza métricas en tiempo real y optimiza experiencias con insights de IA.
                </p>
                
                <div className="flex items-center text-[#0068FF] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Acceder como empresa</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Features Banner */}
          <div className={`mt-16 transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#81C564]/20 to-[#529949]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#81C564]/30">
                  <svg className="w-8 h-8 text-[#81C564]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">IA Avanzada</h4>
                <p className="text-gray-400 text-sm">Recomendaciones personalizadas y análisis predictivo</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0068FF]/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-[#0068FF]/30">
                  <svg className="w-8 h-8 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Conectividad Global</h4>
                <p className="text-gray-400 text-sm">Tecnología OpenGateway de Telefónica</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#412F1F]/20 to-[#81C564]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#412F1F]/30">
                  <svg className="w-8 h-8 text-[#529949]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Seguridad Empresarial</h4>
                <p className="text-gray-400 text-sm">Base de datos MongoDB segura y escalable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className={`text-center transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
              <p className="text-gray-400 text-sm">
                Desarrollado con ❤️ por <span className="text-[#81C564] font-semibold">CLiaBLE</span> • 
                Impulsado por <span className="text-[#81C564] font-semibold">MongoDB</span> y <span className="text-[#0068FF] font-semibold">Telefónica OpenGateway</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © {new Date().getFullYear()} CLiaBLE. Client-oriented, Reliable and AI-Powered Solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
