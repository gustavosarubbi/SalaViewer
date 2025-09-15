interface FloorHeaderProps {
  andar: {
    id: number;
    numero_andar: number;
    nome_identificador?: string;
  };
}

export function FloorHeader({ andar }: FloorHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <div className="bg-white px-4 py-3 rounded-xl shadow-xl border-4 border-gray-400 flex items-center space-x-4">
          {/* Primeira bolinha azul */}
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
          
          {/* Texto do andar */}
          <h2 className="text-4xl font-black text-gray-800">
            {andar.numero_andar}º Andar
          </h2>
          
          {/* Segunda bolinha azul */}
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        </div>
      </div>
    </div>
  );
}
