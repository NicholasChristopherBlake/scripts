import {
  dataFolderPath,
  inputFilePath,
  outputFileName,
  inputSheetName,
} from "./config/config";
import { readDataFromExcel } from "./util/file/readDataFromExcel";
import { saveDataToExcel } from "./util/file/saveDataToExcel";
import { getCurrentTimestamp } from "./util/helpers/getCurrentTimestamp";
import { parseMany } from "./util/scrapers/parseMany";

// Главная функция
async function main() {
  try {
    console.log("Запуск программы...");

    // Шаг 1: Чтение URL из Excel файла
    console.log(`Читаем данные из файла: ${inputFilePath}`);
    const urls: string[] = await readDataFromExcel(
      inputFilePath,
      inputSheetName,
      "A"
    ); // Получаем массив URL

    if (urls.length === 0) {
      console.error("Входной файл не содержит данные.");
      return;
    }

    console.log(`Найдено ${urls.length} URL для обработки.`);

    // Шаг 2: Создание имени файла для сохранения результатов
    const timestamp = getCurrentTimestamp();
    const baseName = outputFileName; // Имя базового файла
    const dynamicName = `${baseName}_${timestamp}.xlsx`;
    const outputSheetName = "Balbobek Pages";
    console.log(`Результаты будут сохранены в файл: ${dynamicName}`);

    // Шаг 3: Запуск парсера
    console.log("Запускаем парсер...");
    await parseMany(urls, dataFolderPath, dynamicName, outputSheetName);

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
      const errorSheetName = `Error Sheet`;
      console.log(`Сохранение данных с ошибками в файл: ${errorFileName}`);

      await saveDataToExcel(dataFolderPath, errorFileName, errorSheetName, [
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
