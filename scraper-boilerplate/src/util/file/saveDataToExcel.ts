import ExcelJS from "exceljs";
import path from "path";
import { ensureFileExists } from "./ensureFileExists";
import { saveExcelFile } from "./saveExcelFile";

/**
 * Сохраняет данные в указанный Excel файл.
 * Добавляет данные в существующий лист или создаёт новый, если лист отсутствует.
 * @param folderPath Путь к папке с файлом.
 * @param fileName Имя Excel файла.
 * @param sheetName Название листа.
 * @param data Двумерный массив данных для сохранения. Например: 
 *  [
      ['Date', 'Product', 'Quantity', 'Price'],
      ['2024-11-19', 'Laptop', 5, 1200],
      ['2024-11-20', 'Phone', 10, 800],
    ];
 */

export async function saveDataToExcel(
  folderPath: string,
  fileName: string,
  sheetName: string,
  data: any[][]
): Promise<void> {
  try {
    const filePath = path.join(folderPath, fileName);
    const fileExists = await ensureFileExists(filePath);

    const workbook = new ExcelJS.Workbook();

    if (fileExists) {
      // Загружаем существующий файл
      await workbook.xlsx.readFile(filePath);

      // Проверяем наличие листа
      let worksheet = workbook.getWorksheet(sheetName);
      if (worksheet) {
        // Добавляем данные в конец существующего листа
        data.forEach((row) => worksheet?.addRow(row));
      } else {
        // Создаем новый лист и добавляем данные
        worksheet = workbook.addWorksheet(sheetName);
        worksheet.addRows(data);
      }
    } else {
      // Если файла нет, создаём новый файл и лист
      const worksheet = workbook.addWorksheet(sheetName);
      worksheet.addRows(data);
    }
    // Сохраняем файл
    await saveExcelFile(filePath, workbook);
    console.log(`Данные сохранены в лист "${sheetName}" файла "${fileName}".`);
  } catch (error) {
    console.log(`Ошибка при сохранении данных в файл ${fileName}`, error);
  }
}
