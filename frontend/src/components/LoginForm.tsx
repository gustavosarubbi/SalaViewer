"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useToaster } from '@/hooks/useToaster';
import { apiService, LoginRequest } from '@/services/api';
import AuthInput from './auth/AuthInput';
import AuthButton from './auth/AuthButton';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { showSuccess, showError } = useToaster();

  // Removido suporte a lembrar-me/autofill persistente

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim antes de validar
    setFormData(prev => ({
      email: prev.email.trim(),
      password: prev.password
    }));

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Tentando fazer login com:', { email: formData.email });
      
      // Fazer autenticação real com o backend
      const loginData: LoginRequest = {
        email: formData.email.trim(),
        password: formData.password
      };
      
      const response = await apiService.login(loginData);
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', response.jwt);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      showSuccess('Login realizado com sucesso!', 'Redirecionando para o dashboard...');

      router.push('/dashboard');
      
    } catch (error: unknown) {
      console.error('Erro no login:', error);

      const message = (() => {
        if (error instanceof Error) {
          const msg = error.message || '';
          if (msg.includes('Sessão expirada') || msg.includes('401')) return 'Credenciais inválidas. Verifique seu email e senha.';
          if (msg.includes('Acesso negado') || msg.includes('403')) return 'Acesso negado. Entre em contato com o administrador.';
          if (msg.includes('Muitas tentativas') || msg.includes('429')) return 'Muitas tentativas de login. Aguarde 1 minuto antes de tentar novamente.';
          if (msg.includes('Servidor') || msg.includes('500')) return 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
          if (msg.includes('Tempo limite')) return 'Conexão lenta. Verifique sua internet e tente novamente.';
          if (msg.includes('conexão') || msg.includes('Network')) return 'Falha de conexão. Verifique sua internet e se o servidor está ativo.';
        }
        return 'Falha na autenticação. Verifique suas credenciais e tente novamente.';
      })();

      setErrors({ general: message });
      showError('Falha no login', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          spellCheck={false}
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="seu@email.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email}
        />

        <AuthInput
          label="Senha"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Sua senha"
          leftIcon={<Lock className="h-5 w-5" />}
          rightAction={
            <span
              role="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </span>
          }
          error={errors.password}
        />

        {errors.general && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Opções de lembrar-me e recuperar senha removidas */}

        <AuthButton type="submit" disabled={isLoading} isLoading={isLoading}>
          Entrar
        </AuthButton>
      </form>
      {/* Ajustes para autofill do navegador (Chrome/Edge WebKit e Firefox) */}
      <style jsx global>{`
        /* WebKit (Chrome, Edge, Safari) */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          /* Força o fundo escuro via box-shadow inset (hack do WebKit) */
          -webkit-box-shadow: 0 0 0px 1000px rgba(17, 24, 39, 0.85) inset !important; /* bg-slate-900 ~ */
          box-shadow: 0 0 0px 1000px rgba(17, 24, 39, 0.85) inset !important;
          border-radius: 0.75rem !important; /* combinar com inputs arredondados */
          transition: background-color 0s ease-in-out 0s !important;
        }
        /* Firefox */
        input:-moz-autofill,
        textarea:-moz-autofill,
        select:-moz-autofill {
          box-shadow: 0 0 0 1000px rgba(17, 24, 39, 0.85) inset !important;
          -moz-box-shadow: 0 0 0 1000px rgba(17, 24, 39, 0.85) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
        }
        /* Placeholder consistente em tema escuro */
        input::placeholder { color: rgba(255,255,255,0.5) !important; }
      `}</style>
    </>
  );
}
