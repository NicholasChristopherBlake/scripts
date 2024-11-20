import { dataFolderPath, inputFilePath, inputSheetName } from "./config/config";
import { readDataFromExcel } from "./util/file/readDataFromExcel";
import { saveDataToExcel } from "./util/file/saveDataToExcel";
import { getCurrentTimestamp } from "./util/helpers/getCurrentTimestamp";
import {
  parseManyFirstPageKaspi,
  parseManyOtherPagesKaspi,
} from "./util/scrapers/parseManyKaspi";

const outputFileName = "pages_result";
const outputSheetName = "Balbobek Pages";

// Главная функция
async function main() {
  try {
    console.log("Запуск программы...");

    // Шаг 2: Создание имени файла для сохранения результатов
    const timestamp = getCurrentTimestamp();
    const baseName = outputFileName; // Имя базового файла
    const dynamicName = `${baseName}_${timestamp}.xlsx`;
    console.log(`Результаты будут сохранены в файл: ${dynamicName}`);

    // Для первой страницы:
    const urls = [category14url];

    // Для остальных страниц:
    // const urls: string[] = [];
    // for (let index = 1; index <= category9pages; index++) {
    //   urls.push(
    //     `https://kaspi.kz/yml/product-view/pl/results?page=${index}&q=%3Acategory%3AFurniture%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000`
    //   );
    // }
    console.log(urls);
    // Шаг 3: Запуск парсера
    console.log("Запускаем парсер...");

    // Для первой страницы
    await parseManyFirstPageKaspi(
      urls,
      dataFolderPath,
      dynamicName,
      outputSheetName
    );

    // Для остальных страниц
    // await parseManyOtherPagesKaspi(
    //   urls,
    //   dataFolderPath,
    //   dynamicName,
    //   outputSheetName
    // );

    // // Шаг 4: Форматирование Excel файла
    // console.log("Форматируем Excel файл...");
    // await formatExcelFile(outputFilePath);

    console.log(
      `Обработка завершена. Результаты сохранены в файл: ${dynamicName}`
    );
  } catch (error) {
    console.error("Произошла ошибка:", error);

    // Если произошла ошибка, сохраняем промежуточные данные
    try {
      const timestamp = getCurrentTimestamp();
      const errorFileName = `error_results_${timestamp}.xlsx`;
      console.log(`Сохранение данных с ошибками в файл: ${errorFileName}`);

      await saveDataToExcel(dataFolderPath, errorFileName, outputSheetName, [
        ["Ошибка", error || "Неизвестная ошибка"],
      ]);
      console.log("Данные с ошибками успешно сохранены.");
    } catch (saveError) {
      console.error("Не удалось сохранить файл с ошибками:", saveError);
    }
  }
}

// Запуск программы
main();
