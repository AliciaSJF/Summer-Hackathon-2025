import { useState } from "react";
import type { ReactElement } from "react";
import BackButton from "../../components/BackButton";

type Category = "Ambiente" | "Seguridad" | "Atención al Cliente";

export default function EmpresaResenasPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Replace with actual business ID from context/auth
  const businessId = "683ba4525823e6717d153cde";

  const categories: Category[] = ["Ambiente", "Seguridad", "Atención al Cliente"];

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    // Clean up the text first
    let cleanText = text;
    
    // Remove surrounding quotes if they exist
    if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
      cleanText = cleanText.slice(1, -1);
    }
    
    // Replace escaped characters with actual characters
    cleanText = cleanText
      .replace(/\\n/g, '\n')    // Convert \n to actual newlines
      .replace(/\\t/g, '    ')  // Convert \t to 4 spaces
      .replace(/\\"/g, '"')     // Convert \" to actual quotes
      .replace(/\\\\/g, '\\');  // Convert \\ to single backslash
    
    const lines = cleanText.split('\n');
    const elements: ReactElement[] = [];

    lines.forEach((line, index) => {
      line = line.trim();
      
      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-800">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-900">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">
            {line.substring(2)}
          </h1>
        );
      }
      // Bullet points
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <div key={index} className="flex items-start mb-1">
            <span className="text-[#0068FF] mr-2 mt-1">•</span>
            <span className="text-gray-700">{formatInlineMarkdown(line.substring(2))}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={index} className="flex items-start mb-1">
              <span className="text-[#0068FF] font-medium mr-2 mt-1">{match[1]}.</span>
              <span className="text-gray-700">{formatInlineMarkdown(match[2])}</span>
            </div>
          );
        }
      }
      // Empty lines
      else if (line === '') {
        elements.push(<br key={index} />);
      }
      // Regular paragraphs
      else if (line.length > 0) {
        elements.push(
          <p key={index} className="text-gray-800 mb-3 leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Format inline markdown (bold, italic)
  const formatInlineMarkdown = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Handle **bold** text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-gray-900">
          {match[1]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setLoading(true);
    setError("");
    setAnalysisResult("");

    try {
      const encodedCategory = encodeURIComponent(category);
      const response = await fetch(
        `http://localhost:8001/businesses/reviews_analysys/${businessId}?category=${encodedCategory}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (response.ok) {
        const analysisText = await response.text();
        setAnalysisResult(analysisText);
      } else {
        setError("❌ Error al obtener el análisis de reseñas");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "Ambiente":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "Seguridad":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "Atención al Cliente":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
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
                Análisis de Reseñas con IA
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Insights automatizados sobre la experiencia de tus clientes
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Category Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <div className="w-2 h-2 bg-[#0068FF] rounded-full mr-3"></div>
              Categorías de Análisis
            </h2>
            <p className="text-gray-600">Selecciona una categoría para obtener insights detallados sobre las opiniones de tus clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                disabled={loading}
                className={`group p-8 rounded-xl border-2 transition-all duration-300 transform ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#0068FF] to-blue-600 text-white border-[#0068FF] shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#0068FF] hover:bg-blue-50 hover:scale-105"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
                }`}
              >
                <div className="text-center">
                  <div className={`flex justify-center mb-4 ${
                    selectedCategory === category ? "text-white" : "text-[#0068FF] group-hover:text-[#0068FF]"
                  }`}>
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{category}</h3>
                  <p className={`text-sm ${
                    selectedCategory === category 
                      ? "text-white/80" 
                      : "text-gray-600 group-hover:text-gray-700"
                  }`}>
                    {category === "Ambiente" && "Instalaciones, decoración y atmosfera general"}
                    {category === "Seguridad" && "Protocolos de seguridad y confianza del cliente"}
                    {category === "Atención al Cliente" && "Calidad del servicio y trato personalizado"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-[#0068FF] mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analizando reseñas con IA</h3>
              <p className="text-gray-600">Procesando comentarios de clientes para la categoría "{selectedCategory}"</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Error en el análisis</h4>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <div className="p-2 bg-[#0068FF]/10 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                Análisis de IA - {selectedCategory}
              </h2>
              <p className="text-gray-600">Insights generados automáticamente basados en las reseñas de tus clientes</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="prose max-w-none">
                {renderMarkdown(analysisResult)}
              </div>
            </div>

            {/* Analysis Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-[#0068FF]/10 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0068FF] mb-1">Análisis Inteligente</h4>
                  <p className="text-sm text-blue-800">
                    Este análisis ha sido generado automáticamente utilizando inteligencia artificial avanzada, 
                    procesando todas las reseñas disponibles para la categoría seleccionada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions when nothing is selected */}
        {!selectedCategory && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="p-4 bg-[#0068FF]/10 rounded-full inline-block mb-6">
                <svg className="w-16 h-16 text-[#0068FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Comienza tu análisis
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Selecciona una categoría arriba para obtener insights detallados sobre lo que piensan tus clientes. 
                Nuestro sistema de IA analizará automáticamente todas las reseñas relacionadas.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            🤖 Análisis de Reseñas con IA • Telefónica Business Solutions • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
