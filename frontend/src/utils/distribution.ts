/**
 * Utilitários simplificados para distribuição de itens entre telas
 */

export interface DistributionResult {
  startIndex: number;
  endIndex: number;
  itemCount: number;
}

/**
 * Calcula a distribuição equilibrada de itens entre múltiplas telas
 */
export function calculateBalancedDistribution(
  totalItems: number,
  screenCount: number,
  screenNumber: number
): DistributionResult {
  if (screenCount <= 1 || screenNumber < 1 || screenNumber > screenCount) {
    return {
      startIndex: 0,
      endIndex: totalItems,
      itemCount: totalItems
    };
  }

  const itemsPerScreen = Math.floor(totalItems / screenCount);
  const extraItems = totalItems % screenCount;
  
  let startIndex = 0;
  let endIndex = 0;
  
  for (let i = 0; i < screenNumber; i++) {
    startIndex = endIndex;
    const itemsInThisScreen = itemsPerScreen + (i < extraItems ? 1 : 0);
    endIndex = startIndex + itemsInThisScreen;
  }
  
  return {
    startIndex,
    endIndex,
    itemCount: endIndex - startIndex
  };
}

/**
 * Obtém os itens para uma tela específica
 */
export function getScreenItems<T>(
  allItems: T[],
  screenCount: number,
  screenNumber: number
): T[] {
  const distribution = calculateBalancedDistribution(
    allItems.length,
    screenCount,
    screenNumber
  );
  
  return allItems.slice(distribution.startIndex, distribution.endIndex);
}



