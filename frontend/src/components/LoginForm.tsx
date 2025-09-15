'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useToaster } from '@/hooks/useToaster';
import { apiService, LoginRequest } from '@/services/api';

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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Tentando fazer login com:', { email: formData.email });
      
      // Fazer autenticação real com o backend
      const loginData: LoginRequest = {
        email: formData.email,
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
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message?.includes('Network')) {
          errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        }
      }
      
      setErrors({
        general: errorMessage
      });
      showError('Erro no login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="flex items-center text-sm font-medium text-white mb-2">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="seu@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="password" className="flex items-center text-sm font-medium text-white mb-2">
            <Lock className="h-4 w-4 text-gray-400 mr-2" />
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.password ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Sua senha"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Erro geral */}
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Botão de Login */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Entrando...
            </div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
  );
}
