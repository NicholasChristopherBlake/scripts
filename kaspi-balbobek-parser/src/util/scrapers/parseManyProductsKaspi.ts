import { saveDataToExcel } from "../file/saveDataToExcel";
import { randomDelay } from "../helpers/delay";
import { parseFirstPageKaspi, parseOtherPageKaspi } from "./parseOneKaspi";
import { performance } from "perf_hooks";
import { parseOneProductKaspi } from "./parseOneProductKaspi";

/**
 * Функция для парсинга данных с массива URL и сохранения их в Excel.
 * @param {string[]} urls - Массив URL для парсинга.
 * @param folderPath Путь к папке с файлом.
 * @param fileName Имя Excel файла.
 * @param sheetName Название листа.
 * @returns {Promise<void>}
 */
export async function parseManyProductsKaspi(
  urls: string[],
  folderPath: string,
  fileName: string,
  sheetName: string
): Promise<void> {
  const startTime = performance.now(); // Начало таймера
  console.log(`Начинаем обработку ${urls.length} URL-ов...`);

  const results: any[] = [];

  for (const url of urls) {
    try {
      const result = await parseOneProductKaspi(url);
      results.push(result);
      // console.log(result);

      // Форматируем данные для сохранения
      const data = result.map(
        ({
          url,
          article,
          title,
          short_specifications,
          description,
          characterictics,
          categories,
        }: {
          url: string;
          article: string;
          title: string;
          short_specifications: any[];
          description: string;
          characterictics: any[];
          categories: string;
        }) => [
          url,
          article,
          title,
          short_specifications.join("\n"), // преобразуем в строку
          description,
          characterictics
            .map(
              ({ category, details }) =>
                `${category}: ${details
                  .map(
                    ({ term, definition }: { term: any; definition: any }) =>
                      `${term}: ${definition}`
                  )
                  .join(", ")}`
            )
            .join("; "), // в строку
          categories,
        ]
      );

      // Сохраняем данные в Excel после обработки каждого URL
      await saveDataToExcel(folderPath, fileName, sheetName, data);

      // Случайная задержка после каждого запроса
      await randomDelay(2, 3);
    } catch (error) {
      console.error(`Ошибка при обработке URL: ${url}`, error);
      results.push({
        url: "",
        article: "",
        title: "",
        short_specifications: [],
        description: "",
        characterictics: [],
        categories: "",
        error: `Ошибка: ${error}`,
      });

      // Даже при ошибке сохраняем текущие результаты
      const data = results.map(
        ({
          url,
          article,
          title,
          short_specifications,
          description,
          characterictics,
          categories,
        }: {
          url: string;
          article: string;
          title: string;
          short_specifications: any[];
          description: string;
          characterictics: any[];
          categories: string;
        }) => [
          url,
          article,
          title,
          short_specifications
            .map((spec) => `${spec.key}: ${spec.value}`)
            .join(", "), // Преобразуем short_specifications в строку
          description,
          characterictics
            .map((char) => `${char.key}: ${char.value}`)
            .join(", "), // Преобразуем characterictics в строку
          categories,
        ]
      );

      await saveDataToExcel(folderPath, fileName, sheetName, data);
      console.log(`Результаты с ошибкой также сохранены в файл: ${fileName}`);
    }
  }

  const endTime = performance.now(); // Конец таймера
  const duration = ((endTime - startTime) / 1000).toFixed(2); // Время в секундах
  console.log(`Обработка завершена. Всего обработано URL-ов: ${urls.length}`);
  console.log(`Общее время выполнения: ${duration} секунд.`);
}
