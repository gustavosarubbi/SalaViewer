'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Save, RotateCcw } from 'lucide-react';
import NextImage from 'next/image';
import { useCompanyLogo } from '@/hooks/useCompanyLogo';
import ModalPortal from '@/components/common/ModalPortal';
import { getModalClasses } from '@/styles/modal-styles';

interface LogoManagerProps {
  onLogoChange?: (logoUrl: string | null) => void;
  onClose?: () => void;
  showButton?: boolean;
}

export default function LogoManager({ onLogoChange, onClose, showButton = true }: LogoManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logoUrl, updateLogo } = useCompanyLogo();
  
  // Usar o sistema modular de estilos
  const theme = 'dark';
  const modalClasses = getModalClasses(theme);

  // Controlar abertura do modal baseado na prop showButton
  useEffect(() => {
    if (!showButton) {
      setIsOpen(true);
    }
  }, [showButton]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, GIF).');
        return;
      }

      // Verificar tamanho (máximo 2MB para não prejudicar o display)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert(`A imagem deve ter no máximo 2MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      // Verificar dimensões da imagem
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 400;
        
        if (img.width > maxWidth || img.height > maxHeight) {
          const confirmResize = confirm(
            `A imagem é muito grande (${img.width}x${img.height}px). ` +
            `Para melhor performance no display, recomendamos máximo ${maxWidth}x${maxHeight}px. ` +
            `Deseja continuar mesmo assim?`
          );
          
          if (!confirmResize) {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            return;
          }
        }

        // Se passou nas validações, processar a imagem
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewUrl(result);
        };
        reader.readAsDataURL(file);
      };
      
      img.onerror = () => {
        alert('Erro ao carregar a imagem. Verifique se o arquivo não está corrompido.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      updateLogo(previewUrl);
      onLogoChange?.(previewUrl);
      setIsOpen(false);
      setPreviewUrl(null);
      // Limpar o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    updateLogo(null);
    setPreviewUrl(null);
    onLogoChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Notificar o pai que o modal foi fechado
    onClose?.();
  };

  return (
    <>
      {/* Botão para abrir o modal - apenas se showButton for true */}
      {showButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 hover:border-blue-400/50 rounded-xl transition-all duration-300 text-white hover:text-white group"
          title="Configurar Logo da Empresa"
        >
          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-5 h-5 text-blue-300" aria-hidden="true" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Logo da Empresa</div>
            <div className="text-xs text-white/70">Clique para configurar</div>
          </div>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <ModalPortal isOpen={isOpen}>
          {/* Backdrop */}
          <div 
            className={modalClasses.backdrop}
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className={modalClasses.container}>
            {/* Header */}
            <div className={modalClasses.header}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-5 h-5 text-blue-400" aria-hidden="true" />
                </div>
                <h3 className={modalClasses.title}>Logo da Empresa</h3>
              </div>
              <button
                onClick={handleClose}
                className={modalClasses.closeButton}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className={modalClasses.content}>
              {/* Current Logo Preview */}
              {logoUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Logo Atual:
                  </label>
                  <div className="relative inline-flex items-center justify-center w-36 h-36 bg-white/5 rounded-lg p-2 border border-white/10">
                    <NextImage
                      src={logoUrl}
                      alt="Logo atual da empresa"
                      width={128}
                      height={128}
                      className="max-w-full max-h-full object-contain"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nova Logo:
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors duration-200">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center space-y-2 text-white/70 hover:text-white transition-colors duration-200 w-full"
                  >
                    <Upload className="w-8 h-8" />
                    <div className="text-center">
                      <div className="text-sm font-medium">Clique para selecionar uma imagem</div>
                      <div className="text-xs text-white/50 mt-1">
                        PNG, JPG, GIF (máx. 2MB, recomendado: 800x400px)
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Pré-visualização:
                  </label>
                  <div className="relative inline-flex items-center justify-center w-36 h-36 bg-white/5 rounded-lg p-2 border border-white/10">
                    <NextImage
                      src={previewUrl}
                      alt="Pré-visualização da nova logo"
                      width={128}
                      height={128}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 px-6 pb-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white/70 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Limpar
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-400 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remover
                </button>
              </div>
              
              <button
                onClick={handleSave}
                disabled={!previewUrl}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-200 bg-blue-500/15 border border-blue-500/30 rounded-lg hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
