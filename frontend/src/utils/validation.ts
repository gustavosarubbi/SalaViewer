// Sistema de validação e sanitização robusto

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
  sanitize?: (value: unknown) => unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, unknown>;
}

// Sanitização básica para prevenir XSS
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Sanitização de números
export function sanitizeNumber(input: unknown): number {
  const num = Number(input);
  return isNaN(num) ? 0 : Math.max(0, Math.floor(num));
}

// Validação de email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de número de sala
export function validateRoomNumber(roomNumber: string): boolean {
  const roomRegex = /^[A-Za-z0-9\-_]+$/;
  return roomNumber.length >= 2 && roomNumber.length <= 20 && roomRegex.test(roomNumber);
}

// Validação de número de andar
export function validateFloorNumber(floorNumber: number): boolean {
  return Number.isInteger(floorNumber) && floorNumber >= 1 && floorNumber <= 100;
}

// Validação de nome de ocupante
export function validateOccupantName(name: string | null): boolean {
  if (!name) return true; // Nome é opcional
  const sanitized = sanitizeString(name);
  return sanitized.length >= 3 && sanitized.length <= 30;
}

// Validador genérico
export function validateData(
  data: Record<string, unknown>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    if (!rule) {
      sanitizedData[field] = value;
      continue;
    }

    // Sanitização
    let sanitizedValue = value;
    if (rule.sanitize) {
      sanitizedValue = rule.sanitize(value);
    } else if (typeof value === 'string') {
      sanitizedValue = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitizedValue = sanitizeNumber(value);
    }

    sanitizedData[field] = sanitizedValue;

    // Validações
    if (rule.required && (!sanitizedValue || sanitizedValue === '')) {
      errors[field] = 'Este campo é obrigatório';
      continue;
    }

    if (sanitizedValue && typeof sanitizedValue === 'string') {
      if (rule.minLength && sanitizedValue.length < rule.minLength) {
        errors[field] = `Deve ter pelo menos ${rule.minLength} caracteres`;
        continue;
      }

      if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
        errors[field] = `Deve ter no máximo ${rule.maxLength} caracteres`;
        continue;
      }

      if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
        errors[field] = 'Formato inválido';
        continue;
      }
    }

    if (rule.custom) {
      const customError = rule.custom(sanitizedValue);
      if (customError) {
        errors[field] = customError;
        continue;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}

// Regras de validação para formulários
export const validationRules = {
  // Sala
  numero_sala: {
    required: true,
    minLength: 1,
    maxLength: 4,
    pattern: /^[A-Za-z0-9\-_]+$/,
    sanitize: sanitizeString,
    custom: (value: string) => {
      if (!validateRoomNumber(value)) {
        return 'Número da sala deve conter apenas letras, números, hífens e underscores';
      }
      return null;
    }
  },
  
  nome_ocupante: {
    required: false,
    minLength: 3,
    maxLength: 30,
    sanitize: sanitizeString,
    custom: (value: string) => {
      if (value && !validateOccupantName(value)) {
        return 'Nome do ocupante deve ter entre 3 e 30 caracteres';
      }
      return null;
    }
  },
  
  andar: {
    required: true,
    sanitize: sanitizeNumber,
    custom: (value: number) => {
      if (!validateFloorNumber(value)) {
        return 'Número do andar deve ser entre 1 e 100';
      }
      return null;
    }
  },
  
  // Andar
  numero_andar: {
    required: true,
    sanitize: sanitizeNumber,
    custom: (value: number) => {
      if (!validateFloorNumber(value)) {
        return 'Número do andar deve ser entre 1 e 100';
      }
      return null;
    }
  },
  
  // Login
  email: {
    required: true,
    sanitize: sanitizeString,
    custom: (value: string) => {
      if (!validateEmail(value)) {
        return 'Email inválido';
      }
      return null;
    }
  },
  
  password: {
    required: true,
    minLength: 6,
    maxLength: 128,
    sanitize: sanitizeString
  }
};

// Validação de dados de API
export function validateApiResponse(data: unknown, expectedFields: string[]): boolean {
  if (!data || typeof data !== 'object') return false;
  
  return expectedFields.every(field => field in data);
}

// Sanitização de dados de entrada
export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  
  if (typeof input === 'number') {
    return sanitizeNumber(input);
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}
