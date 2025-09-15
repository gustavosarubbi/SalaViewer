export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Erro Interno do Servidor
        </h2>
        <p className="text-gray-600 mb-8">
          Ocorreu um erro inesperado. Tente novamente mais tarde.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
