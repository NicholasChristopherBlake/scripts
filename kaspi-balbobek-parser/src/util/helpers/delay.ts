/**
 * Создает задержку на указанное количество миллисекунд.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Создает случайную задержку от min до max секунд.
 */
export async function randomDelay(min: number, max: number): Promise<void> {
  const delayInSeconds = Math.random() * (max - min) + min; // Получаем случайное число в пределах min и max
  await delay(delayInSeconds * 1000); // Преобразуем в миллисекунды и используем delay
}
