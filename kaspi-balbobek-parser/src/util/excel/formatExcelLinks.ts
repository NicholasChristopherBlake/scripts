import * as Excel from "exceljs";
import path from "path";

/**
 * Функция для разделения ссылок из одной ячейки на несколько колонок.
 * Сейчас ссылки находятся в виде [{"small": link1, "medium": link2, "large": link3}, {}, ...
 * Ссылки будут идти по очереди: все large, все medium, все small
 * @param worksheet - Объект Worksheet из библиотеки exceljs, представляющий лист Excel.
 */
async function formalExcelLinks(
  inputFilePath: string,
  inputSheetName: string,
  outputFilePath: string
) {
  // Загружаем файл Excel
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(inputFilePath);
  const worksheet = workbook.getWorksheet(inputSheetName);

  if (!worksheet) {
    return;
  }
  // Пройдем по строкам и будем динамически добавлять колонки
  worksheet.eachRow((row, rowIndex) => {
    // Предполагаем, что картинки находятся в первой колонке (A)
    const cellValue = row.getCell(1).text;

    // Парсим JSON строку в массив объектов
    try {
      const images = JSON.parse(cellValue);

      // Динамически определяем количество картинок
      const numImages = images.length;

      // Добавляем заголовки для новых колонок
      for (let i = 0; i < numImages; i++) {
        // Для каждой картинки добавляем 3 колонки: large, medium, small
        row.getCell(2 + i).value = images[i].large; // Large
        row.getCell(2 + numImages + i).value = images[i].medium; // Medium
        row.getCell(2 + 2 * numImages + i).value = images[i].small; // Small
      }
    } catch (err) {
      console.error(`Ошибка при парсинге строки ${rowIndex}:`, err);
    }
  });

  // Сохраняем файл
  await workbook.xlsx.writeFile(outputFilePath);
  console.log(`Файл сохранен в ${outputFilePath}`);
}

// Запуск
const inputFilePath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "products_links_copy.xlsx"
);
const outputFilePath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "links_separated.xlsx"
);

formalExcelLinks(inputFilePath, "Links", outputFilePath)
  .then(() => console.log("Процесс завершен"))
  .catch((err) => console.error("Ошибка:", err));
