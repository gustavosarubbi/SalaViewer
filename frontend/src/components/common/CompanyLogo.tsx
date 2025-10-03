'use client';

import Image from 'next/image';
import { useCompanyLogo } from '@/hooks/useCompanyLogo';

interface CompanyLogoProps {
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  showPlaceholder?: boolean;
  placeholderText?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function CompanyLogo({ 
  className = '', 
  maxWidth = '120px', 
  maxHeight = '60px',
  showPlaceholder = true,
  placeholderText = 'Logo da Empresa',
  clickable = false,
  onClick
}: CompanyLogoProps) {
  const { logoUrl, hasLogo } = useCompanyLogo();

  if (!hasLogo && !showPlaceholder) {
    return null;
  }

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`flex items-center justify-center ${className} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}`}
      onClick={handleClick}
    >
      {hasLogo ? (
        <Image
          src={logoUrl!}
          alt="Logo da Empresa"
          width={120}
          height={60}
          className="object-contain"
          style={{ 
            maxWidth, 
            maxHeight,
            width: 'auto',
            height: 'auto'
          }}
        />
      ) : showPlaceholder ? (
        <div 
          className="flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-white/50 text-sm font-medium hover:bg-white/20 transition-colors duration-200"
          style={{ 
            width: maxWidth, 
            height: maxHeight,
            minWidth: '120px',
            minHeight: '40px'
          }}
        >
          {placeholderText}
        </div>
      ) : null}
    </div>
  );
}
