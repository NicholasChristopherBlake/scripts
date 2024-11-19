import ExcelJS from "exceljs";
import path from "path";
import { promises as fs } from "fs";
import { ensureFileExists } from "./ensureFileExists";

/**
 * Проверяет корректность введенных пользователем данных.
 * @param column Колонка для чтения.
 * @param startRow Начальная строка.
 * @param endRow Конечная строка.
 * @throws Если значения некорректны.
 */
function validateArguments(
  column: string,
  startRow: number,
  endRow?: number
): void {
  if (!/^[A-Z]+$/.test(column)) {
    throw new Error(
      'Колонка должна быть обозначена буквами, например "A", "B".'
    );
  }

  if (startRow < 1 || (endRow !== undefined && endRow < startRow)) {
    throw new Error(
      "Начальная строка должна быть >= 1, а конечная строка >= начальной."
    );
  }
}

/**
 * Читает данные из указанного листа Excel файла.
 * @param filePath Путь к Excel файлу.
 * @param sheetName Название листа.
 * @param column Колонка для чтения (например, "A").
 * @param startRow Номер начальной строки (по умолчанию - 2).
 * @param endRow Номер конечной строки (по умолчанию - до конца листа).
 * @returns Массив значений из указанной колонки. Пустые значения будут возвращаться как ""
 */
export async function readDataFromExcel(
  filePath: string,
  sheetName: string,
  column: string,
  startRow: number = 2, // Значение по умолчанию = 2 (со второй строки)
  endRow?: number
): Promise<any[]> {
  try {
    // Проверяем существование файла
    const fileExists = await ensureFileExists(filePath);
    if (!fileExists) {
      throw new Error(`Файл по пути "${filePath}" не существует.`);
    }

    // Проверяем аргументы
    validateArguments(column, startRow, endRow);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Получаем указанный лист
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Лист "${sheetName}" не найден в файле "${filePath}".`);
    }

    // Определяем конечную строку (если она не указана)
    const lastRow = worksheet.rowCount;
    const effectiveEndRow =
      endRow !== undefined ? Math.min(endRow, lastRow) : lastRow;

    // Читаем данные из указанной колонки
    const data: any[] = [];
    for (let rowIndex = startRow; rowIndex <= effectiveEndRow; rowIndex++) {
      const cell = worksheet.getCell(`${column}${rowIndex}`);
      if (!cell.value) {
        data.push("");
      } else {
        data.push(cell.value);
      }
    }

    return data;
  } catch (error) {
    // Локальная обработка ошибок с выдачей понятного сообщения
    console.error(`Ошибка при чтении файла "${filePath}"`);
    throw error;
  }
}
