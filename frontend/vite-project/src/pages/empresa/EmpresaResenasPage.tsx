import { useState } from "react";
import type { ReactElement } from "react";

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
            <span className="text-blue-500 mr-2 mt-1">•</span>
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
              <span className="text-blue-600 font-medium mr-2 mt-1">{match[1]}.</span>
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Análisis de Reseñas</h1>
      <p className="text-gray-600 text-center">
        Selecciona una categoría para ver qué piensan tus usuarios
      </p>

      {/* Category Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedCategory === category
                ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            } ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">
                {category === "Ambiente" && "🏢"}
                {category === "Seguridad" && "🔒"}
                {category === "Atención al Cliente" && "👥"}
              </div>
              <h3 className="font-semibold">{category}</h3>
              <p className="text-sm opacity-75 mt-1">
                {category === "Ambiente" && "Instalaciones y ambiente"}
                {category === "Seguridad" && "Protección y confianza"}
                {category === "Atención al Cliente" && "Servicio y trato"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Analizando reseñas con IA...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && !loading && (
        <>
          {/* Divisor */}
          <hr className="my-6 border-gray-300" />

          {/* Analysis Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              🤖 Análisis de IA - {selectedCategory}
            </h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="prose max-w-none">
                {renderMarkdown(analysisResult)}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 Este análisis ha sido generado automáticamente basándose en las reseñas de tus usuarios.</p>
            </div>
          </div>
        </>
      )}

      {/* Instructions when nothing is selected */}
      {!selectedCategory && !loading && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            ¿Qué quieres analizar?
          </h3>
          <p className="text-gray-600">
            Selecciona una categoría arriba para obtener insights sobre lo que piensan tus usuarios
          </p>
        </div>
      )}
    </div>
  );
}
