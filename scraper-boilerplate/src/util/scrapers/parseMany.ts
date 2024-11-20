import { saveDataToExcel } from "../file/saveDataToExcel";
import { randomDelay } from "../helpers/delay";
import { parseOne, ParseResult } from "./parseOneCheerio";
import { performance } from "perf_hooks";

/**
 * Функция для парсинга данных с массива URL и сохранения их в Excel.
 * @param {string[]} urls - Массив URL для парсинга.
 * @param folderPath Путь к папке с файлом.
 * @param fileName Имя Excel файла.
 * @param sheetName Название листа.
 * @returns {Promise<void>}
 */
export async function parseMany(
  urls: string[],
  folderPath: string,
  fileName: string,
  sheetName: string
): Promise<void> {
  const startTime = performance.now(); // Начало таймера
  console.log(`Начинаем обработку ${urls.length} URL-ов...`);

  const results: ParseResult[] = [];

  for (const url of urls) {
    try {
      const result = await parseOne(url);
      results.push(result);

      // Форматируем данные для сохранения
      const data = results.map(({ title, links, error }) => [
        title || "",
        links.join(", ") || "",
        error || "",
      ]);

      // Сохраняем данные в Excel после обработки каждого URL
      await saveDataToExcel(folderPath, fileName, sheetName, data);

      // Случайная задержка после каждого запроса
      await randomDelay(2, 3);
    } catch (error) {
      console.error(`Ошибка при обработке URL: ${url}`, error);
      results.push({
        title: "",
        links: [],
        error: `Ошибка: ${error}`,
      });

      // Даже при ошибке сохраняем текущие результаты
      const data = results.map(({ title, links, error }) => [
        title || "",
        links.join(", ") || "",
        error || "",
      ]);

      await saveDataToExcel(folderPath, fileName, sheetName, data);
      console.log(`Результаты с ошибкой также сохранены в файл: ${fileName}`);
    }
  }

  const endTime = performance.now(); // Конец таймера
  const duration = ((endTime - startTime) / 1000).toFixed(2); // Время в секундах
  console.log(`Обработка завершена. Всего обработано URL-ов: ${urls.length}`);
  console.log(`Общее время выполнения: ${duration} секунд.`);
}
