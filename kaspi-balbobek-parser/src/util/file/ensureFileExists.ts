import { promises as fs } from "fs"; // Импортируем promisified версии функций fs для асинхронных операций

/**
 * Проверяет есть ли файл. Возвращает true/false
 * @param filePath Путь к файлу.
 * @returns Возвращает true, если файл существует и false - если нет
 */

export async function ensureFileExists(filePath: string): Promise<boolean> {
  try {
    // Проверяем существование файла
    await fs.access(filePath);
    return true;
    // console.log(`Файл существует.`);
  } catch {
    console.log(`Файл не существует.`);
    return false;
  }
}
