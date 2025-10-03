# Sistema de Cores do Display E-Salas

## Visão Geral

O sistema de cores foi completamente refatorado do zero, baseado nas cores atuais dos componentes de display. Agora oferece um gerenciamento centralizado, hooks especializados e compatibilidade com o sistema anterior.

## Cores Padrão Identificadas

### Cores Base do Sistema
```typescript
DISPLAY_COLORS = {
  // Salas
  SALA_DISPONIVEL: '#10b981',    // Verde esmeralda
  SALA_OCUPADA: '#3b82f6',       // Azul royal
  
  // Andares
  ANDAR_ACCENT: '#3b82f6',       // Azul royal
  
  // Texto
  TEXTO_BRANCO: '#ffffff',
  
  // Partículas
  PARTICULA_CYAN: '#00fff7',
  PARTICULA_AZUL: '#00eaff',
}
```

### Configuração Completa
```typescript
DEFAULT_DISPLAY_COLORS = {
  sala: {
    disponivel: {
      texto: '#10b981',
      fundo: 'linear-gradient(...)',
      borda: 'rgba(52, 211, 153, 0.4)',
      divisao: 'linear-gradient(...)',
      brilho: 'rgba(16, 185, 129, 0.7)',
      sombra: 'rgba(16, 185, 129, 0.7)',
    },
    ocupada: {
      texto: '#3b82f6',
      fundo: 'linear-gradient(...)',
      borda: 'rgba(59, 130, 246, 0.4)',
      divisao: 'linear-gradient(...)',
      brilho: 'rgba(37, 99, 235, 0.7)',
      sombra: 'rgba(37, 99, 235, 0.7)',
    },
  },
  andar: {
    texto: '#ffffff',
    fundo: 'linear-gradient(...)',
    borda: '#3b82f680',
    divisao: '#3b82f6',
    accent: '#3b82f6',
    brilho: '#3b82f640',
    sombra: '#3b82f640',
  },
  // ... background e partículas
}
```

## Como Usar

### 1. Hooks Básicos

```typescript
import { 
  useSalaColorsWithFallback, 
  useAndarColorsWithFallback,
  useColorVariations 
} from './hooks/useDisplayColors';

// Em um componente de sala
function SalaCard({ sala }) {
  const isOcupada = Boolean(sala.nome_ocupante?.trim());
  const salaColors = useSalaColorsWithFallback(isOcupada);
  const colorVariations = useColorVariations(salaColors.textColor);
  
  return (
    <div style={{ color: salaColors.textColor }}>
      {/* componente */}
    </div>
  );
}

// Em um componente de andar
function AndarCard({ andar }) {
  const andarColors = useAndarColorsWithFallback();
  
  return (
    <div style={{ 
      color: andarColors.texto,
      background: andarColors.fundo 
    }}>
      {/* componente */}
    </div>
  );
}
```

### 2. Hook para Variações de Cores

```typescript
const colorVariations = useColorVariations('#3b82f6');
// Retorna:
// {
//   base: '#3b82f6',
//   alpha10: 'rgba(59, 130, 246, 0.1)',
//   alpha20: 'rgba(59, 130, 246, 0.2)',
//   // ... até alpha90
// }
```

### 3. Hook para Tema Completo

```typescript
const theme = useDisplayTheme();
// Retorna:
// {
//   primary: { salaDisponivel, salaOcupada, andar },
//   background: { primario, secundario, grid, radial },
//   effects: { particulas... },
//   isLight: boolean,
//   isDark: boolean,
// }
```

### 4. Hook para CSS Custom Properties

```typescript
const cssColors = useDisplayCSSColors();
// Retorna:
// {
//   '--display-sala-disponivel': '#10b981',
//   '--display-sala-ocupada': '#3b82f6',
//   '--display-andar-accent': '#3b82f6',
//   // ... outras propriedades CSS
// }
```

### 5. Gerenciamento de Configurações

```typescript
const { config, updateConfig, resetToDefault } = useColorManager();

// Atualizar cores
updateConfig({
  sala: {
    disponivel: {
      texto: '#00ff00', // Nova cor verde
    }
  }
});

// Resetar para padrão
resetToDefault();
```

## Compatibilidade

O sistema mantém **compatibilidade total** com o sistema anterior:

- ✅ `localStorage.getItem('display-color-accent')` ainda funciona
- ✅ `localStorage.getItem('display-text-color-available')` ainda funciona  
- ✅ `localStorage.getItem('display-text-color-occupied')` ainda funciona
- ✅ Componentes existentes continuam funcionando sem alterações

## Migração

### Antes (Sistema Antigo)
```typescript
const accentColor = localStorage.getItem('display-color-accent') || '#3b82f6';
```

### Depois (Sistema Novo)
```typescript
const andarColors = useAndarColorsWithFallback();
const accentColor = andarColors.accentColor; // Inclui fallback automático
```

## Vantagens do Novo Sistema

1. **Centralizado**: Todas as cores em um lugar
2. **Tipado**: TypeScript completo
3. **Reativo**: Atualização automática quando cores mudam
4. **Performático**: Cache inteligente
5. **Flexível**: Fácil customização
6. **Compatível**: Funciona com sistema antigo
7. **Documentado**: Código auto-documentado

## Estrutura de Arquivos

```
display/
├── ColorConfig.ts              # Sistema principal de cores
├── hooks/
│   └── useDisplayColors.ts     # Hooks especializados
├── index.ts                    # Exportações principais
├── CORES-SISTEMA.md           # Esta documentação
└── componentes...             # Componentes atualizados
```

## Exemplos Práticos

### Componente de Sala Completo
```typescript
import { useSalaColorsWithFallback, useColorVariations } from './hooks/useDisplayColors';

export function SalaCard({ sala }) {
  const isOcupada = Boolean(sala.nome_ocupante?.trim());
  const salaColors = useSalaColorsWithFallback(isOcupada);
  const variations = useColorVariations(salaColors.textColor);
  
  return (
    <div
      style={{
        background: salaColors.fundo,
        border: `1px solid ${salaColors.borda}`,
        color: salaColors.texto,
        boxShadow: `0 0 20px ${salaColors.brilho}`,
      }}
    >
      <h3 style={{ textShadow: `0 0 10px ${variations.alpha70}` }}>
        {isOcupada ? sala.nome_ocupante : 'Disponível'}
      </h3>
      <span>{sala.numero_sala}</span>
    </div>
  );
}
```

### Componente de Andar Completo
```typescript
import { useAndarColorsWithFallback, useColorVariations } from './hooks/useDisplayColors';

export function AndarCard({ andar }) {
  const andarColors = useAndarColorsWithFallback();
  const accentVariations = useColorVariations(andarColors.accent);
  
  return (
    <div
      style={{
        background: andarColors.fundo,
        border: `2px solid ${andarColors.borda}`,
        color: andarColors.texto,
        boxShadow: `0 0 25px ${andarColors.brilho}`,
      }}
    >
      <h2 style={{ 
        textShadow: `0 0 15px ${andarColors.accent}` 
      }}>
        {andar.nome_identificador || 'Andar'} {andar.numero_andar}
      </h2>
    </div>
  );
}
```

## Próximos Passos

1. ✅ Sistema de cores implementado
2. ✅ Hooks especializados criados
3. ✅ Componentes atualizados
4. ✅ Compatibilidade mantida
5. 🔄 Testes e validação
6. 🔄 Interface de configuração (se necessário)

---

**Desenvolvido para o E-Salas** - Sistema de gerenciamento de salas moderno e eficiente.
