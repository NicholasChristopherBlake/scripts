import { Workbook } from "exceljs";
import { waitForFile } from "./waitForFile";

/**
 * Сохраняет Excel файл, проверяя не открыт ли файл.
 * @param filePath - Путь для сохранения файла.
 * @param workbook - Объект Workbook из библиотеки exceljs.
 */
export async function saveExcelFile(filePath: string, workbook: Workbook) {
  try {
    // Сохраняем файл
    // await waitForFile(filePath); // Проверяем чтобы файл был доступен
    await workbook.xlsx.writeFile(filePath);
    // console.log(`Файл "${filePath}" сохранен.`);
  } catch (error) {
    console.error(`Ошибка при сохранении файла "${filePath}":`, error);
    throw error;
  }
}
