# Display Modular System

Sistema modular moderno para o display público do E-Salas, com componentes reutilizáveis e hooks customizados.

## Estrutura

### Componentes

#### `ModernBackground`
- Background moderno com gradientes e efeitos visuais
- Responsivo e configurável
- Suporte a temas dinâmicos

#### `DisplayHeader`
- Cabeçalho com informações do sistema
- Relógio e data em tempo real
- Status de conexão
- Configurável via props

#### `ModernRoomCard`
- Card moderno para exibição de salas
- Mantém a estrutura de 2 quadrados (nome/status + número)
- Animações e efeitos visuais
- Estados: ocupada/disponível

#### `ModernFloorSection`
- Seção para cada andar
- Grid responsivo de salas
- Cabeçalho do andar com design moderno

#### `LoadingScreen`
- Tela de carregamento moderna
- Configurável via tema
- Animações suaves

### Hooks

#### `useDisplayConfig`
- Gerenciamento de configurações do display
- Persistência no localStorage
- Carregamento assíncrono

#### `useDisplayData`
- Carregamento de dados das salas e andares
- Atualização automática baseada em configuração
- Tratamento de erros

#### `useDisplayTime`
- Relógio em tempo real
- Atualização a cada segundo

#### `useOnlineStatus`
- Monitoramento de status de conexão
- Listeners para eventos online/offline

#### `useDisplayUtils`
- Utilitários para formatação e configuração
- Funções auxiliares para tema e animações

### Tipos

#### `DisplayConfig`
Interface principal para configurações do display:
- `theme`: 'light' | 'dark' | 'auto'
- `refreshInterval`: número (segundos)
- `showClock`: boolean
- `showDate`: boolean
- `fontSize`: 'small' | 'medium' | 'large'
- `animationSpeed`: 'slow' | 'normal' | 'fast'
- `backgroundColor`: string (hex)
- `textColor`: string (hex)
- `accentColor`: string (hex)

## Uso

```tsx
import { 
  ModernBackground, 
  DisplayHeader, 
  ModernFloorSection, 
  LoadingScreen,
  useDisplayConfig,
  useDisplayData,
  useDisplayTime,
  useOnlineStatus
} from '@/components/display';

export default function DisplayPage() {
  const { config } = useDisplayConfig();
  const { salasPorAndar, loading } = useDisplayData(config);
  const currentTime = useDisplayTime();
  const isOnline = useOnlineStatus();

  if (loading) return <LoadingScreen config={config} />;

  return (
    <ModernBackground config={config}>
      <DisplayHeader config={config} currentTime={currentTime} isOnline={isOnline} />
      {salasPorAndar.map(({ andar, salas }) => (
        <ModernFloorSection key={andar.id} andar={andar} salas={salas} config={config} />
      ))}
    </ModernBackground>
  );
}
```

## Características

- ✅ **Modular**: Componentes independentes e reutilizáveis
- ✅ **Configurável**: Sistema de configurações dinâmico
- ✅ **Responsivo**: Design adaptável para diferentes telas
- ✅ **Moderno**: UI/UX contemporânea com animações
- ✅ **Performático**: Hooks otimizados e lazy loading
- ✅ **Acessível**: Suporte a temas e contraste
- ✅ **Manutenível**: Código limpo e bem documentado

## Compatibilidade

- Mantém compatibilidade com componentes antigos
- Suporte a navegadores modernos
- Funciona com Next.js 13+ e React 18+

