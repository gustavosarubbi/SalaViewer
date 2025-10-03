import { useState, useEffect } from 'react';

export function useCompanyLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Carregar logo do localStorage na inicialização
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('companyLogo');
      setLogoUrl(savedLogo);
    }
  }, []);

  // Escutar mudanças no localStorage para atualizar em tempo real
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'companyLogo') {
          setLogoUrl(e.newValue);
        }
      };

      // Escutar mudanças de outras abas
      window.addEventListener('storage', handleStorageChange);
      
      // Escutar mudanças na mesma aba (quando o LogoManager atualiza)
      const handleCustomStorageChange = () => {
        const savedLogo = localStorage.getItem('companyLogo');
        setLogoUrl(savedLogo);
      };

      // Evento customizado para mudanças na mesma aba
      window.addEventListener('companyLogo:updated', handleCustomStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('companyLogo:updated', handleCustomStorageChange);
      };
    }
  }, []);

  const updateLogo = (newLogoUrl: string | null) => {
    setLogoUrl(newLogoUrl);
    if (typeof window !== 'undefined') {
      if (newLogoUrl) {
        localStorage.setItem('companyLogo', newLogoUrl);
      } else {
        localStorage.removeItem('companyLogo');
      }
      // Disparar evento customizado para atualizar outros componentes na mesma aba
      window.dispatchEvent(new CustomEvent('companyLogo:updated'));
    }
  };

  return {
    logoUrl,
    updateLogo,
    hasLogo: !!logoUrl
  };
}


