import { saveDataToExcel } from "../file/saveDataToExcel";
import { randomDelay } from "../helpers/delay";
import { parseFirstPageKaspi, parseOtherPageKaspi } from "./parseOneKaspi";
import { performance } from "perf_hooks";

/**
 * Функция для парсинга данных с массива URL и сохранения их в Excel.
 * @param {string[]} urls - Массив URL для парсинга.
 * @param folderPath Путь к папке с файлом.
 * @param fileName Имя Excel файла.
 * @param sheetName Название листа.
 * @returns {Promise<void>}
 */
export async function parseManyFirstPageKaspi(
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
      const result = await parseFirstPageKaspi(url);
      // console.log(result);
      results.push(result);

      // Форматируем данные для сохранения
      const data = result.map(
        ({
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        }: {
          id: string;
          title: string;
          brand: string;
          categoryId: string;
          hasVariants: boolean;
          loanAvailable: boolean;
          shopLink: string;
          unitPrice: number;
          unitSalePrice: number;
          priceFormatted: string;
          createdTime: string;
          stickers: any;
          previewImages: any;
          creditMonthlyPrice: number;
          monthlyInstallment: any;
          reviewsLink: string;
          weight: number;
          unit: any;
          rating: number;
          reviewsQuantity: number;
          stock: number;
          currency: string;
          mods: string;
          deliveryDuration: string;
          category: any;
          categoryCodes: any;
          groups: any;
          promo: any;
          majorMerchants: any;
          deliveryZones: any;
        }) => [
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        ]
      );

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
      const data = results.map(
        ({
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        }) => [
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
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

export async function parseManyOtherPagesKaspi(
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
      const result = await parseOtherPageKaspi(url);
      results.push(result);
      // console.log(result);

      // Форматируем данные для сохранения
      const data = result.map(
        ({
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        }: {
          id: string;
          title: string;
          brand: string;
          categoryId: string;
          hasVariants: boolean;
          loanAvailable: boolean;
          shopLink: string;
          unitPrice: number;
          unitSalePrice: number;
          priceFormatted: string;
          createdTime: string;
          stickers: any;
          previewImages: any;
          creditMonthlyPrice: number;
          monthlyInstallment: any;
          reviewsLink: string;
          weight: number;
          unit: any;
          rating: number;
          reviewsQuantity: number;
          stock: number;
          currency: string;
          mods: string;
          deliveryDuration: string;
          category: any;
          categoryCodes: any;
          groups: any;
          promo: any;
          majorMerchants: any;
          deliveryZones: any;
        }) => [
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        ]
      );

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
      const data = results.map(
        ({
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
        }) => [
          id,
          title,
          brand,
          categoryId,
          hasVariants,
          loanAvailable,
          shopLink,
          unitPrice,
          unitSalePrice,
          priceFormatted,
          createdTime,
          stickers,
          previewImages,
          creditMonthlyPrice,
          monthlyInstallment,
          reviewsLink,
          weight,
          unit,
          rating,
          reviewsQuantity,
          stock,
          currency,
          mods,
          deliveryDuration,
          category,
          categoryCodes,
          groups,
          promo,
          majorMerchants,
          deliveryZones,
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
