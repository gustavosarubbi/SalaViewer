import {
  sanitizeString,
  sanitizeNumber,
  validateEmail,
  validateRoomNumber,
  validateFloorNumber,
  validateOccupantName,
  validateData,
  validationRules
} from '../validation';

describe('Validation Utils', () => {
  describe('sanitizeString', () => {
    it('deve remover caracteres perigosos', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeString('onclick="alert(1)"')).toBe('"alert(1)"');
    });

    it('deve preservar texto normal', () => {
      expect(sanitizeString('João Silva')).toBe('João Silva');
      expect(sanitizeString('Sala 101')).toBe('Sala 101');
    });

    it('deve retornar string vazia para input inválido', () => {
      expect(sanitizeString(null as unknown as string)).toBe('');
      expect(sanitizeString(undefined as unknown as string)).toBe('');
      expect(sanitizeString(123 as unknown as string)).toBe('');
    });
  });

  describe('sanitizeNumber', () => {
    it('deve converter string para número', () => {
      expect(sanitizeNumber('123')).toBe(123);
      expect(sanitizeNumber('0')).toBe(0);
    });

    it('deve retornar 0 para valores inválidos', () => {
      expect(sanitizeNumber('abc')).toBe(0);
      expect(sanitizeNumber(null)).toBe(0);
      expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('deve arredondar para baixo e garantir valor positivo', () => {
      expect(sanitizeNumber(3.7)).toBe(3);
      expect(sanitizeNumber(-5)).toBe(0);
    });
  });

  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateRoomNumber', () => {
    it('deve validar números de sala corretos', () => {
      expect(validateRoomNumber('101')).toBe(true);
      expect(validateRoomNumber('A-101')).toBe(true);
      expect(validateRoomNumber('Sala_101')).toBe(true);
    });

    it('deve rejeitar números de sala inválidos', () => {
      expect(validateRoomNumber('1')).toBe(false); // muito curto
      expect(validateRoomNumber('A@101')).toBe(false); // caractere inválido
      expect(validateRoomNumber('')).toBe(false);
      expect(validateRoomNumber('A'.repeat(21))).toBe(false); // muito longo
    });
  });

  describe('validateFloorNumber', () => {
    it('deve validar números de andar corretos', () => {
      expect(validateFloorNumber(1)).toBe(true);
      expect(validateFloorNumber(50)).toBe(true);
      expect(validateFloorNumber(100)).toBe(true);
    });

    it('deve rejeitar números de andar inválidos', () => {
      expect(validateFloorNumber(0)).toBe(false);
      expect(validateFloorNumber(101)).toBe(false);
      expect(validateFloorNumber(-1)).toBe(false);
      expect(validateFloorNumber(1.5)).toBe(false);
    });
  });

  describe('validateOccupantName', () => {
    it('deve validar nomes corretos', () => {
      expect(validateOccupantName('João Silva')).toBe(true);
      expect(validateOccupantName('Empresa Ltda')).toBe(true);
      expect(validateOccupantName(null)).toBe(true); // opcional
    });

    it('deve rejeitar nomes inválidos', () => {
      expect(validateOccupantName('Jo')).toBe(false); // muito curto
      expect(validateOccupantName('A'.repeat(101))).toBe(false); // muito longo
    });
  });

  describe('validateData', () => {
    it('deve validar dados corretos', () => {
      const data = {
        numero_sala: '101',
        nome_ocupante: 'João Silva',
        andar: 1
      };

      const result = validateData(data, {
        numero_sala: validationRules.numero_sala,
        nome_ocupante: validationRules.nome_ocupante,
        andar: validationRules.andar
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(result.sanitizedData.numero_sala).toBe('101');
    });

    it('deve rejeitar dados inválidos', () => {
      const data = {
        numero_sala: '1', // muito curto
        nome_ocupante: 'Jo', // muito curto
        andar: 0 // inválido
      };

      const result = validateData(data, {
        numero_sala: validationRules.numero_sala,
        nome_ocupante: validationRules.nome_ocupante,
        andar: validationRules.andar
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.numero_sala).toBeDefined();
      expect(result.errors.nome_ocupante).toBeDefined();
      expect(result.errors.andar).toBeDefined();
    });

    it('deve sanitizar dados perigosos', () => {
      const data = {
        numero_sala: '<script>alert("xss")</script>',
        nome_ocupante: 'João<script>alert("xss")</script>Silva',
        andar: 'abc'
      };

      const result = validateData(data, {
        numero_sala: validationRules.numero_sala,
        nome_ocupante: validationRules.nome_ocupante,
        andar: validationRules.andar
      });

      expect(result.sanitizedData.numero_sala).toBe('scriptalert("xss")/script');
      expect(result.sanitizedData.nome_ocupante).toBe('Joãoscriptalert("xss")/scriptSilva');
      expect(result.sanitizedData.andar).toBe(0);
    });
  });
});
