interface DisplayBackgroundProps {
  children: React.ReactNode;
}

export function DisplayBackground({ children }: DisplayBackgroundProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Padrão hexagonal sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,_#d1d5db_1px,transparent_1px),linear-gradient(150deg,_#d1d5db_1px,transparent_1px),linear-gradient(90deg,_#d1d5db_1px,transparent_1px)] bg-[length:40px_70px]"></div>
      </div>
      
      {/* Círculos geométricos decorativos */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Distribuição aleatória mais espalhada */}
        <div className="absolute top-[3%] left-[8%] w-16 h-16 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[12%] left-[35%] w-12 h-12 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[7%] left-[62%] w-14 h-14 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[15%] left-[85%] w-18 h-18 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[25%] left-[15%] w-10 h-10 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[28%] left-[45%] w-20 h-20 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[18%] left-[72%] w-16 h-16 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[35%] left-[5%] w-22 h-22 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[22%] left-[58%] w-14 h-14 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[32%] left-[92%] w-12 h-12 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[42%] left-[25%] w-18 h-18 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[38%] left-[55%] w-24 h-24 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[45%] left-[78%] w-16 h-16 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[48%] left-[12%] w-20 h-20 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[41%] left-[68%] w-14 h-14 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[58%] left-[38%] w-22 h-22 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[52%] left-[65%] w-14 h-14 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[62%] left-[8%] w-18 h-18 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[55%] left-[82%] w-26 h-26 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[68%] left-[22%] w-12 h-12 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[72%] left-[48%] w-16 h-16 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[75%] left-[75%] w-20 h-20 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[78%] left-[18%] w-14 h-14 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[82%] left-[58%] w-18 h-18 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[85%] left-[88%] w-22 h-22 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[88%] left-[32%] w-24 h-24 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[92%] left-[68%] w-12 h-12 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[95%] left-[15%] w-20 h-20 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[97%] left-[52%] w-16 h-16 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[98%] left-[82%] w-18 h-18 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
      </div>
      
      {/* Triângulos geométricos */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Distribuição aleatória mais espalhada */}
        <div className="absolute top-[6%] left-[12%] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[14%] left-[42%] w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[9%] left-[68%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[17%] left-[88%] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[27%] left-[18%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        
        <div className="absolute top-[31%] left-[48%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[21%] left-[75%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[37%] left-[7%] w-0 h-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[24%] left-[62%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[34%] left-[95%] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        
        <div className="absolute top-[44%] left-[28%] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[40%] left-[58%] w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[47%] left-[81%] w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[50%] left-[15%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[43%] left-[71%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        
        <div className="absolute top-[60%] left-[41%] w-0 h-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[54%] left-[68%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[64%] left-[11%] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[57%] left-[85%] w-0 h-0 border-l-[26px] border-r-[26px] border-b-[45px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[70%] left-[25%] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        
        <div className="absolute top-[74%] left-[51%] w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[77%] left-[78%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[80%] left-[21%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[84%] left-[61%] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[87%] left-[91%] w-0 h-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        
        <div className="absolute top-[90%] left-[35%] w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[94%] left-[71%] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[97%] left-[18%] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[99%] left-[55%] w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
        <div className="absolute top-[98%] left-[84%] w-0 h-0 border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1d293f' }}></div>
      </div>
      
      {/* Quadrados e retângulos geométricos */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Distribuição aleatória mais espalhada */}
        <div className="absolute top-[4%] left-[9%] w-12 h-12 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[11%] left-[38%] w-16 h-10 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[8%] left-[65%] w-14 h-14 rotate-60" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[16%] left-[87%] w-18 h-12 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[26%] left-[17%] w-10 h-10 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[29%] left-[46%] w-18 h-12 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[19%] left-[73%] w-14 h-14 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[36%] left-[6%] w-16 h-10 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[23%] left-[59%] w-20 h-16 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[33%] left-[93%] w-12 h-12 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[43%] left-[27%] w-16 h-12 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[39%] left-[57%] w-20 h-16 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[46%] left-[80%] w-14 h-14 rotate-60" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[49%] left-[13%] w-18 h-12 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[42%] left-[70%] w-12 h-10 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[59%] left-[40%] w-20 h-16 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[53%] left-[67%] w-12 h-12 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[63%] left-[10%] w-15 h-15 rotate-60" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[56%] left-[84%] w-18 h-14 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[69%] left-[24%] w-14 h-10 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[73%] left-[50%] w-16 h-12 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[76%] left-[77%] w-18 h-14 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[79%] left-[20%] w-14 h-10 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[83%] left-[60%] w-20 h-16 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[86%] left-[90%] w-12 h-12 rotate-60" style={{ backgroundColor: '#1d293f' }}></div>
        
        <div className="absolute top-[89%] left-[34%] w-24 h-16 rotate-45" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[93%] left-[69%] w-12 h-12 rotate-30" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[96%] left-[16%] w-20 h-20 rotate-60" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[98%] left-[53%] w-16 h-16 rotate-15" style={{ backgroundColor: '#1d293f' }}></div>
        <div className="absolute top-[99%] left-[83%] w-18 h-12 rotate-75" style={{ backgroundColor: '#1d293f' }}></div>
      </div>
      
      {/* Linhas geométricas diagonais */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Distribuição responsiva de linhas */}
        <div className="absolute top-[5%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-12 origin-left"></div>
        <div className="absolute top-[5%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-12 origin-right"></div>
        
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-8 origin-left"></div>
        <div className="absolute top-[20%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-8 origin-right"></div>
        
        <div className="absolute top-[35%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-6 origin-left"></div>
        <div className="absolute top-[35%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-6 origin-right"></div>
        
        <div className="absolute top-[50%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-4 origin-left"></div>
        <div className="absolute top-[50%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-4 origin-right"></div>
        
        <div className="absolute top-[65%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-10 origin-left"></div>
        <div className="absolute top-[65%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-10 origin-right"></div>
        
        <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform rotate-2 origin-left"></div>
        <div className="absolute top-[80%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform -rotate-2 origin-right"></div>
        
        <div className="absolute top-[95%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1d293f] to-transparent transform -rotate-6 origin-left"></div>
        <div className="absolute top-[95%] right-0 w-full h-px bg-gradient-to-l from-transparent via-[#1d293f] to-transparent transform rotate-6 origin-right"></div>
      </div>
      
      {/* Overlay de leve para harmonizar o fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50/40"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
