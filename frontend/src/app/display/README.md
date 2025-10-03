# Sistema de Monitores Múltiplos

Este sistema permite distribuir o display entre múltiplos monitores, cada um mostrando uma parte específica dos andares.

## Como Usar

### 1. Configuração dos Monitores

1. Acesse `/display/setup` no dashboard
2. Configure o número de monitores desejado
3. Ajuste a URL base se necessário
4. Copie as URLs geradas para cada monitor

### 2. URLs Geradas

O sistema gera URLs no formato:
```
http://localhost:3000/display?screen=1&totalScreens=2
http://localhost:3000/display?screen=2&totalScreens=2
```

### 3. Parâmetros da URL

- `screen`: Número da tela (1, 2, 3, etc.)
- `totalScreens`: Total de telas configuradas
- `autoRotate`: Se deve fazer rotação automática (opcional)

### 4. Exemplos de Uso

#### Monitor 1 (Tela 1)
```
http://localhost:3000/display?screen=1&totalScreens=2
```
Mostra: Andares 1-5

#### Monitor 2 (Tela 2)
```
http://localhost:3000/display?screen=2&totalScreens=2
```
Mostra: Andares 6-10

#### Monitor 3 (Tela 3)
```
http://localhost:3000/display?screen=3&totalScreens=3
```
Mostra: Andares 7-10

### 5. Distribuição Automática

O sistema calcula automaticamente quantos andares cada tela deve mostrar:

- **10 andares + 2 telas** = 5 andares por tela
- **10 andares + 3 telas** = 4 andares por tela (última com 2)
- **15 andares + 4 telas** = 4 andares por tela (última com 3)

### 6. Modos de Operação

#### Modo Normal
- URL: `/display`
- Mostra todos os andares
- Header de configuração visível

#### Modo Monitor Fixo
- URL: `/display?screen=X&totalScreens=Y`
- Mostra apenas a tela específica
- Header oculto
- Indicador de tela no canto superior direito

#### Modo Carrossel
- URL: `/display?autoRotate=true`
- Rotaciona automaticamente entre telas
- Header de controle visível

### 7. Configuração de Produção

Para usar em produção, substitua `localhost:3000` pela URL do seu servidor:

```
https://seu-dominio.com/display?screen=1&totalScreens=2
https://seu-dominio.com/display?screen=2&totalScreens=2
```

### 8. Dicas de Implementação

1. **Monitores Físicos**: Cada monitor abre uma URL específica
2. **Navegadores Diferentes**: Use navegadores diferentes para cada monitor
3. **Modo Tela Cheia**: Use F11 para tela cheia em cada monitor
4. **Atualização Automática**: Os dados são atualizados a cada 30 segundos
5. **Responsividade**: Funciona em diferentes tamanhos de tela

### 9. Troubleshooting

- **Tela não aparece**: Verifique se os parâmetros da URL estão corretos
- **Andares duplicados**: Verifique se o `totalScreens` está correto
- **Header não aparece**: No modo monitor fixo, o header fica oculto intencionalmente
- **Dados não atualizam**: Verifique se o backend está rodando

